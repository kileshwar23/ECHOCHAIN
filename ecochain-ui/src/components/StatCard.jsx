export default function StatCard({ label, value, icon, color = 'green' }) {
  const colors = {
    green:  'bg-green-50 border-green-200 text-green-700',
    blue:   'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red:    'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  }
  return (
    <div className={`rounded-xl border p-5 flex items-center gap-4 ${colors[color]}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-medium opacity-80">{label}</p>
      </div>
    </div>
  )
}
