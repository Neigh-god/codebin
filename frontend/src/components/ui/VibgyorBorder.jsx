import './VibgyorBorder.css'

export default function VibgyorBorder({ children, className = '', glowIntensity = 'medium' }) {
  const glowClass = glowIntensity === 'high' ? 'glow-high' : glowIntensity === 'low' ? 'glow-low' : 'glow-medium'
  
  return (
    <div className={'vibgyor-border-wrapper ' + glowClass + ' ' + className}>
      <div className="vibgyor-border-animated" />
      <div className="vibgyor-border-inner">
        {children}
      </div>
    </div>
  )
}
