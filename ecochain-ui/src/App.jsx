import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Public
import Login from './pages/Login'
import Register from './pages/Register'

// Citizen
import CitizenDashboard from './pages/citizen/CitizenDashboard'
import MyRequests from './pages/citizen/MyRequests'
import NewRequest from './pages/citizen/NewRequest'
import MyComplaints from './pages/citizen/MyComplaints'
import NewComplaint from './pages/citizen/NewComplaint'
import CitizenSchedules from './pages/citizen/CitizenSchedules'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageRequests from './pages/admin/ManageRequests'
import ManageSchedules from './pages/admin/ManageSchedules'
import ManageComplaints from './pages/admin/ManageComplaints'
import ManageUsers from './pages/admin/ManageUsers'

function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/citizen/dashboard'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomeRedirect />} />

          {/* Citizen routes */}
          <Route element={
            <ProtectedRoute role="CITIZEN">
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/requests" element={<MyRequests />} />
            <Route path="/citizen/requests/new" element={<NewRequest />} />
            <Route path="/citizen/complaints" element={<MyComplaints />} />
            <Route path="/citizen/complaints/new" element={<NewComplaint />} />
            <Route path="/citizen/schedules" element={<CitizenSchedules />} />
          </Route>

          {/* Admin routes */}
          <Route element={
            <ProtectedRoute role="ADMIN">
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/requests" element={<ManageRequests />} />
            <Route path="/admin/schedules" element={<ManageSchedules />} />
            <Route path="/admin/complaints" element={<ManageComplaints />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
