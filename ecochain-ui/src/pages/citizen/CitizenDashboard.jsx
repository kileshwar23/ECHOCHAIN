import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyRequests, getMyComplaints } from '../../api/citizen'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { FiTruck, FiAlertCircle, FiClock, FiCheckCircle } from 'react-icons/fi'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function CitizenDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyRequests(), getMyComplaints()])
      .then(([r, c]) => { setRequests(r.data); setComplaints(c.data) })
      .finally(() => setLoading(false))
  }, [])

  const pending   = requests.filter(r => r.status === 'PENDING').length
  const collected = requests.filter(r => r.status === 'COLLECTED').length
  const openC     = complaints.filter(c => c.status === 'OPEN').length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-gray-500 text-sm">Here's your waste management overview</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div variants={item}><StatCard label="Total Requests" value={requests.length} icon={<FiTruck />} color="blue" delay={0} /></motion.div>
        <motion.div variants={item}><StatCard label="Pending" value={pending} icon={<FiClock />} color="yellow" delay={0.1} /></motion.div>
        <motion.div variants={item}><StatCard label="Collected" value={collected} icon={<FiCheckCircle />} color="green" delay={0.2} /></motion.div>
        <motion.div variants={item}><StatCard label="Open Complaints" value={openC} icon={<FiAlertCircle />} color="red" delay={0.3} /></motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { to: '/citizen/requests/new', bg: 'from-green-500 to-emerald-600', emoji: '🚛', title: 'New Pickup Request', sub: 'Schedule a waste collection' },
          { to: '/citizen/complaints/new', bg: 'from-orange-500 to-amber-500', emoji: '📢', title: 'File a Complaint', sub: 'Report an issue' },
          { to: '/citizen/schedules', bg: 'from-blue-500 to-indigo-600', emoji: '📅', title: 'View Schedules', sub: 'Upcoming collections' },
        ].map((card, i) => (
          <motion.div key={card.to} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}>
            <Link to={card.to}
              className={`bg-gradient-to-br ${card.bg} text-white rounded-2xl p-6 flex items-center gap-4 shadow-lg block`}>
              <span className="text-4xl">{card.emoji}</span>
              <div>
                <p className="font-bold text-lg">{card.title}</p>
                <p className="text-sm opacity-80">{card.sub}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Requests */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50">
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            <span>🚛</span> Recent Requests
          </h2>
          <Link to="/citizen/requests" className="text-green-600 text-sm font-semibold hover:underline">View all →</Link>
        </div>
        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-400">No requests yet</p>
            <Link to="/citizen/requests/new" className="text-green-600 text-sm mt-2 block hover:underline">Submit your first →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.slice(0, 5).map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-700 text-sm">{r.address}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{r.wasteType}</span>
                    {r.preferredDate && <span className="ml-2">📅 {r.preferredDate}</span>}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
