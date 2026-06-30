import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ColorBends from './components/effects/ColorBends'
import GlitchText from './components/ui/GlitchText'
import AnimatedCard from './components/ui/AnimatedCard'
import GlowButton from './components/ui/GlowButton'
import AnimatedInput from './components/ui/AnimatedInput'
import AnimatedTextarea from './components/ui/AnimatedTextarea'
import AnimatedSelect from './components/ui/AnimatedSelect'

const languages = [
  { value: 'text', label: 'Plain Text' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
]

const expiryOptions = [
  { value: 'never', label: 'Never expire' },
  { value: '1h', label: '1 hour' },
  { value: '1d', label: '1 day' },
  { value: '1w', label: '1 week' },
  { value: '1m', label: '1 month' },
  { value: 'view_once', label: 'View once' },
]

function App() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('text')
  const [title, setTitle] = useState('')
  const [expiry, setExpiry] = useState('never')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const payload = {
      code,
      language,
      title: title || undefined,
      expiry_type: expiry === 'view_once' ? 'view_once' : expiry === 'never' ? 'never' : 'time',
    }

    try {
      const res = await fetch('http://localhost:8000/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ColorBends animated background */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <ColorBends
          colors={['#ff5c7a', '#8a5cff', '#00ffd1']}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent={true}
          autoRotate={0}
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/40" style={{ zIndex: 1 }} />

      {/* Main content */}
      <div className="relative z-10 min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center">
            <GlitchText
              speed={1}
              enableShadows
              enableOnHover={false}
              className="text-5xl md:text-6xl"
            >
              codeBin
            </GlitchText>
          </div>
          <p className="text-gray-300 mt-4 text-lg drop-shadow-lg">Paste. Share. Expire.</p>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6"
            >
              <AnimatedCard className="border-green-500/30 bg-green-900/40 backdrop-blur-xl">
                <p className="font-semibold text-green-400">Snippet created!</p>
                <p className="font-mono text-sm mt-2 text-gray-200">Slug: {result.slug}</p>
                <p className="font-mono text-sm text-gray-200">URL: {result.url}</p>
              </AnimatedCard>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatedCard className="bg-gray-950/60 backdrop-blur-xl border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatedInput
              label="Title"
              type="text"
              placeholder="Optional title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedSelect
                label="Language"
                options={languages}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />

              <AnimatedSelect
                label="Expiry"
                options={expiryOptions}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>

            <AnimatedTextarea
              label="Code"
              placeholder="Paste your code here..."
              rows={14}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <div className="flex justify-end pt-2">
              <GlowButton type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Snippet'}
              </GlowButton>
            </div>
          </form>
        </AnimatedCard>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 text-sm mt-8"
        >
          codeBin — Share code snippets with style
        </motion.p>
      </div>
    </div>
  )
}

export default App
