import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { MdRecycling } from 'react-icons/md'
import { FiMail, FiLock } from 'react-icons/fi'

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <MdRecycling className="text-6xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-700">EcoChain</h1>
          <p className="text-gray-500 text-sm mt-1">Smart Waste Collection System</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-6">Welcome back</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input type="email" placeholder="admin@ecochain.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input type="password" placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2.5 rounded-lg font-semibold transition text-sm">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-medium hover:underline">Register</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600">Demo Credentials:</p>
          <p>Admin: admin@ecochain.com / admin123</p>
          <p>Citizen: rahul@gmail.com / citizen123</p>
        </div>
      </div>
    </div>
  )
}
