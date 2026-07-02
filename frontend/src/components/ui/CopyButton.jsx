import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all ' +
        (copied 
          ? 'bg-green-600/30 text-green-400 border border-green-500/30' 
          : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white') +
        ' ' + className
      }
    >
      {copied ? 'Copied!' : 'Copy'}
    </motion.button>
  )
}
