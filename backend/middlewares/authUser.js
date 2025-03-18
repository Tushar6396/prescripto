import jwt from 'jsonwebtoken';

//  This middleware will convert the token from the user to the user id
const authUser = (req, res, next) => {
  try {
    // Log the headers for debugging
    // console.log('Headers:', req.headers);

    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    // console.log('Authorization Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"
    // console.log('Extracted Token:', token);

    // Check if the token is present
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied! Login again.',
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = decodedToken.id;

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

export default authUser;
