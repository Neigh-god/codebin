import { Instagram, Mail, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/critical_thinker007?igsh=MXkxbXAycTlqdmhuZw==',
      icon: Instagram,
      color: 'hover:text-pink-400 hover:border-pink-400/30'
    },
    {
      name: 'Email',
      url: 'mailto:majiupam@gmail.com',
      icon: Mail,
      color: 'hover:text-red-400 hover:border-red-400/30'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/upam-maji-a69084390',
      icon: Linkedin,
      color: 'hover:text-blue-400 hover:border-blue-400/30'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Neigh-god/codebin',
      icon: Github,
      color: 'hover:text-white hover:border-white/30'
    }
  ]

  return (
    <footer className="relative z-10 py-6 text-center bg-gray-950/80 backdrop-blur-xl border-t border-gray-800/50 mt-auto">
      <div className="flex items-center justify-center gap-3 mb-4">
        {socialLinks.map((link) => {
          const Icon = link.icon
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ' +
                'bg-gray-800/50 border border-gray-700 text-gray-400 ' +
                'transition-all duration-200 ' +
                link.color
              }
              title={link.name}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{link.name}</span>
            </a>
          )
        })}
      </div>
      <p className="text-gray-300 text-sm font-medium">
        Built with <span className="text-red-400">♥</span> by Upam Maji
      </p>
      <p className="text-gray-400 text-xs mt-2">
        codeBin — Paste. Share. Expire.
      </p>
    </footer>
  )
}
