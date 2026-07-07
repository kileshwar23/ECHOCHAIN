const colors = {
  // Request statuses
  PENDING:      'bg-yellow-100 text-yellow-800',
  APPROVED:     'bg-blue-100 text-blue-800',
  SCHEDULED:    'bg-purple-100 text-purple-800',
  COLLECTED:    'bg-green-100 text-green-800',
  REJECTED:     'bg-red-100 text-red-800',
  CANCELLED:    'bg-gray-100 text-gray-600',
  // Schedule statuses
  PLANNED:      'bg-blue-100 text-blue-800',
  IN_PROGRESS:  'bg-orange-100 text-orange-800',
  COMPLETED:    'bg-green-100 text-green-800',
  // Complaint statuses
  OPEN:         'bg-red-100 text-red-800',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  RESOLVED:     'bg-green-100 text-green-800',
  CLOSED:       'bg-gray-100 text-gray-600',
  // Roles
  ADMIN:        'bg-purple-100 text-purple-800',
  CITIZEN:      'bg-green-100 text-green-800',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}
