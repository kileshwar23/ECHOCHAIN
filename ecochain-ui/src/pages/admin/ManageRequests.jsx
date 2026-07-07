import { useEffect, useState } from 'react'
import { getAllRequests, updateRequestStatus, assignSchedule, getAllSchedules } from '../../api/admin'
import StatusBadge from '../../components/StatusBadge'

const STATUSES = ['PENDING', 'APPROVED', 'SCHEDULED', 'COLLECTED', 'REJECTED', 'CANCELLED']

export default function ManageRequests() {
  const [requests, setRequests] = useState([])
  const [schedules, setSchedules] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([getAllRequests(filter || null), getAllSchedules()])
      .then(([r, s]) => { setRequests(r.data); setSchedules(s.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const handleStatus = async (id, status) => {
    await updateRequestStatus(id, status)
    load()
  }

  const handleAssign = async (id, scheduleId) => {
    await assignSchedule(id, scheduleId)
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Pickup Requests</h1>
          <p className="text-gray-500 text-sm mt-1">{requests.length} requests found</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Citizen</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Address</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">{r.citizenName}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.address}</td>
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{r.wasteType}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{r.preferredDate || '-'}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {r.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleStatus(r.id, 'APPROVED')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">Approve</button>
                        <button onClick={() => handleStatus(r.id, 'REJECTED')}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">Reject</button>
                      </>
                    )}
                    {r.status === 'APPROVED' && (
                      <select onChange={e => e.target.value && handleAssign(r.id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs focus:outline-none">
                        <option value="">Assign Schedule</option>
                        {schedules.filter(s => s.status === 'PLANNED').map(s => (
                          <option key={s.id} value={s.id}>{s.area} - {s.collectionDate}</option>
                        ))}
                      </select>
                    )}
                    {r.status === 'SCHEDULED' && (
                      <button onClick={() => handleStatus(r.id, 'COLLECTED')}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">Mark Collected</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="p-12 text-center text-gray-400">No requests found</div>
        )}
      </div>
    </div>
  )
}
