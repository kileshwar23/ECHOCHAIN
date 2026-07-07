import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { MdRecycling } from 'react-icons/md'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const res = await register(form)
      loginUser(res.data)
      navigate('/citizen/dashboard')
    } catch (err) {
      if (err.response?.data?.fieldErrors) {
        setErrors(err.response.data.fieldErrors)
      } else {
        setErrors({ general: err.response?.data?.message || 'Registration failed' })
      }
    } finally {
      setLoading(false)
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm
          ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <MdRecycling className="text-5xl text-green-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-green-700">Create Account</h1>
          <p className="text-gray-500 text-sm">Join EcoChain today</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('name', 'Full Name', 'text', 'Rahul Sharma')}
          {field('email', 'Email Address', 'email', 'rahul@gmail.com')}
          {field('password', 'Password', 'password', 'Min 6 chars, 1 letter + 1 number')}
          {field('phone', 'Phone Number', 'tel', '9876543210')}
          {field('address', 'Address', 'text', '12, MG Road, Pune')}

          <button type="submit" disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2.5 rounded-lg font-semibold transition text-sm mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
