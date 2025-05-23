import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay';

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, dob, gender } = req.body;

    if (!name || !email || !password || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: 'Please enter a valid email',
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    if (password.length < 6) {
      return res.json({
        success: false,
        message: 'Please enter a strong passsword',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (phone.length > 10 || phone.length < 10) {
      return res.json({
        success: false,
        message: 'Please enter a valid phone number',
      });
    }

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      gender,
      dob,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, message: 'Used Registered Successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: 'Please enter all the required fields',
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({
        success: true,
        token,
        message: 'Used Logged In Successfully',
      });
    } else {
      return res.json({
        success: false,
        message: 'Please enter valid credentials',
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select('-password');
    return res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Missing data' });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      address,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });

      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: 'Profile Updated Successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select('-password');
    // check for doctor's availability
    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' });
    }
    const slots_booked = docData.slots_booked;
    // check for slots availability

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId);

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save the new appointment in the doctor data
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: 'Appointment Booked Successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments for my-appointments page
const listAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel
      .find({ userId })
      .populate('docId');
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel the appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user
    if (userId !== appointmentData.userId) {
      return res.json({ success: false, message: 'Unauthorized Action' });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing slots from doctor data
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment Cancelled Successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Check if environment variables are present
// if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
//   throw new Error(
//     'Razorpay key_id and key_secret are required in environment variables.'
//   );
// }

// Initialize Razorpay instance
const razorpayInstance = new razorpay({
  key_id: 'rzp_test_i0UBiiNenoJzcw',
  key_secret: 'dnZvxPP1uEpTsWWpo0aKoIv1',
});

// API to make the payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: 'Appointment cancelled or not found',
      });
    }

    // creating options for razorpay payments
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // Creation of the order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      res.json({ success: true, message: 'Payment Successful' });
    } else {
      res.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
