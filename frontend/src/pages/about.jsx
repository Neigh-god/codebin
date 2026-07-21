import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    Code2,
    Clock,
    Lock,
    Share2,
    QrCode,
    Eye,
    Terminal,
    Sparkles
} from 'lucide-react'
import AnimatedCard from '../components/ui/AnimatedCard'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const features = [
    {
        icon: <Code2 size={24} />,
        title: 'Syntax Highlighting',
        desc: 'Auto-detect language or pick from 10+ options. Powered by PrismJS.'
    },
    {
        icon: <Clock size={24} />,
        title: 'Smart Expiry',
        desc: 'Set snippets to expire in 1 hour, 1 day, 1 week, 1 month, after one view, or never.'
    },
    {
        icon: <Lock size={24} />,
        title: 'Password Protection',
        desc: 'Secure sensitive code with bcrypt-hashed passwords.'
    },
    {
        icon: <Share2 size={24} />,
        title: 'One-Click Sharing',
        desc: 'Short URLs, QR codes, and embed widgets for every snippet.'
    },
    {
        icon: <QrCode size={24} />,
        title: 'QR Codes',
        desc: 'Scan to open snippets instantly on your phone.'
    },
    {
        icon: <Eye size={24} />,
        title: 'Public & Private',
        desc: 'Public feed for discovery, private snippets for your eyes only.'
    }
]

const techStack = [
    { name: 'FastAPI', color: 'text-green-400', bg: 'bg-green-400/10' },
    { name: 'React 19', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Tailwind CSS', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { name: 'Three.js', color: 'text-white', bg: 'bg-white/10' },
    { name: 'SQLite', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { name: 'PyJWT', color: 'text-purple-400', bg: 'bg-purple-400/10' }
]

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 px-4 max-w-4xl mx-auto w-full">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">codeBin</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        A modern pastebin built for developers who care about clean code,
                        beautiful sharing, and smart expiration.
                    </p>
                </motion.div>

                {/* Developer Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <AnimatedCard glowIntensity="medium">
                        <div className="flex flex-col md:flex-row items-center gap-6 p-4">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500/50">
                                    <img
                                        src="/me.png"
                                        alt="Upam Maji"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                    #OpenToWork
                                </div>
                            </div>

                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-2xl font-bold text-white mb-1">Upam Maji</h2>
                                <p className="text-blue-400 text-sm mb-3">Full-Stack Developer</p>
                                <p className="text-gray-400 text-sm mb-4 max-w-md">
                                    Building codeBin because I believe sharing code should be as beautiful
                                    as writing it. Passionate about React, Python, and creating tools that
                                    developers actually enjoy using.
                                </p>
                            </div>
                        </div>
                    </AnimatedCard>
                </motion.div>

                {/* How to Use */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Terminal size={24} className="text-blue-400" />
                        How to Use
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { step: '1', title: 'Paste Code', desc: 'Drop your code into the editor. Pick a language for syntax highlighting.' },
                            { step: '2', title: 'Set Options', desc: 'Choose expiry time, add a password, or set visibility to public/private.' },
                            { step: '3', title: 'Share', desc: 'Copy the short URL, scan the QR code, or embed it anywhere with an iframe.' }
                        ].map((item) => (
                            <AnimatedCard key={item.step} glowIntensity="low" className="text-center">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                                    {item.step}
                                </div>
                                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </AnimatedCard>
                        ))}
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Sparkles size={24} className="text-purple-400" />
                        Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                            >
                                <AnimatedCard glowIntensity="low" className="flex items-start gap-4">
                                    <div className="text-blue-400 mt-0.5">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Tech Stack</h2>
                    <div className="flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                            <span
                                key={tech.name}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${tech.color} ${tech.bg} border border-gray-700/50`}
                            >
                                {tech.name}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Open Source */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <AnimatedCard glowIntensity="low" className="inline-block">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-300">Open source on</span>
                            <a
                                href="https://github.com/Neigh-god/codebin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                                GitHub
                            </a>
                        </div>
                    </AnimatedCard>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}