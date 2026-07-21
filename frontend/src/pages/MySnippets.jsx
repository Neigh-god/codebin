import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedCard from '../components/ui/AnimatedCard'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../hooks/useAuth'

export default function MySnippets() {
    const { user, getToken, logout } = useAuth()
    const [snippets, setSnippets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = getToken()
        if (!token) {
            setLoading(false)
            return
        }

        fetch(`http://localhost:8000/api/snippets/me?token=${token}`)
            .then(res => {
                if (res.status === 401) {
                    logout()
                    throw new Error('Session expired. Please log in again.')
                }
                if (!res.ok) throw new Error('Failed to fetch snippets')
                return res.json()
            })
            .then(data => {
                setSnippets(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [getToken, logout])

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center pt-20">
                    <AnimatedCard>
                        <p className="text-gray-400 text-lg">Please <Link to="/login" className="text-blue-400 hover:text-blue-300">login</Link> to view your snippets.</p>
                    </AnimatedCard>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-8 px-4 md:px-8 max-w-4xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-white mb-2">My Snippets</h1>
                    <p className="text-gray-400 mb-8">Welcome back, {user.username}</p>
                </motion.div>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                        />
                    </div>
                )}

                {error && (
                    <AnimatedCard className="border-red-500/30">
                        <p className="text-red-400">{error}</p>
                    </AnimatedCard>
                )}

                {!loading && !error && snippets.length === 0 && (
                    <AnimatedCard>
                        <p className="text-gray-400 text-center py-8">No snippets yet. <Link to="/" className="text-blue-400 hover:text-blue-300">Create one</Link></p>
                    </AnimatedCard>
                )}

                {!loading && snippets.length > 0 && (
                    <div className="space-y-3">
                        {snippets.map((snippet, index) => (
                            <motion.div
                                key={snippet.slug}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link to={`/s/${snippet.slug}`} className="block group">
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
                                                {!snippet.is_public && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400 font-medium">
                                                        Private
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>{snippet.view_count} views</span>
                                                <span>{new Date(snippet.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}