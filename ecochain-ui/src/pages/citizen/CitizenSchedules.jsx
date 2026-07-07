import { useEffect, useState } from 'react'
import { getSchedules } from '../../api/citizen'
import StatusBadge from '../../components/StatusBadge'
import { FiTruck, FiCalendar, FiMapPin } from 'react-icons/fi'

export default function CitizenSchedules() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSchedules().then(r => setSchedules(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upcoming Collection Schedules</h1>
        <p className="text-gray-500 text-sm mt-1">Check when waste will be collected in your area</p>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
          No upcoming schedules
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {schedules.map(s => (
            <div key={s.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <StatusBadge status={s.status} />
                <span className="text-xs text-gray-400">#{s.id}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiMapPin className="text-green-500 flex-shrink-0" />
                  <span className="font-medium text-sm">{s.area}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm">{s.collectionDate}</span>
                </div>
                {s.collectorName && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiTruck className="text-purple-500 flex-shrink-0" />
                    <span className="text-sm">{s.collectorName}
                      {s.vehicleNumber && ` · ${s.vehicleNumber}`}
                    </span>
                  </div>
                )}
                {s.notes && <p className="text-xs text-gray-400 italic mt-2">{s.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
