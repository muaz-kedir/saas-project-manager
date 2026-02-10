const express = require("express");

const app = express();

app.use(express.json());

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/workspaces", require("./modules/workspace/workspace.routes"));

app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

module.exports = app;
