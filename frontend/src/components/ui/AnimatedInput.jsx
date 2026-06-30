import { motion } from 'framer-motion'

export default function AnimatedInput({ label, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-1"
    >
      {label && <label className="text-sm text-gray-400 font-medium">{label}</label>}
      <input
        {...props}
        className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
      />
    </motion.div>
  )
}
