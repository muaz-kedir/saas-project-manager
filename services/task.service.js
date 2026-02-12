const mongoose = require("mongoose");
const Task = require("../models/Task");
const Activity = require("../models/Activity");

exports.moveTaskService = async ({
  taskId,
  newColumnId,
  newOrder,
  userId
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await Task.findById(taskId).session(session);
    if (!task) throw new Error("Task not found");

    const oldColumn = task.column.toString();
    const oldOrder = task.order;

    // CASE 1: Same column reorder
    if (oldColumn === newColumnId) {
      if (newOrder > oldOrder) {
        // moving down
        await Task.updateMany(
          {
            column: oldColumn,
            order: { $gt: oldOrder, $lte: newOrder },
            _id: { $ne: taskId },
            isDeleted: false
          },
          { $inc: { order: -1 } },
          { session }
        );
      } else if (newOrder < oldOrder) {
        // moving up
        await Task.updateMany(
          {
            column: oldColumn,
            order: { $gte: newOrder, $lt: oldOrder },
            _id: { $ne: taskId },
            isDeleted: false
          },
          { $inc: { order: 1 } },
          { session }
        );
      }
    }

    // CASE 2: Different column
    else {
      // Close gap in old column
      await Task.updateMany(
        {
          column: oldColumn,
          order: { $gt: oldOrder },
          isDeleted: false
        },
        { $inc: { order: -1 } },
        { session }
      );

      // Shift tasks in new column
      await Task.updateMany(
        {
          column: newColumnId,
          order: { $gte: newOrder },
          isDeleted: false
        },
        { $inc: { order: 1 } },
        { session }
      );

      task.column = newColumnId;
    }

    task.order = newOrder;
    await task.save({ session });

    // Log activity
    await Activity.create(
      [{
        user: userId,
        workspace: task.workspace,
        action: "MOVE_TASK",
        entity: "Task",
        entityId: task._id
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return task;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
