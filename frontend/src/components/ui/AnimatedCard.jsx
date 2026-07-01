import { motion } from 'framer-motion'
import VibgyorBorder from './VibgyorBorder'

export default function AnimatedCard({ children, className = '', glowIntensity = 'medium' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
    >
      <VibgyorBorder className={className} glowIntensity={glowIntensity}>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </VibgyorBorder>
    </motion.div>
  )
}
