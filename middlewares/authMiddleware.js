// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (requiredRole) => (req, res, next) => {
  // Check for token in 'Authorization' header (in Bearer token format)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Attach the decoded user information to the request object
    req.user = decoded;
    
    // Check user role and match with required role if provided
    if (requiredRole && req.user.role !== requiredRole) {
      return res.status(403).json({ message: `Access denied. ${requiredRole} role required.` });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid token
    return res.status(401).json({ message: 'Invalid token. Access denied.' });
  }
};

