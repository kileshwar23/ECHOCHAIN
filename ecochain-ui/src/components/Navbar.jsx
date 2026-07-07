import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi'
import { MdRecycling } from 'react-icons/md'
import { useState } from 'react'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const citizenLinks = [
    { to: '/citizen/dashboard', label: 'Dashboard' },
    { to: '/citizen/requests', label: 'My Requests' },
    { to: '/citizen/complaints', label: 'My Complaints' },
    { to: '/citizen/schedules', label: 'Schedules' },
    { to: '/citizen/profile', label: 'Profile' },
  ]

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/requests', label: 'Requests' },
    { to: '/admin/schedules', label: 'Schedules' },
    { to: '/admin/complaints', label: 'Complaints' },
    { to: '/admin/users', label: 'Users' },
  ]

  const links = user?.role === 'ADMIN' ? adminLinks : citizenLinks

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <MdRecycling className="text-3xl text-green-200" />
          <span>EcoChain</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className="text-sm font-medium hover:text-green-200 transition">
              {l.label}
            </Link>
          ))}
        </div>

        {/* User info + logout */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-600 rounded-full px-3 py-1">
            <FiUser />
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">{user?.role}</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm transition">
            <FiLogOut /> Logout
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu className="text-2xl" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-800 px-4 pb-4 flex flex-col gap-2">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className="py-2 border-b border-green-700 text-sm"
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="mt-2 bg-red-500 py-2 rounded-lg text-sm">
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
