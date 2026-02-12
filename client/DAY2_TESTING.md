# Day 2 Testing Guide

## 🧪 Complete Testing Checklist

### Prerequisites
```bash
# Terminal 1: Start Backend
cd /path/to/project
npm run dev

# Terminal 2: Start Frontend
cd /path/to/project/client
npm run dev
```

## Test 1: Registration Flow

### Step 1: Navigate to Register
- Open http://localhost:3000/register
- Should see registration form

### Step 2: Test Validation
1. Leave all fields empty → Click "Create Account"
   - ✅ Should show "Please fill in all fields"

2. Enter name: "A" (too short)
   - ✅ Should show "Name must be at least 2 characters"

3. Enter invalid email: "test@"
   - ✅ Should show "Please enter a valid email address"

4. Enter password: "123" (too short)
   - ✅ Should show "Password must be at least 6 characters"

5. Enter password: "password123"
   - Confirm password: "different"
   - ✅ Should show "Passwords do not match"

### Step 3: Test Password Strength
1. Type password: "abc"
   - ✅ Should show RED bar (weak)

2. Type password: "abcdefgh"
   - ✅ Should show YELLOW bar (medium)

3. Type password: "abcdefghijk"
   - ✅ Should show GREEN bar (strong)

### Step 4: Successful Registration
1. Fill in valid data:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Confirm: "password123"

2. Click "Create Account"
   - ✅ Button should show "Creating account..."
   - ✅ Button should be disabled
   - ✅ Should redirect to /dashboard
   - ✅ Should see welcome message

3. Check localStorage:
   - Open DevTools (F12)
   - Go to Application → Local Storage
   - ✅ Should see "token"
   - ✅ Should see "user"

## Test 2: Login Flow

### Step 1: Logout First
- Click "Logout" button in navbar
- ✅ Should redirect to /login

### Step 2: Test Validation
1. Leave fields empty → Click "Sign In"
   - ✅ Should show "Please fill in all fields"

2. Enter invalid email: "notanemail"
   - ✅ Should show "Please enter a valid email address"

### Step 3: Test Wrong Credentials
1. Enter email: "john@example.com"
2. Enter password: "wrongpassword"
3. Click "Sign In"
   - ✅ Should show error message
   - ✅ Button should show "Signing in..."
   - ✅ Should NOT redirect

### Step 4: Successful Login
1. Enter correct credentials:
   - Email: "john@example.com"
   - Password: "password123"

2. Click "Sign In"
   - ✅ Should redirect to /dashboard
   - ✅ Should see welcome message
   - ✅ Token saved in localStorage

## Test 3: Session Persistence

### Step 1: Login
- Login with valid credentials
- Go to dashboard

### Step 2: Refresh Page
- Press F5 or Ctrl+R
- ✅ Should stay logged in
- ✅ Should still see dashboard
- ✅ Should NOT redirect to login

### Step 3: Close and Reopen Browser
- Close browser tab
- Open new tab
- Go to http://localhost:3000
- ✅ Should still be logged in
- ✅ Should redirect to dashboard

## Test 4: Protected Routes

### Step 1: Logout
- Click "Logout"
- ✅ Should redirect to /login

### Step 2: Try Accessing Dashboard
- Manually go to http://localhost:3000/dashboard
- ✅ Should redirect to /login
- ✅ Should NOT see dashboard

### Step 3: Login and Access
- Login with credentials
- ✅ Should redirect to /dashboard
- ✅ Should see dashboard content

## Test 5: Auto-Redirect Logic

### Test 5.1: Already Logged In
1. Login successfully
2. Manually go to http://localhost:3000/login
   - ✅ Should auto-redirect to /dashboard

3. Manually go to http://localhost:3000/register
   - ✅ Should auto-redirect to /dashboard

### Test 5.2: Not Logged In
1. Logout
2. Go to http://localhost:3000
   - ✅ Should redirect to /dashboard
   - ✅ Then redirect to /login (protected)

## Test 6: Error Handling

### Test 6.1: Network Error
1. Stop backend server
2. Try to login
   - ✅ Should show error message
   - ✅ Should not crash

### Test 6.2: Invalid Token
1. Login successfully
2. Open DevTools → Application → Local Storage
3. Manually change token value
4. Refresh page
   - ✅ Should logout
   - ✅ Should redirect to login

## Test 7: UI/UX

### Test 7.1: Loading States
1. Click "Sign In" or "Create Account"
   - ✅ Button text changes
   - ✅ Button is disabled
   - ✅ Inputs are disabled
   - ✅ Cannot submit again

### Test 7.2: Error Clearing
1. Trigger an error
2. Start typing in any input
   - ✅ Error message should disappear

### Test 7.3: Password Match Indicator
1. On register page
2. Type password: "test123"
3. Type confirm: "test"
   - ✅ Should show "✗ Passwords do not match" in red

4. Type confirm: "test123"
   - ✅ Should show "✓ Passwords match" in green

## Test 8: Backend Integration

### Test 8.1: Check API Calls
1. Open DevTools → Network tab
2. Login
3. Check network requests:
   - ✅ Should see POST to /api/auth/login
   - ✅ Should receive 200 status
   - ✅ Response should have { user, token }

### Test 8.2: Token Attachment
1. Login
2. Make any API call (future feature)
3. Check request headers:
   - ✅ Should have Authorization: Bearer <token>

## 🎯 Expected Results Summary

| Test | Expected Result | Status |
|------|----------------|--------|
| Registration validation | Shows errors | ✅ |
| Password strength | Shows indicator | ✅ |
| Password match | Shows feedback | ✅ |
| Successful register | Redirects to dashboard | ✅ |
| Login validation | Shows errors | ✅ |
| Successful login | Redirects to dashboard | ✅ |
| Session persistence | Survives refresh | ✅ |
| Protected routes | Redirects to login | ✅ |
| Auto-redirect | Works both ways | ✅ |
| Logout | Clears session | ✅ |
| Error handling | Shows messages | ✅ |
| Loading states | Disables inputs | ✅ |
| Token storage | Saves to localStorage | ✅ |
| Token attachment | Auto-adds to requests | ✅ |

## 🐛 If Something Fails

### Backend not responding
```bash
# Check backend is running
curl http://localhost:5000/api/auth/login

# Restart backend
cd ..
npm run dev
```

### Frontend not loading
```bash
# Check port 3000 is free
npx kill-port 3000

# Restart frontend
npm run dev
```

### Token not saving
- Check browser console for errors
- Check localStorage in DevTools
- Check AuthContext code

### Not redirecting
- Check React Router setup
- Check ProtectedRoute component
- Check browser console

## ✅ All Tests Passed?

Congratulations! Your authentication system is working perfectly!

**Next**: Day 3 - Workspace Management

---

Happy Testing! 🧪
