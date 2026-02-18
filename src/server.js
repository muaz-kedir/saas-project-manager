// Server entry point
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { initializeSocket } = require("./socket");

const PORT = process.env.PORT || 5000;

// Start server FIRST (required for Render)
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Initialize Socket.io
initializeSocket(server);
console.log('✅ Socket.io initialized');

// Connect database AFTER server starts
connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    console.log("⚠️  Server running without database connection");
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  // Don't exit in production, just log the error
  if (process.env.NODE_ENV !== 'production') {
    server.close(() => process.exit(1));
  }
});
