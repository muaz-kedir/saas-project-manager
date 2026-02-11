const express = require("express");

const app = express();

app.use(express.json());

// Auth routes
app.use("/api/auth", require("./modules/auth/auth.routes"));

// Workspace routes
app.use("/api/workspaces", require("./modules/workspace/workspace.routes"));

// Project management routes
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/boards", require("./routes/board.routes"));
app.use("/api/columns", require("./routes/column.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

// Root route
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

module.exports = app;
