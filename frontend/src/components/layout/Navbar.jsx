import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">cb</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            codeBin
          </span>
        </Link>
      </div>
    </motion.nav>
  )
}