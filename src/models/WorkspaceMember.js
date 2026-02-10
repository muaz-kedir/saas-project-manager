// WorkspaceMember model
const mongoose = require("mongoose");

const workspaceMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN"],
      default: "ADMIN"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkspaceMember", workspaceMemberSchema);
