import { motion, AnimatePresence } from 'framer-motion'

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={
              'px-4 py-3 rounded-xl shadow-lg backdrop-blur-xl border ' +
              (toast.type === 'success' ? 'bg-green-900/80 border-green-500/30 text-green-100' :
               toast.type === 'error' ? 'bg-red-900/80 border-red-500/30 text-red-100' :
               'bg-blue-900/80 border-blue-500/30 text-blue-100')
            }
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
              </span>
              <span className="text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => onRemove(toast.id)}
                className="ml-2 text-white/50 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
