import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyRequests } from '../../api/citizen'
import { getMyComplaints } from '../../api/citizen'
import { Link } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { FiTruck, FiAlertCircle, FiClock, FiCheckCircle } from 'react-icons/fi'
import { MdOutlineAddCircle } from 'react-icons/md'

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

  const pending = requests.filter(r => r.status === 'PENDING').length
  const collected = requests.filter(r => r.status === 'COLLECTED').length
  const openComplaints = complaints.filter(c => c.status === 'OPEN').length

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Manage your waste pickup requests and complaints</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Requests" value={requests.length} icon={<FiTruck />} color="blue" />
        <StatCard label="Pending" value={pending} icon={<FiClock />} color="yellow" />
        <StatCard label="Collected" value={collected} icon={<FiCheckCircle />} color="green" />
        <StatCard label="Open Complaints" value={openComplaints} icon={<FiAlertCircle />} color="red" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/citizen/requests/new"
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-5 flex items-center gap-3 transition">
          <MdOutlineAddCircle className="text-3xl" />
          <div>
            <p className="font-semibold">New Pickup Request</p>
            <p className="text-sm text-green-200">Schedule a waste collection</p>
          </div>
        </Link>
        <Link to="/citizen/complaints/new"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-5 flex items-center gap-3 transition">
          <FiAlertCircle className="text-3xl" />
          <div>
            <p className="font-semibold">File a Complaint</p>
            <p className="text-sm text-orange-200">Report an issue</p>
          </div>
        </Link>
        <Link to="/citizen/schedules"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 flex items-center gap-3 transition">
          <FiTruck className="text-3xl" />
          <div>
            <p className="font-semibold">View Schedules</p>
            <p className="text-sm text-blue-200">See upcoming collections</p>
          </div>
        </Link>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Recent Requests</h2>
          <Link to="/citizen/requests" className="text-green-600 text-sm hover:underline">View all</Link>
        </div>
        {requests.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No requests yet</div>
        ) : (
          <div className="divide-y">
            {requests.slice(0, 5).map(r => (
              <div key={r.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700 text-sm">{r.address}</p>
                  <p className="text-xs text-gray-400 mt-1">{r.wasteType} · {r.preferredDate || 'No date set'}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
