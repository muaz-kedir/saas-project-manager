# Quick Setup Guide - Day 1 Frontend

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd client
npm install
```

### Step 2: Start the App
```bash
npm run dev
```

### Step 3: Open Browser
Go to: `http://localhost:3000`

## ✅ What's Working

- ✅ Login page at `/login`
- ✅ Register page at `/register`
- ✅ Dashboard at `/dashboard` (protected)
- ✅ Auto token management
- ✅ Session persistence
- ✅ Clean UI with Tailwind

## 🧪 Test the App

1. **Register a new user**
   - Go to http://localhost:3000/register
   - Fill in name, email, password
   - Click "Create Account"

2. **You'll be redirected to Dashboard**
   - See welcome message
   - See stats cards
   - See quick actions

3. **Logout and Login**
   - Click "Logout" in navbar
   - Login with your credentials
   - Session persists on refresh!

## 🔧 Backend Connection

Make sure your backend is running:
```bash
# In the root directory
npm run dev
```

Backend should be on: `http://localhost:5000`

## 📝 Environment Variables

The `.env` file is already created with:
```
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Customization

### Change Primary Color
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Change these values
    600: '#0284c7',
    700: '#0369a1',
  }
}
```

### Change App Name
Edit `client/src/layouts/MainLayout.jsx` and `client/src/pages/Login.jsx`:
```javascript
<span className="text-2xl font-bold">
  📋 YourAppName
</span>
```

## 🐛 Common Issues

### "Cannot connect to backend"
- Make sure backend is running on port 5000
- Check `.env` file has correct API URL

### "Port 3000 already in use"
```bash
npx kill-port 3000
npm run dev
```

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📂 File Structure Overview

```
client/
├── src/
│   ├── api/axios.js           ← API configuration
│   ├── context/AuthContext.jsx ← Auth state
│   ├── pages/                 ← Page components
│   ├── routes/                ← Route protection
│   └── layouts/               ← Layout wrapper
├── .env                       ← Environment variables
└── package.json               ← Dependencies
```

## 🎯 Next Steps (Day 2)

Tomorrow we'll add:
- Workspace management
- Project CRUD operations
- Team member invitations
- Better dashboard with real data

## 💡 Tips

- Keep backend running while developing
- Check browser console for errors
- Use React DevTools for debugging
- Hot reload works automatically

## 🆘 Need Help?

Check:
1. Browser console (F12)
2. Terminal for errors
3. Backend logs
4. Network tab in DevTools

Happy coding! 🚀
