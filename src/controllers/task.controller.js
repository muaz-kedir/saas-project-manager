// Task controller
const Task = require("../models/Task");

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const { columnId } = req.params;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      column: columnId,
      assignedTo,
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks in column
exports.getTasks = async (req, res) => {
  try {
    const { columnId } = req.params;

    const tasks = await Task.find({ column: columnId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ order: 1 });

    res.json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, assignedTo, order } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    if (order !== undefined) task.order = order;

    await task.save();

    res.json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Move task to different column
exports.moveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { columnId, order } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.column = columnId;
    if (order !== undefined) task.order = order;
    await task.save();

    res.json({
      message: "Task moved successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
