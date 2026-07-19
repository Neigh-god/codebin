import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import AnimatedCard from "../components/ui/AnimatedCard"
import AnimatedInput from "../components/ui/AnimatedInput"
import GlowButton from "../components/ui/GlowButton"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../hooks/useToast"
import ToastContainer from "../components/feedback/ToastContainer"

export default function Login() {
    const [isSignup, setIsSignup] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const { toasts, addToast, removeToast } = useToast()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const endpoint = isSignup ? 'signup' : 'login'
        const payload = isSignup
            ? { username, email, password }
            : { username, password }

        try {
            const res = await fetch(`http://localhost:8000/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || 'Authentication failed')
            }

            login(data.access_token, { id: data.user_id, username: data.username })
            addToast(isSignup ? 'Account created!' : 'Welcome back!', 'success')
            navigate('/')
        } catch (err) {
            addToast(err.message, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <AnimatedCard glowIntensity="medium">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatedInput
                            label="Username"
                            type="text"
                            placeholder="Enter username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        {isSignup && (
                            <AnimatedInput
                                label="Email"
                                type="email"
                                placeholder="Enter email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        )}

                        <AnimatedInput
                            label="Password"
                            type="password"
                            placeholder="Enter password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <GlowButton type="submit" disabled={loading}>
                            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log In'}
                        </GlowButton>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-400">
                        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => setIsSignup(!isSignup)}
                            className="text-blue-400 hover:text-blue-300"
                        >
                            {isSignup ? 'Log In' : 'Sign Up'}
                        </button>
                    </p>

                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-300">
                            ← Back to home
                        </Link>
                    </div>
                </AnimatedCard>
            </motion.div>
        </div>
    )
}