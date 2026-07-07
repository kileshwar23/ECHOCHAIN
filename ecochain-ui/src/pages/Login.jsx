import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { MdRecycling } from 'react-icons/md'

const floatingIcons = ['♻️', '🌿', '🌱', '💚', '🌍', '♻️', '🍃', '🌿']

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      loginUser(res.data)
      navigate(res.data.role === 'ADMIN' ? '/admin/dashboard' : '/citizen/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 overflow-hidden relative">
      {/* Floating background icons */}
      {floatingIcons.map((icon, i) => (
        <motion.div key={i}
          className="absolute text-2xl opacity-20 select-none pointer-events-none"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}>
          {icon}
        </motion.div>
      ))}

      <div className="w-full max-w-4xl flex shadow-2xl rounded-3xl overflow-hidden">
        {/* Left Panel */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col justify-center items-center w-1/2 p-12 glass text-white">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-8xl mb-6">
            ♻️
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 text-center">EcoChain</h1>
          <p className="text-green-100 text-center text-lg leading-relaxed">
            Smart Waste Collection<br />Management System
          </p>
          <div className="mt-10 space-y-3 w-full">
            {['🚛 Smart Pickup Scheduling', '📊 Real-time Tracking', '📢 Complaint Management', '🌍 Eco-friendly Future'].map((item, i) => (
              <motion.div key={i}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="glass rounded-xl px-4 py-2.5 text-sm font-medium">
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <MdRecycling className="text-4xl text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
              <p className="text-gray-500 text-sm">Sign in to your account</p>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <input type="email" placeholder="admin@ecochain.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <input type="password" placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all text-sm"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full shimmer-btn text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-200 disabled:opacity-60">
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <><span>Sign In</span><FiArrowRight /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">Create one</Link>
          </p>

          {/* Demo credentials */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <p className="text-xs font-bold text-green-700 mb-2">🔑 Demo Credentials</p>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span>admin@ecochain.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Citizen:</span>
                <span>rahul@gmail.com / citizen123</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
