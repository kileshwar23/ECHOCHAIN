import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyComplaints } from '../../api/citizen'
import StatusBadge from '../../components/StatusBadge'

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyComplaints().then(r => setComplaints(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Complaints</h1>
          <p className="text-gray-500 text-sm mt-1">Track your filed complaints</p>
        </div>
        <Link to="/citizen/complaints/new"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition">
          + File Complaint
        </Link>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">No complaints filed</div>
      ) : (
        <div className="space-y-3">
          {complaints.map(c => (
            <div key={c.id} className="bg-white rounded-xl border p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800">{c.subject}</h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-gray-600 mb-3">{c.description}</p>
              {c.adminResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-green-700 mb-1">Admin Response:</p>
                  <p className="text-sm text-green-800">{c.adminResponse}</p>
                </div>
              )}
              <div className="text-xs text-gray-400 mt-3">
                Filed: {c.createdAt?.split('T')[0]}
                {c.resolvedAt && ` · Resolved: ${c.resolvedAt?.split('T')[0]}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
