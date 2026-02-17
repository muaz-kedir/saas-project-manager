import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { WorkspaceProvider } from './context/WorkspaceContext'
import { ProjectProvider } from './context/ProjectContext'
import { BoardProvider } from './context/BoardContext'
import { ColumnProvider } from './context/ColumnContext'
import { TaskProvider } from './context/TaskContext'
import { TaskDrawerProvider } from './context/TaskDrawerContext'
import ProtectedRoute from './routes/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import AcceptInvitation from './pages/AcceptInvitation'
import Dashboard from './pages/Dashboard'
import WorkspaceHome from './pages/WorkspaceHome'
import ProjectHome from './pages/ProjectHome'
import BoardHome from './pages/BoardHome'
import TaskDrawer from './components/TaskDrawer'

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <ProjectProvider>
          <BoardProvider>
            <ColumnProvider>
              <TaskProvider>
                <TaskDrawerProvider>
                  <Router>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />

                      {/* Protected routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/workspace/:workspaceId" element={<WorkspaceHome />} />
                          <Route path="/workspace/:workspaceId/project/:projectId" element={<ProjectHome />} />
                          <Route path="/workspace/:workspaceId/project/:projectId/board/:boardId" element={<BoardHome />} />
                        </Route>
                      </Route>

                      {/* Redirect root to dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />

                      {/* 404 - Redirect to dashboard */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Router>
                  
                  {/* Global Task Drawer */}
                  <TaskDrawer />
                </TaskDrawerProvider>
              </TaskProvider>
            </ColumnProvider>
          </BoardProvider>
        </ProjectProvider>
      </WorkspaceProvider>
    </AuthProvider>
  )
}

export default App
