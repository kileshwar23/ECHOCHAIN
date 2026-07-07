import { useEffect, useState } from 'react'
import { getDashboard } from '../../api/admin'
import { motion } from 'framer-motion'
import StatCard from '../../components/StatCard'
import { FiUsers, FiTruck, FiAlertCircle, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi'
import { MdRecycling } from 'react-icons/md'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const wasteEmojis = { GENERAL: '🗑️', RECYCLABLE: '♻️', HAZARDOUS: '⚠️', ORGANIC: '🌿', ELECTRONIC: '💻' }

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full" />
    </div>
  )
  if (!stats) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="gradient-bg rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <MdRecycling className="text-5xl text-green-200" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-green-200 mt-1">EcoChain System Overview</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-4xl font-bold">{stats.totalRequests}</div>
              <div className="text-green-200 text-sm">Total Requests</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Users */}
      <motion.div variants={container} initial="hidden" animate="show">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <FiUsers /> Users Overview
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div variants={item}><StatCard label="Total Users" value={stats.totalUsers} icon={<FiUsers />} color="blue" delay={0} /></motion.div>
          <motion.div variants={item}><StatCard label="Citizens" value={stats.totalCitizens} icon="👤" color="green" delay={0.1} /></motion.div>
          <motion.div variants={item}><StatCard label="Admins" value={stats.totalAdmins} icon="👑" color="purple" delay={0.2} /></motion.div>
        </div>

        {/* Requests */}
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <FiTruck /> Pickup Requests
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div variants={item}><StatCard label="Pending" value={stats.pendingRequests} icon={<FiClock />} color="yellow" delay={0.3} /></motion.div>
          <motion.div variants={item}><StatCard label="Approved" value={stats.approvedRequests} icon="✅" color="blue" delay={0.4} /></motion.div>
          <motion.div variants={item}><StatCard label="Scheduled" value={stats.scheduledRequests} icon={<FiCalendar />} color="purple" delay={0.5} /></motion.div>
          <motion.div variants={item}><StatCard label="Collected" value={stats.collectedRequests} icon={<FiCheckCircle />} color="green" delay={0.6} /></motion.div>
        </div>

        {/* Schedules + Complaints */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">📅 Schedules</h2>
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={item}><StatCard label="Planned" value={stats.plannedSchedules} icon={<FiCalendar />} color="blue" delay={0.7} /></motion.div>
              <motion.div variants={item}><StatCard label="In Progress" value={stats.inProgressSchedules} icon={<FiTruck />} color="orange" delay={0.8} /></motion.div>
              <motion.div variants={item}><StatCard label="Completed" value={stats.completedSchedules} icon={<FiCheckCircle />} color="green" delay={0.9} /></motion.div>
              <motion.div variants={item}><StatCard label="Total" value={stats.totalSchedules} icon="📋" color="purple" delay={1.0} /></motion.div>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">📢 Complaints</h2>
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={item}><StatCard label="Open" value={stats.openComplaints} icon={<FiAlertCircle />} color="red" delay={0.7} /></motion.div>
              <motion.div variants={item}><StatCard label="Under Review" value={stats.underReviewComplaints} icon={<FiClock />} color="yellow" delay={0.8} /></motion.div>
              <motion.div variants={item}><StatCard label="Resolved" value={stats.resolvedComplaints} icon={<FiCheckCircle />} color="green" delay={0.9} /></motion.div>
              <motion.div variants={item}><StatCard label="Total" value={stats.totalComplaints} icon="📝" color="blue" delay={1.0} /></motion.div>
            </div>
          </div>
        </div>

        {/* Waste type breakdown */}
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">♻️ Requests by Waste Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stats.requestsByWasteType && Object.entries(stats.requestsByWasteType).map(([type, count], i) => (
            <motion.div key={type}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm card-hover">
              <p className="text-3xl mb-2">{wasteEmojis[type] || '🗑️'}</p>
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{type}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
