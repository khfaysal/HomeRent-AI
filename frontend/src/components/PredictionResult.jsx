import { useEffect, useState } from 'react'

function AnimatedNumber({ target }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let current = 0
    const steps = 60
    const increment = target / steps
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setDisplay(target); clearInterval(timer) }
      else setDisplay(Math.round(current))
    }, 14)
    return () => clearInterval(timer)
  }, [target])
  return <>{display.toLocaleString()}</>
}

export default function PredictionResult({ predicted_rent, model }) {
  if (predicted_rent == null) return null

  return (
    <div className="section-box animate-scale-in" style={{ animationDelay: '0.05s', overflow: 'visible' }}>
      {/* Section Header */}
      <div className="section-header">
        <div className="section-number">4</div>
        <div className="section-icon-wrap" style={{ background: 'rgba(22,163,74,0.1)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <div className="section-title">Prediction Result</div>
          <div className="section-subtitle">AI-generated rent estimate based on your property details</div>
        </div>
      </div>

      {/* Result body */}
      <div style={{
        background: 'linear-gradient(135deg, #0B1220 0%, #0F172A 50%, #0D1F3C 100%)',
        margin: 0, padding: '3rem 2rem',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }} />

        {/* Glow rings */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 180, height: 180,
          background: 'radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Label */}
        <p style={{
          color: '#64748B', fontWeight: 700, fontSize: '0.72rem',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          marginBottom: 20, position: 'relative',
        }}>
          Estimated Monthly Rent
        </p>

        {/* The number */}
        <div className="animate-scale-in" style={{
          position: 'relative',
          display: 'inline-flex', alignItems: 'baseline', gap: 6,
          marginBottom: 20,
        }}>
          <span style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 800, lineHeight: 1,
            background: 'linear-gradient(90deg, #16A34A, #4ADE80)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>৳</span>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            color: '#fff',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            <AnimatedNumber target={Math.round(predicted_rent)} />
          </span>
        </div>

        {/* Divider */}
        <div style={{
          width: 80, height: 2, margin: '0 auto 20px',
          background: 'linear-gradient(90deg, transparent, #16A34A, transparent)',
        }} />

        {/* Model used + confidence */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 30, padding: '8px 20px',
          position: 'relative',
        }}>
          <span className="glow-pulse" style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#22C55E', display: 'block', flexShrink: 0,
          }} />
          <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 500 }}>
            Predicted by{' '}
            <span style={{ color: '#E2E8F0', fontWeight: 700 }}>{model}</span>
          </span>
        </div>

        {/* Info chips */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', position: 'relative' }}>
          {[
            { icon: '🎯', label: 'ML Powered' },
            { icon: '📊', label: 'Data Driven' },
            { icon: '⚡', label: 'Real-time' },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: '5px 14px',
              fontSize: '0.75rem', color: '#64748B', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
