import jwt from 'jsonwebtoken';

//  Admin authentication middleware
//  This middleware will check if the user is an admin or not
const authAdmin = (req, res, next) => {
  try {
    // Log the headers for debugging
    console.log('Headers:', req.headers);

    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    const adminToken = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"
    console.log('Extracted Token:', adminToken);

    // Check if the token is present
    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: 'Access denied! Login again.',
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(adminToken, process.env.JWT_SECRET);
    console.log('Decoded Token:', decodedToken);

    // Check if the decoded token contains the admin email
    if (decodedToken !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized!',
      });
    }
    // if the token is valid, then the user is an admin
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

export default authAdmin;
