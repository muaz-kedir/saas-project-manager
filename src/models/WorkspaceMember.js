// WorkspaceMember model
const mongoose = require("mongoose");

const workspaceMemberSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["OWNER", "ADMIN", "MEMBER"],
    default: "MEMBER",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("WorkspaceMember", workspaceMemberSchema);
