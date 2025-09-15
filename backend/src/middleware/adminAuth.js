const jwt = require("jsonwebtoken");

// JWT Secret (should match the one in loginRouter)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Middleware to verify JWT token and extract hospital information
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required"
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // Add hospital information to request object
    req.hospital = {
      id: decoded.id,           // MongoDB ObjectId
      hospitalId: decoded.hospitalId,  // Custom hospital ID
      type: decoded.type
    };

    next();
  });
};

// Optional middleware - continues even if no token provided
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.hospital = {
          id: decoded.id,
          hospitalId: decoded.hospitalId,
          type: decoded.type
        };
      }
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};
