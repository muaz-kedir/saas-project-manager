# SaaS Project Manager - Frontend

A modern React frontend for a multi-tenant SaaS Project Management System with Kanban-style boards.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **Tailwind CSS** - Styling

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with interceptors
├── components/               # Reusable components (empty for now)
├── context/
│   └── AuthContext.jsx       # Authentication context
├── hooks/                    # Custom hooks (empty for now)
├── layouts/
│   └── MainLayout.jsx        # Main layout with navbar
├── pages/
│   ├── Login.jsx            # Login page
│   ├── Register.jsx         # Registration page
│   └── Dashboard.jsx        # Dashboard page
├── routes/
│   └── ProtectedRoute.jsx   # Protected route wrapper
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 Authentication Flow

1. User registers or logs in
2. Token is stored in localStorage
3. Token is automatically attached to all API requests
4. Protected routes check for valid token
5. Logout clears token and redirects to login

## 🎨 Features Implemented

✅ User Registration
✅ User Login
✅ Protected Routes
✅ Persistent Authentication
✅ Automatic Token Management
✅ Clean UI with Tailwind CSS
✅ Responsive Design
✅ Error Handling

## 🔜 Coming Next (Day 2+)

- Workspace Management
- Project CRUD
- Kanban Board
- Drag & Drop
- Task Management
- Team Collaboration

## 📚 Key Files Explained

### `src/api/axios.js`
- Configures axios with base URL
- Adds auth token to all requests
- Handles 401 errors automatically

### `src/context/AuthContext.jsx`
- Manages authentication state
- Provides login/register/logout functions
- Persists session in localStorage

### `src/routes/ProtectedRoute.jsx`
- Wraps protected routes
- Redirects to login if not authenticated
- Shows loading state

### `src/layouts/MainLayout.jsx`
- Provides consistent layout
- Shows navbar with user info
- Renders child routes

## 🎯 Usage Examples

### Making API Calls

```javascript
import axios from '../api/axios'

// GET request
const response = await axios.get('/workspaces')

// POST request
const response = await axios.post('/projects', { name: 'New Project' })
```

### Using Auth Context

```javascript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth()
  
  return (
    <div>
      <p>Welcome {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### API connection issues
- Make sure backend is running on port 5000
- Check VITE_API_URL in .env file
- Check browser console for errors

## 📖 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
