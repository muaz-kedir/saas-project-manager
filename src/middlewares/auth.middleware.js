// Auth middleware
const User = require("../models/User");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    // Get user ID from header (simplified - use JWT in production)
    const userId = req.headers["x-user-id"];
    
    if (!userId) {
      return res.status(401).json({ 
        error: "Authentication required",
        message: "Please provide x-user-id header with a valid user ID"
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ 
        error: "Invalid user ID format",
        message: "The x-user-id must be a valid MongoDB ObjectId"
      });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ 
        error: "User not found",
        message: "No user exists with the provided ID"
      });
    }
    
    // Attach user to request
    req.user = {
      userId: user._id,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (error) {
    res.status(401).json({ 
      error: "Authentication failed",
      message: error.message 
    });
  }
};
