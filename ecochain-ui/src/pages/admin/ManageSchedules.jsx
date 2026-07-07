import { useEffect, useState } from 'react'
import { getAllSchedules, createSchedule, updateScheduleStatus, deleteSchedule } from '../../api/admin'
import StatusBadge from '../../components/StatusBadge'

export default function ManageSchedules() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ area: '', collectionDate: '', collectorName: '', vehicleNumber: '', notes: '' })
  const [errors, setErrors] = useState({})

  const load = () => getAllSchedules().then(r => setSchedules(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      await createSchedule(form)
      setShowForm(false)
      setForm({ area: '', collectionDate: '', collectorName: '', vehicleNumber: '', notes: '' })
      load()
    } catch (err) {
      if (err.response?.data?.fieldErrors) setErrors(err.response.data.fieldErrors)
      else setErrors({ general: err.response?.data?.message || 'Failed to create schedule' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule?')) return
    await deleteSchedule(id)
    load()
  }

  const handleStatus = async (id, status) => {
    await updateScheduleStatus(id, status)
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Schedules</h1>
          <p className="text-gray-500 text-sm mt-1">{schedules.length} schedules</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">
          {showForm ? 'Cancel' : '+ New Schedule'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">New Collection Schedule</h2>
          {errors.general && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-3">{errors.general}</div>}
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            {[['area', 'Area *'], ['collectorName', 'Collector Name'], ['vehicleNumber', 'Vehicle Number'], ['notes', 'Notes']].map(([name, label]) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type="text" placeholder={label}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500
                    ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
                  value={form[name]}
                  onChange={e => setForm({ ...form, [name]: e.target.value })} />
                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Collection Date *</label>
              <input type="date" min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.collectionDate}
                onChange={e => setForm({ ...form, collectionDate: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm">
                Create Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedules table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Area</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Collector</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Vehicle</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {schedules.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">{s.area}</td>
                <td className="px-4 py-3 text-gray-600">{s.collectionDate}</td>
                <td className="px-4 py-3 text-gray-500">{s.collectorName || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{s.vehicleNumber || '-'}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {s.status === 'PLANNED' && (
                      <button onClick={() => handleStatus(s.id, 'IN_PROGRESS')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs">Start</button>
                    )}
                    {s.status === 'IN_PROGRESS' && (
                      <button onClick={() => handleStatus(s.id, 'COMPLETED')}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">Complete</button>
                    )}
                    <button onClick={() => handleDelete(s.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {schedules.length === 0 && <div className="p-12 text-center text-gray-400">No schedules</div>}
      </div>
    </div>
  )
}
