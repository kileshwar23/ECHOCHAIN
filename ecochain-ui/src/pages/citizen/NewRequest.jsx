import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitRequest } from '../../api/citizen'

const WASTE_TYPES = ['GENERAL', 'RECYCLABLE', 'HAZARDOUS', 'ORGANIC', 'ELECTRONIC']

export default function NewRequest() {
  const [form, setForm] = useState({ address: '', wasteType: '', preferredDate: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await submitRequest(form)
      navigate('/citizen/requests')
    } catch (err) {
      if (err.response?.data?.fieldErrors) setErrors(err.response.data.fieldErrors)
      else setErrors({ general: err.response?.data?.message || 'Failed to submit request' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New Pickup Request</h1>
        <p className="text-gray-500 text-sm mt-1">Schedule a waste collection at your location</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address *</label>
            <input type="text" placeholder="Enter full pickup address"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm
                ${errors.address ? 'border-red-400' : 'border-gray-300'}`}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Waste Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {WASTE_TYPES.map(type => (
                <button key={type} type="button"
                  onClick={() => setForm({ ...form, wasteType: type })}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition
                    ${form.wasteType === type
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}>
                  {type}
                </button>
              ))}
            </div>
            {errors.wasteType && <p className="text-red-500 text-xs mt-1">{errors.wasteType}</p>}
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input type="date" min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              value={form.preferredDate}
              onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea placeholder="Any special instructions..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2.5 rounded-lg font-semibold text-sm transition">
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
