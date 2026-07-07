import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { MdRecycling } from 'react-icons/md'
import { useState } from 'react'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const citizenLinks = [
    { to: '/citizen/dashboard', label: 'Dashboard', emoji: '🏠' },
    { to: '/citizen/requests', label: 'Requests', emoji: '🚛' },
    { to: '/citizen/complaints', label: 'Complaints', emoji: '📢' },
    { to: '/citizen/schedules', label: 'Schedules', emoji: '📅' },
    { to: '/citizen/profile', label: 'Profile', emoji: '👤' },
  ]

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', emoji: '📊' },
    { to: '/admin/requests', label: 'Requests', emoji: '🚛' },
    { to: '/admin/schedules', label: 'Schedules', emoji: '📅' },
    { to: '/admin/complaints', label: 'Complaints', emoji: '📢' },
    { to: '/admin/users', label: 'Users', emoji: '👥' },
  ]

  const links = user?.role === 'ADMIN' ? adminLinks : citizenLinks

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="gradient-bg text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
            <MdRecycling className="text-3xl text-green-200" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight">EcoChain</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const isActive = location.pathname === l.to
            return (
              <Link key={l.to} to={l.to}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5
                    ${isActive ? 'bg-white text-green-700 shadow-lg' : 'hover:bg-white hover:bg-opacity-20'}`}>
                  <span>{l.emoji}</span>
                  <span>{l.label}</span>
                  {isActive && (
                    <motion.div layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-300 rounded-full" />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* User + Logout */}
        <div className="hidden md:flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="w-7 h-7 bg-green-300 rounded-full flex items-center justify-center text-green-800 font-bold text-xs">
              {user?.name?.charAt(0)}
            </div>
            <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
              ${user?.role === 'ADMIN' ? 'bg-purple-300 text-purple-800' : 'bg-green-300 text-green-800'}`}>
              {user?.role}
            </span>
          </motion.div>

          <motion.button onClick={handleLogout}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-lg">
            <FiLogOut /> Logout
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-green-800 bg-opacity-90 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-2">
              {links.map((l, i) => (
                <motion.div key={l.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}>
                  <Link to={l.to}
                    className={`flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition
                      ${location.pathname === l.to ? 'bg-white text-green-700' : 'hover:bg-white hover:bg-opacity-20'}`}
                    onClick={() => setMenuOpen(false)}>
                    <span>{l.emoji}</span>{l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button onClick={handleLogout}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: links.length * 0.05 }}
                className="w-full mt-2 bg-red-500 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                <FiLogOut /> Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
