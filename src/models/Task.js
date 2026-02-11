const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  column: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Column",
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
