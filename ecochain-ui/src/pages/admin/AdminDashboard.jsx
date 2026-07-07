import { useEffect, useState } from 'react'
import { getDashboard } from '../../api/admin'
import StatCard from '../../components/StatCard'
import { FiUsers, FiTruck, FiAlertCircle, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi'
import { MdRecycling } from 'react-icons/md'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>
  if (!stats) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">EcoChain system overview</p>
      </div>

      {/* Users */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Users</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} icon={<FiUsers />} color="blue" />
        <StatCard label="Citizens" value={stats.totalCitizens} icon={<FiUsers />} color="green" />
        <StatCard label="Admins" value={stats.totalAdmins} icon={<FiUsers />} color="purple" />
      </div>

      {/* Requests */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Pickup Requests</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats.totalRequests} icon={<FiTruck />} color="blue" />
        <StatCard label="Pending" value={stats.pendingRequests} icon={<FiClock />} color="yellow" />
        <StatCard label="Scheduled" value={stats.scheduledRequests} icon={<FiCalendar />} color="purple" />
        <StatCard label="Collected" value={stats.collectedRequests} icon={<FiCheckCircle />} color="green" />
      </div>

      {/* Schedules + Complaints */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Schedules</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Planned" value={stats.plannedSchedules} icon={<FiCalendar />} color="blue" />
            <StatCard label="In Progress" value={stats.inProgressSchedules} icon={<FiTruck />} color="orange" />
            <StatCard label="Completed" value={stats.completedSchedules} icon={<FiCheckCircle />} color="green" />
            <StatCard label="Total" value={stats.totalSchedules} icon={<MdRecycling />} color="purple" />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Complaints</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Open" value={stats.openComplaints} icon={<FiAlertCircle />} color="red" />
            <StatCard label="Under Review" value={stats.underReviewComplaints} icon={<FiClock />} color="yellow" />
            <StatCard label="Resolved" value={stats.resolvedComplaints} icon={<FiCheckCircle />} color="green" />
            <StatCard label="Total" value={stats.totalComplaints} icon={<FiAlertCircle />} color="blue" />
          </div>
        </div>
      </div>

      {/* Waste type breakdown */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Requests by Waste Type</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.requestsByWasteType && Object.entries(stats.requestsByWasteType).map(([type, count]) => (
          <div key={type} className="bg-white border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{count}</p>
            <p className="text-xs text-gray-500 mt-1">{type}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
