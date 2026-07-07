import { motion } from 'framer-motion'
import CountUp from 'react-countup'

const gradients = {
  green:  'stat-card-gradient-green',
  blue:   'stat-card-gradient-blue',
  yellow: 'stat-card-gradient-yellow',
  red:    'stat-card-gradient-red',
  purple: 'stat-card-gradient-purple',
  orange: 'stat-card-gradient-orange',
}

const textColors = {
  green:  'text-green-700',
  blue:   'text-blue-700',
  yellow: 'text-yellow-700',
  red:    'text-red-700',
  purple: 'text-purple-700',
  orange: 'text-orange-700',
}

export default function StatCard({ label, value, icon, color = 'green', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.03, y: -4 }}
      className={`rounded-2xl p-5 card-hover shadow-sm ${gradients[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`text-3xl ${textColors[color]}`}>{icon}</div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white bg-opacity-60 ${textColors[color]} text-xl`}>
          {icon}
        </motion.div>
      </div>
      <div className={`text-3xl font-bold ${textColors[color]}`}>
        <CountUp end={value} duration={1.5} delay={delay} />
      </div>
      <p className={`text-sm font-semibold mt-1 opacity-80 ${textColors[color]}`}>{label}</p>
    </motion.div>
  )
}
