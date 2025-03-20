import jwt from 'jsonwebtoken';

//  This middleware will convert the token from the doctor to the doctor id
const authDoctor = (req, res, next) => {
  try {
    // Log the headers for debugging
    // console.log('Headers:', req.headers);

    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    // console.log('Authorization Header:', authHeader);

    const doctorToken = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"
    // console.log('Extracted Token:', token);

    // Check if the token is present
    if (!doctorToken) {
      return res.status(401).json({
        success: false,
        message: 'Access denied! Login again.',
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(doctorToken, process.env.JWT_SECRET);

    req.body.docId = decodedToken.id;

    // if the token is valid, move to the next
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

export default authDoctor;
