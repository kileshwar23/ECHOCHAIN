import { useEffect, useState } from 'react'
import { getAllComplaints, resolveComplaint } from '../../api/admin'
import StatusBadge from '../../components/StatusBadge'

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState(null)
  const [response, setResponse] = useState('')

  const load = () => getAllComplaints(filter || null)
    .then(r => setComplaints(r.data)).finally(() => setLoading(false))

  useEffect(() => { load() }, [filter])

  const handleResolve = async (id, status) => {
    if (!response.trim()) return alert('Please enter a response')
    await resolveComplaint(id, response, status)
    setResolving(null)
    setResponse('')
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Complaints</h1>
          <p className="text-gray-500 text-sm mt-1">{complaints.length} complaints</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="">All</option>
          <option value="OPEN">Open</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="space-y-4">
        {complaints.length === 0 && (
          <div className="bg-white rounded-xl border p-12 text-center text-gray-400">No complaints</div>
        )}
        {complaints.map(c => (
          <div key={c.id} className="bg-white rounded-xl border p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{c.subject}</h3>
                <p className="text-xs text-gray-400">By {c.citizenName} · {c.createdAt?.split('T')[0]}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-sm text-gray-600 mb-3">{c.description}</p>

            {c.adminResponse && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold text-green-700">Your Response:</p>
                <p className="text-sm text-green-800">{c.adminResponse}</p>
              </div>
            )}

            {(c.status === 'OPEN' || c.status === 'UNDER_REVIEW') && (
              resolving === c.id ? (
                <div className="mt-3 space-y-2">
                  <textarea placeholder="Write your response..."
                    rows={3} value={response}
                    onChange={e => setResponse(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => handleResolve(c.id, 'RESOLVED')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm">Resolve</button>
                    <button onClick={() => handleResolve(c.id, 'CLOSED')}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-sm">Close</button>
                    <button onClick={() => { setResolving(null); setResponse('') }}
                      className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm text-gray-600">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setResolving(c.id)}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm">
                  Respond
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
