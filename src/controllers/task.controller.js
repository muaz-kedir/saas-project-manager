// Task controller
const Task = require("../models/Task");

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, order } = req.body;
    const { columnId } = req.params;

    // Calculate order if not provided
    let taskOrder = order;
    if (taskOrder === undefined) {
      const lastTask = await Task.findOne({ column: columnId }).sort({ order: -1 });
      taskOrder = lastTask ? lastTask.order + 1 : 0;
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      column: columnId,
      assignedTo,
      order: taskOrder,
      activity: [{
        eventType: 'created',
        user: req.user.userId,
        description: 'Created task',
        timestamp: new Date()
      }]
    });

    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'column', select: 'name' }
    ]);

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks in column
exports.getTasks = async (req, res) => {
  try {
    const { columnId } = req.params;

    const tasks = await Task.find({ column: columnId })
      .populate("assignedTo", "name email")
      .sort({ order: 1 });

    res.json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single task with full details
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate("assignedTo", "name email")
      .populate("column", "name")
      .populate("comments.author", "name email")
      .populate("activity.user", "name email");

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
    const { title, description, priority, dueDate, assignedTo, order, labels } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Track changes for activity log
    const changes = [];
    
    if (title && title !== task.title) {
      changes.push({ field: 'title', oldValue: task.title, newValue: title });
      task.title = title;
    }
    
    if (description !== undefined && description !== task.description) {
      changes.push({ field: 'description', oldValue: task.description, newValue: description });
      task.description = description;
    }
    
    if (dueDate !== undefined && dueDate !== task.dueDate) {
      changes.push({ field: 'dueDate', oldValue: task.dueDate, newValue: dueDate });
      task.dueDate = dueDate;
    }
    
    if (assignedTo !== undefined && assignedTo !== task.assignedTo?.toString()) {
      changes.push({ field: 'assignedTo', oldValue: task.assignedTo, newValue: assignedTo });
      task.assignedTo = assignedTo || null;
      
      // Add activity for assignment
      task.activity.push({
        eventType: 'assigned',
        user: req.user.userId,
        description: assignedTo ? 'Task assigned' : 'Task unassigned',
        metadata: { field: 'assignedTo', newValue: assignedTo }
      });
    }
    
    if (labels !== undefined) {
      task.labels = labels;
    }
    
    if (order !== undefined) {
      task.order = order;
    }

    // Add activity for edits
    if (changes.length > 0) {
      task.activity.push({
        eventType: 'edited',
        user: req.user.userId,
        description: `Updated ${changes.map(c => c.field).join(', ')}`,
        metadata: changes[0]
      });
    }

    await task.save();
    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'column', select: 'name' },
      { path: 'comments.author', select: 'name email' },
      { path: 'activity.user', select: 'name email' }
    ]);

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

    const task = await Task.findById(id).populate('column', 'name');
    const oldColumnName = task.column?.name;

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldColumnId = task.column._id.toString();
    task.column = columnId;
    if (order !== undefined) task.order = order;
    
    // Add activity for column move
    if (oldColumnId !== columnId) {
      const Column = require('../models/Column');
      const newColumn = await Column.findById(columnId);
      
      task.activity.push({
        eventType: 'moved',
        user: req.user.userId,
        description: `Moved from ${oldColumnName} to ${newColumn.name}`,
        metadata: { 
          field: 'column',
          oldValue: oldColumnId,
          newValue: columnId
        }
      });
    }
    
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

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = {
      text: text.trim(),
      author: req.user.userId,
      createdAt: new Date()
    };

    task.comments.push(comment);
    
    // Add activity for comment
    task.activity.push({
      eventType: 'commented',
      user: req.user.userId,
      description: 'Added a comment',
      timestamp: new Date()
    });

    await task.save();
    await task.populate([
      { path: 'comments.author', select: 'name email' },
      { path: 'activity.user', select: 'name email' }
    ]);

    res.status(201).json({
      message: "Comment added successfully",
      comment: task.comments[task.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get task activity
exports.getActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .select('activity')
      .populate('activity.user', 'name email');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Sort activity by timestamp descending (newest first)
    const sortedActivity = task.activity.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json({ 
      count: sortedActivity.length,
      activity: sortedActivity 
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: error.message });
  }
};
