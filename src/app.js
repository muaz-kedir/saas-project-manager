const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./modules/auth/auth.routes"));

// Test route
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

module.exports = app;
