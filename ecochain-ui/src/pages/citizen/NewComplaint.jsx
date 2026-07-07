import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fileComplaint } from '../../api/citizen'

export default function NewComplaint() {
  const [form, setForm] = useState({ subject: '', description: '', pickupRequestId: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const data = { ...form, pickupRequestId: form.pickupRequestId ? Number(form.pickupRequestId) : null }
      await fileComplaint(data)
      navigate('/citizen/complaints')
    } catch (err) {
      if (err.response?.data?.fieldErrors) setErrors(err.response.data.fieldErrors)
      else setErrors({ general: err.response?.data?.message || 'Failed to file complaint' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">File a Complaint</h1>
        <p className="text-gray-500 text-sm mt-1">Let us know about any issues with waste collection</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input type="text" placeholder="Brief summary of the issue"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm
                ${errors.subject ? 'border-red-400' : 'border-gray-300'}`}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea placeholder="Describe the issue in detail (min 20 characters)..."
              rows={5}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none
                ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related Request ID (optional)</label>
            <input type="number" placeholder="e.g. 3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              value={form.pickupRequestId}
              onChange={(e) => setForm({ ...form, pickupRequestId: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2.5 rounded-lg font-semibold text-sm transition">
              {loading ? 'Submitting...' : 'File Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
