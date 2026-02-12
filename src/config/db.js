// Database configuration
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    
    // In production, don't exit - let server run without DB
    if (process.env.NODE_ENV === 'production') {
      console.log("⚠️  Running in production mode without database");
      return null;
    }
    
    // In development, exit on DB failure
    process.exit(1);
  }
};

module.exports = connectDB;
