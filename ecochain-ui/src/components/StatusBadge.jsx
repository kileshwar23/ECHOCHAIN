import { motion } from 'framer-motion'

const styles = {
  PENDING:      { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400', pulse: true },
  APPROVED:     { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-400',   pulse: false },
  SCHEDULED:    { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-400', pulse: false },
  COLLECTED:    { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-400',  pulse: false },
  REJECTED:     { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-400',    pulse: false },
  CANCELLED:    { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400',   pulse: false },
  PLANNED:      { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-400',   pulse: true },
  IN_PROGRESS:  { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-400', pulse: true },
  COMPLETED:    { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-400',  pulse: false },
  OPEN:         { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-400',    pulse: true },
  UNDER_REVIEW: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400', pulse: true },
  RESOLVED:     { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-400',  pulse: false },
  CLOSED:       { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400',   pulse: false },
  ADMIN:        { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-400', pulse: false },
  CITIZEN:      { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-400',  pulse: false },
}

export default function StatusBadge({ status }) {
  const s = styles[status] || styles.CANCELLED
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
      {status?.replace('_', ' ')}
    </motion.span>
  )
}
