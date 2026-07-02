import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Instagram, Mail, Linkedin, Github } from 'lucide-react'

export default function Navbar() {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/critical_thinker007?igsh=MXkxbXAycTlqdmhuZw==',
      icon: Instagram,
      color: 'hover:text-pink-400 hover:bg-pink-400/10'
    },
    {
      name: 'Email',
      url: 'mailto:majiupam@gmail.com',
      icon: Mail,
      color: 'hover:text-red-400 hover:bg-red-400/10'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/upam-maji-a69084390',
      icon: Linkedin,
      color: 'hover:text-blue-400 hover:bg-blue-400/10'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Neigh-god/codebin',
      icon: Github,
      color: 'hover:text-white hover:bg-white/10'
    }
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">cb</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            codeBin
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  'p-2 rounded-lg text-gray-400 transition-all duration-200 ' +
                  link.color
                }
                title={link.name}
              >
                <Icon size={20} />
              </a>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
