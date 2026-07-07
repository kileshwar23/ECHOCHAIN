import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyRequests, cancelRequest } from '../../api/citizen'
import StatusBadge from '../../components/StatusBadge'
import { MdOutlineAddCircle } from 'react-icons/md'

export default function MyRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => getMyRequests().then(r => setRequests(r.data)).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this request?')) return
    await cancelRequest(id)
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Pickup Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Track all your waste collection requests</p>
        </div>
        <Link to="/citizen/requests/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">
          <MdOutlineAddCircle /> New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
          <p className="text-lg">No requests yet</p>
          <Link to="/citizen/requests/new" className="text-green-600 text-sm mt-2 block hover:underline">
            Submit your first request →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="bg-white rounded-xl border p-5 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <StatusBadge status={r.status} />
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{r.wasteType}</span>
                </div>
                <p className="font-medium text-gray-700">{r.address}</p>
                <div className="text-xs text-gray-400 mt-1 space-x-3">
                  {r.preferredDate && <span>📅 {r.preferredDate}</span>}
                  {r.scheduleId && <span>📋 Schedule #{r.scheduleId}</span>}
                  <span>🕐 {r.createdAt?.split('T')[0]}</span>
                </div>
                {r.notes && <p className="text-sm text-gray-500 mt-2 italic">"{r.notes}"</p>}
              </div>
              {r.status === 'PENDING' && (
                <button onClick={() => handleCancel(r.id)}
                  className="ml-4 text-red-500 hover:text-red-700 text-sm border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
