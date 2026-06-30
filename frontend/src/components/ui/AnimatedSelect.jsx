import { motion } from 'framer-motion'

export default function AnimatedSelect({ label, options, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 }}
      className="space-y-1"
    >
      {label && <label className="text-sm text-gray-400 font-medium">{label}</label>}
      <select
        {...props}
        className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </motion.div>
  )
}
