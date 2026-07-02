import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import AnimatedCard from '../components/ui/AnimatedCard'
import CopyButton from '../components/ui/CopyButton'
import VibgyorBorder from '../components/ui/VibgyorBorder'

export default function SnippetView() {
  const { slug } = useParams()
  const [snippet, setSnippet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [password, setPassword] = useState('')
  const [needsPassword, setNeedsPassword] = useState(false)

  useEffect(() => {
    fetchSnippet()
  }, [slug])

  const fetchSnippet = async (pwd = null) => {
    try {
      setLoading(true)
      let url = 'http://localhost:8000/api/snippets/' + slug
      if (pwd) url += '?password=' + encodeURIComponent(pwd)
      
      const res = await fetch(url)
      if (res.status === 403) {
        setNeedsPassword(true)
        setLoading(false)
        return
      }
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || 'Failed to fetch')
      }
      
      const data = await res.json()
      setSnippet(data)
      setNeedsPassword(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    fetchSnippet(password)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedCard glowIntensity="low">
          <div className="text-center">
            <p className="text-red-400 text-xl mb-4">✕ {error}</p>
            <Link to="/" className="text-blue-400 hover:text-blue-300">← Back to home</Link>
          </div>
        </AnimatedCard>
      </div>
    )
  }

  if (needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AnimatedCard glowIntensity="medium">
          <h2 className="text-xl font-bold mb-4">Password Protected</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white"
            >
              Unlock
            </button>
          </form>
        </AnimatedCard>
      </div>
    )
  }

  if (!snippet) return null

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {snippet.title || 'Untitled Snippet'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {snippet.language} • {new Date(snippet.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <CopyButton text={snippet.code} />
              <a
                href={'http://localhost:8000/api/snippets/' + slug + '/raw'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white transition-all"
              >
                Raw
              </a>
              <a
                href={'http://localhost:8000/api/snippets/' + slug + '/download'}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white transition-all"
              >
                Download
              </a>
            </div>
          </div>

          <VibgyorBorder glowIntensity="low">
            <div className="overflow-hidden rounded-xl">
              <SyntaxHighlighter
                language={snippet.language === 'text' ? 'plaintext' : snippet.language}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  background: 'transparent',
                }}
                lineNumberStyle={{
                  color: '#4a4a5a',
                  paddingRight: '1rem',
                  minWidth: '2.5rem',
                }}
              >
                {snippet.code}
              </SyntaxHighlighter>
            </div>
          </VibgyorBorder>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <p>Slug: <code className="text-gray-300">{snippet.slug}</code></p>
            <p>Views: {snippet.view_count}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
