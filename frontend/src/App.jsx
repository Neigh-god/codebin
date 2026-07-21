import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ColorBends from './components/effects/ColorBends'
import GlitchText from './components/ui/GlitchText'
import Shuffle from './components/ui/Shuffle'
import AnimatedCard from './components/ui/AnimatedCard'
import GlowButton from './components/ui/GlowButton'
import AnimatedInput from './components/ui/AnimatedInput'
import AnimatedTextarea from './components/ui/AnimatedTextarea'
import AnimatedSelect from './components/ui/AnimatedSelect'
import ToastContainer from './components/feedback/ToastContainer'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SnippetView from './pages/SnippetView'
import { useToast } from './hooks/useToast'
import Login from './pages/Login'
import MySnippets from './pages/MySnippets'
import About from './pages/About'
import { useAuth } from './hooks/useAuth'

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

function HomePage() {
  const { toasts, addToast, removeToast } = useToast()
  const { getToken, user } = useAuth()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('text')
  const [title, setTitle] = useState('')
  const [expiry, setExpiry] = useState('never')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recentSnippets, setRecentSnippets] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/snippets/recent')
      .then(res => res.json())
      .then(data => setRecentSnippets(data))
      .catch(err => console.error('Failed to load recent snippets:', err))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      code,
      language,
      title: title || undefined,
      expiry_type: expiry === 'view_once' ? 'view_once' : expiry === 'never' ? 'never' : 'time',
      expires_at: expiry === 'never' || expiry === 'view_once' ? undefined : expiry,
    }

    try {
      const token = getToken()
      const url = token
        ? `http://localhost:8000/api/snippets?token=${token}`
        : 'http://localhost:8000/api/snippets'

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResult(data)
      addToast('Snippet created successfully!', 'success')

      fetch('http://localhost:8000/api/snippets/recent')
        .then(res => res.json())
        .then(data => setRecentSnippets(data))
    } catch (err) {
      console.error(err)
      addToast('Failed to create snippet', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

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

      <div className="fixed inset-0 bg-black/40" style={{ zIndex: 1 }} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 pt-20 p-4 md:p-8 max-w-4xl mx-auto w-full">
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

            <div className="mt-4 flex justify-center">
              <Shuffle
                text="Paste. Share. Expire."
                shuffleDirection="right"
                duration={0.4}
                animationMode="evenodd"
                shuffleTimes={2}
                ease="power3.out"
                stagger={0.04}
                triggerOnce={true}
                triggerOnHover={true}
                respectReducedMotion={true}
                colorFrom="#b0b0c0"
                colorTo="#ffffff"
                className="text-lg tracking-widest"
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6"
              >
                <AnimatedCard className="border-green-500/30" glowIntensity="high">
                  <p className="font-semibold text-green-400">Snippet created!</p>
                  <p className="font-mono text-sm mt-2 text-gray-200">
                    Slug: <Link to={result.url} className="text-blue-400 hover:text-blue-300">{result.slug}</Link>
                  </p>
                  <p className="font-mono text-sm text-gray-200">URL: {result.url}</p>
                </AnimatedCard>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatedCard glowIntensity="medium">
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

          {recentSnippets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Recent Snippets
              </h2>

              <div className="space-y-3">
                {recentSnippets.map((snippet) => (
                  <Link
                    key={snippet.slug}
                    to={`/s/${snippet.slug}`}
                    className="block group"
                  >
                    <AnimatedCard glowIntensity="low" className="hover:border-gray-600 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`
                            px-2 py-0.5 rounded text-xs font-mono font-medium
                            ${snippet.language === 'python' ? 'bg-blue-500/20 text-blue-400' :
                              snippet.language === 'javascript' ? 'bg-yellow-500/20 text-yellow-400' :
                                snippet.language === 'typescript' ? 'bg-blue-400/20 text-blue-300' :
                                  snippet.language === 'html' ? 'bg-orange-500/20 text-orange-400' :
                                    snippet.language === 'css' ? 'bg-cyan-500/20 text-cyan-400' :
                                      snippet.language === 'json' ? 'bg-gray-500/20 text-gray-400' :
                                        snippet.language === 'sql' ? 'bg-purple-500/20 text-purple-400' :
                                          snippet.language === 'bash' ? 'bg-green-500/20 text-green-400' :
                                            snippet.language === 'rust' ? 'bg-orange-600/20 text-orange-500' :
                                              snippet.language === 'go' ? 'bg-cyan-400/20 text-cyan-300' :
                                                'bg-gray-600/20 text-gray-400'}
                          `}>
                            {snippet.language}
                          </span>
                          <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {snippet.title || 'Untitled'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{snippet.view_count} views</span>
                          <span>{new Date(snippet.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </AnimatedCard>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/s/:slug" element={<SnippetView />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-snippets" element={<MySnippets />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App