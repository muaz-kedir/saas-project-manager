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
  },
  dueDate: {
    type: Date,
    default: null
  },
  labels: {
    type: [String],
    default: []
  },
  comments: [{
    text: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  activity: [{
    eventType: {
      type: String,
      enum: ['created', 'moved', 'edited', 'assigned', 'commented'],
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed
    }
  }]
}, { timestamps: true });

// Indexes for query performance
taskSchema.index({ dueDate: 1 });
taskSchema.index({ 'activity.timestamp': -1 });

module.exports = mongoose.model("Task", taskSchema);
