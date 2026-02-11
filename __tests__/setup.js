// Test setup file - using actual MongoDB
const mongoose = require("mongoose");

// Connect to test database before all tests
beforeAll(async () => {
  const mongoUri = process.env.MONGO_TEST_URI || "mongodb://127.0.0.1:27017/saas_pm_test";
  
  await mongoose.connect(mongoUri);
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.disconnect();
});
