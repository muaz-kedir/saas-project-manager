/**
 * Migration Script: Add Task Details Fields
 * 
 * This script adds the new fields (dueDate, labels, comments, activity) 
 * to existing tasks in the database with default values.
 * 
 * Run with: node src/migrations/add-task-details-fields.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Run migration
const runMigration = async () => {
  try {
    console.log('Starting migration: Add task details fields...\n');

    // Get the Task collection
    const Task = mongoose.connection.collection('tasks');

    // Count existing tasks
    const totalTasks = await Task.countDocuments();
    console.log(`Found ${totalTasks} tasks to migrate`);

    if (totalTasks === 0) {
      console.log('No tasks to migrate');
      return;
    }

    // Update all tasks that don't have the new fields
    const result = await Task.updateMany(
      {
        $or: [
          { dueDate: { $exists: false } },
          { labels: { $exists: false } },
          { comments: { $exists: false } },
          { activity: { $exists: false } }
        ]
      },
      {
        $set: {
          dueDate: null,
          labels: [],
          comments: [],
          activity: []
        }
      }
    );

    console.log(`\n✓ Migration completed successfully`);
    console.log(`  - Matched: ${result.matchedCount} tasks`);
    console.log(`  - Modified: ${result.modifiedCount} tasks`);

    // Create indexes
    console.log('\nCreating indexes...');
    await Task.createIndex({ dueDate: 1 });
    await Task.createIndex({ 'activity.timestamp': -1 });
    console.log('✓ Indexes created successfully');

  } catch (error) {
    console.error('✗ Migration failed:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await runMigration();
    console.log('\n✓ All migration tasks completed');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
};

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { runMigration };
