import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, getAllDoctors, token } =
    useContext(AppContext);
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);

  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = await doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    if (!docInfo) {
      return;
    }
    setDocSlots([]); // Reset the slots

    let today = new Date(); // Get the current date
    let allSlots = []; // Array to store slots for 7 days

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i); // Move to the next day

      // Set the end time (9 PM for each day)
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // Set time to 9:00 PM

      // Set the start time
      if (i === 0) {
        // For today, start from the next available slot after the current time
        if (currentDate.getHours() >= 10) {
          let minutes = currentDate.getMinutes();
          currentDate.setMinutes(minutes < 30 ? 30 : 0);
          currentDate.setHours(
            currentDate.getHours() + (minutes >= 30 ? 1 : 0)
          );
        } else {
          // If it's before 10 AM, start from 10 AM
          currentDate.setHours(10, 0, 0, 0);
        }
      } else {
        // For future days, start from 10:00 AM
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = []; // Array to store time slots for this day

      // Loop to create 30-minute intervals between start time and end time
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        let day = currentDate.getDay();
        let month = currentDate.getMonth();
        let year = currentDate.getFullYear();

        const slotDate = day + '_' + month + '_' + year;
        const slotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        // Add slot to the array
        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment the time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // Add this day's slots to the main array
      allSlots.push(timeSlots);
    }

    // Set all the slots at once
    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book an appointment');
      return navigate('/login');
    }
    try {
      const date = docSlots[slotIndex][0].dateTime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const slotDate = day + '-' + month + '-' + year;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div>
        {/* --------Doctor Details-------- */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img
              className='bg-primary w-full sm:max-w-72 rounded-lg'
              src={docInfo.image}
              alt=''
            />
          </div>
          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            {/* ---------- Doc Info : name, degree, experience ----------- */}
            <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
              {docInfo.name}
              <img className='w-5' src={assets.verified_icon} alt='' />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>
                {docInfo.experience}
              </button>
            </div>
            {/* --------- Doctor's About --------- */}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img src={assets.info_icon} alt='' />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
                {docInfo.about}
              </p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee :{' '}
              <span className='text-gray-600'>
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* ---------Booking Slots---------- */}
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking Slots</p>
          <div className='flex gap-3 items-center w-full mt-4'>
            {docSlots &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? 'bg-primary text-white'
                      : 'border border-gray-200'
                  }`}
                  key={index}
                >
                  <p>{item[0] && days[item[0].dateTime.getDay()]}</p>
                  <p>{item[0] && item[0].dateTime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className='flex items-center gap-3 w-full no-scrollbar mt-4'>
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? 'bg-primary text-white'
                      : 'border border-gray-200'
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button
            onClick={bookAppointment}
            className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'
          >
            Book An Appointment
          </button>
        </div>

        {/* --------Related Doctors-------- */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
