import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Highlight, themes } from 'prism-react-renderer'
import { QRCodeSVG } from 'qrcode.react'
import AnimatedCard from '../components/ui/AnimatedCard'
import CopyButton from '../components/ui/CopyButton'
import VibgyorBorder from '../components/ui/VibgyorBorder'

function useCountdown(expiresAt) {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    if (!expiresAt || expiresAt === 'null' || expiresAt === 'undefined') return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()

      let expiry
      try {
        expiry = new Date(expiresAt).getTime()
      } catch {
        return null
      }

      if (isNaN(expiry)) return null

      const diff = expiry - now

      if (diff <= 0) return { expired: true, text: 'Expired' }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        return { expired: false, text: `${days}d ${hours % 24}h ${minutes}m` }
      }
      if (hours > 0) {
        return { expired: false, text: `${hours}h ${minutes}m ${seconds}s` }
      }
      if (minutes > 0) {
        return { expired: false, text: `${minutes}m ${seconds}s` }
      }
      return { expired: false, text: `${seconds}s` }
    }

    const initial = calculateTimeLeft()
    if (!initial) return

    setTimeLeft(initial)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])

  return timeLeft
}

export default function SnippetView() {
  const { slug } = useParams()
  const [snippet, setSnippet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [password, setPassword] = useState('')
  const [needsPassword, setNeedsPassword] = useState(false)
  const [embedCopied, setEmbedCopied] = useState(false)

  const countdown = useCountdown(snippet?.expires_at)

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
      if (res.status === 410) {
        const errData = await res.json()
        throw new Error(errData.detail || 'This snippet has expired')
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

  const handleEmbed = () => {
    const embedCode = `<iframe src="http://localhost:8000/api/snippets/${slug}/embed" width="100%" height="300" frameborder="0" style="border-radius: 8px; overflow: hidden;"></iframe>`
    navigator.clipboard.writeText(embedCode)
    setEmbedCopied(true)
    setTimeout(() => setEmbedCopied(false), 2000)
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

  const languageMap = {
    text: 'text',
    python: 'python',
    javascript: 'javascript',
    typescript: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    sql: 'sql',
    bash: 'bash',
    rust: 'rust',
    go: 'go',
  }

  const prismLang = languageMap[snippet.language] || 'text'
  const shareUrl = `http://localhost:5173/s/${slug}`

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
                {snippet.expiry_type === 'view_once' && (
                  <span className="ml-2 px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400 font-medium">
                    View Once
                  </span>
                )}
                {countdown && (
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${countdown.expired
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-orange-500/20 text-orange-400'
                    }`}>
                    {countdown.expired ? 'Expired' : `⏱ ${countdown.text}`}
                  </span>
                )}
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
              <button
                onClick={handleEmbed}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white transition-all"
              >
                {embedCopied ? 'Copied!' : 'Embed'}
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg">
              <QRCodeSVG
                value={shareUrl}
                size={96}
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="text-sm text-gray-400">
              <p className="text-white font-medium mb-1">Scan to share</p>
              <p className="text-xs">Open this snippet on your phone</p>
            </div>
          </div>

          <VibgyorBorder glowIntensity="low">
            <div className="overflow-hidden rounded-xl">
              <Highlight
                theme={themes.vsDark}
                code={snippet.code}
                language={prismLang}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className={`${className} overflow-auto`}
                    style={{
                      ...style,
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      background: 'transparent',
                    }}
                  >
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '2.5rem',
                            textAlign: 'right',
                            paddingRight: '1rem',
                            color: '#4a4a5a',
                            userSelect: 'none',
                          }}
                        >
                          {i + 1}
                        </span>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
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