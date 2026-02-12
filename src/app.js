const express = require("express");
const cors = require("cors");

const app = express();

// CORS configuration - Allow frontend to access backend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth routes
app.use("/api/auth", require("./modules/auth/auth.routes"));

// Workspace routes
app.use("/api/workspaces", require("./modules/workspace/workspace.routes"));

// Project management routes
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/boards", require("./routes/board.routes"));
app.use("/api/columns", require("./routes/column.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

// Error handler middleware (must be last)
const { errorHandler } = require("./middlewares/error.middleware");
app.use(errorHandler);

module.exports = app;
