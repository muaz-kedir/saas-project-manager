# Testing Setup - Fixed for Windows

## What Changed?

The original setup used MongoDB Memory Server which was failing to download on your system. I've switched to using your actual MongoDB database with a separate test database.

## Setup Steps

### 1. Remove the problematic package (if installed)

```bash
npm uninstall mongodb-memory-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Make sure MongoDB is running

Your MongoDB should already be running from development. The tests will use a separate database called `saas_pm_test` so your development data (`saas_pm`) is completely safe.

### 4. Run the tests

```bash
npm test
```

## How It Works Now

- **Development database**: `mongodb://127.0.0.1:27017/saas_pm`
- **Test database**: `mongodb://127.0.0.1:27017/saas_pm_test`

The test database is automatically cleared after each test, so tests don't interfere with each other.

## Configuration Files

### `.env.test`
Contains test-specific environment variables:
```
PORT=5001
MONGO_TEST_URI=mongodb://127.0.0.1:27017/saas_pm_test
JWT_SECRET=test_secret_key_for_testing_only
```

### `__tests__/setup.js`
Now connects to your actual MongoDB instead of trying to download binaries:
```javascript
const mongoUri = process.env.MONGO_TEST_URI || "mongodb://127.0.0.1:27017/saas_pm_test";
await mongoose.connect(mongoUri);
```

## Benefits of This Approach

1. **No downloads needed** - Uses your existing MongoDB
2. **Faster** - No need to start/stop in-memory server
3. **More reliable** - No network issues
4. **Separate data** - Test database is isolated from development
5. **Works on Windows** - No platform-specific issues

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx jest __tests__/auth.test.js

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Troubleshooting

### "MongooseError: Operation buffering timed out"
- Make sure MongoDB is running
- Check if MongoDB is accessible at `mongodb://127.0.0.1:27017`

### Tests are slow
- This is normal for the first run
- Subsequent runs will be faster

### Port already in use
- The tests use port 5001 (different from dev port 5000)
- If needed, change PORT in `.env.test`

## What Gets Tested

✅ User registration
✅ User login  
✅ Workspace creation
✅ Workspace listing
✅ User invitations
✅ Permission checks (OWNER, ADMIN, MEMBER)
✅ Error handling
✅ Authentication middleware

All 20 tests should now pass!
