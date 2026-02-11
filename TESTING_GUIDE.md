# Testing Guide

## Overview

This project uses:
- **Jest**: Testing framework
- **Supertest**: HTTP assertions for API testing
- **MongoDB**: Separate test database for isolated testing

## Installation

Install the testing dependencies:

```bash
npm install
```

This will install:
- `jest` - Testing framework
- `supertest` - HTTP testing library

**Important**: Make sure MongoDB is running on your system before running tests. The tests use a separate test database (`saas_pm_test`) so your development data is safe.

## Folder Structure

```
project-root/
├── __tests__/
│   ├── setup.js                    # Test setup (MongoDB Memory Server)
│   ├── helpers/
│   │   └── testHelpers.js          # Helper functions for tests
│   ├── auth.test.js                # Auth API tests
│   ├── workspace.test.js           # Workspace API tests
│   └── workspace.invite.test.js    # Workspace invite tests
├── src/
│   ├── models/
│   ├── modules/
│   ├── middlewares/
│   └── app.js
├── jest.config.js                  # Jest configuration
└── package.json
```

## Running Tests

**Before running tests, make sure MongoDB is running!**

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npx jest __tests__/auth.test.js
```

### Run tests matching a pattern
```bash
npx jest --testNamePattern="should register"
```

## Understanding the Test Files

### 1. setup.js
This file runs before all tests and:
- Connects to a test MongoDB database
- Clears data after each test
- Closes connection after all tests

The test database is separate from your development database (saas_pm_test vs saas_pm).

### 2. testHelpers.js
Contains helper functions to:
- Create test users
- Create test workspaces
- Create workspace members

This reduces code duplication in tests.

### 3. Test Files (*.test.js)
Each test file follows this structure:

```javascript
describe("Feature Name", () => {
  // Setup before each test
  beforeEach(async () => {
    // Create test data
  });

  describe("Specific Endpoint", () => {
    it("should do something", async () => {
      // 1. Make request
      const response = await request(app)
        .post("/api/endpoint")
        .send(data)
        .expect(200);

      // 2. Assert response
      expect(response.body).toHaveProperty("message");

      // 3. Verify database changes
      const record = await Model.findOne({ ... });
      expect(record).toBeTruthy();
    });
  });
});
```

## Test Examples Explained

### Auth Tests (auth.test.js)

Tests user registration and login:
- ✅ Register new user
- ✅ Prevent duplicate email registration
- ✅ Login with correct credentials
- ✅ Reject wrong password
- ✅ Reject non-existent user

### Workspace Tests (workspace.test.js)

Tests workspace creation and listing:
- ✅ Create workspace with authentication
- ✅ Auto-add owner as member
- ✅ List user's workspaces
- ✅ Reject unauthenticated requests

### Workspace Invite Tests (workspace.invite.test.js)

Tests inviting users to workspaces:
- ✅ Owner can invite users
- ✅ Set user role (ADMIN, MEMBER)
- ✅ Only owners can invite
- ✅ Prevent duplicate invites
- ✅ Validate workspace and user existence

## Writing Your Own Tests

### Basic Test Structure

```javascript
const request = require("supertest");
const app = require("../src/app");
const Model = require("../src/models/Model");
const { createTestUser } = require("./helpers/testHelpers");

require("./setup");

describe("My Feature", () => {
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  it("should do something", async () => {
    const response = await request(app)
      .post("/api/endpoint")
      .set("x-user-id", testUser._id.toString())
      .send({ data: "value" })
      .expect(200);

    expect(response.body).toHaveProperty("success", true);
  });
});
```

### Common Assertions

```javascript
// Response assertions
expect(response.status).toBe(200);
expect(response.body).toHaveProperty("message");
expect(response.body.user.email).toBe("test@example.com");

// Database assertions
const user = await User.findById(userId);
expect(user).toBeTruthy();
expect(user.name).toBe("John Doe");

// Array assertions
expect(response.body.items).toHaveLength(3);
expect(response.body.items[0]).toHaveProperty("id");
```

### Testing with Authentication

```javascript
// Set user ID header
const response = await request(app)
  .post("/api/workspaces")
  .set("x-user-id", userId)
  .send(data);
```

### Testing Error Cases

```javascript
it("should return 401 without authentication", async () => {
  const response = await request(app)
    .post("/api/workspaces")
    .send(data)
    .expect(401);

  expect(response.body).toHaveProperty("error");
});
```

## Best Practices

1. **Isolate tests**: Each test should be independent
2. **Clean data**: Use `afterEach` to clear test data
3. **Use helpers**: Create reusable helper functions
4. **Test edge cases**: Test both success and failure scenarios
5. **Descriptive names**: Use clear test descriptions
6. **Arrange-Act-Assert**: Structure tests clearly

## Troubleshooting

### Tests timeout
- Increase timeout in `jest.config.js`: `testTimeout: 30000`
- Check for unclosed connections

### MongoDB connection issues
- Ensure MongoDB Memory Server is properly installed
- Check `setup.js` is being loaded

### Tests fail randomly
- Tests might not be isolated
- Check for shared state between tests
- Ensure `afterEach` clears all data

### Port already in use
- Don't start the actual server in tests
- Import `app.js` not `server.js`

## Next Steps

1. Run the tests: `npm test`
2. Check coverage: `npm run test:coverage`
3. Add more tests for your endpoints
4. Set up CI/CD to run tests automatically

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
