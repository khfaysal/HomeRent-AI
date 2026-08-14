export default function Header() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #0B1220 0%, #0F172A 40%, #0D1F3C 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)`,
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      {/* Accent glow blobs */}
      <div style={{
        position: 'absolute', top: -60, left: '10%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: -40, right: '15%',
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '2.5rem 2rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 16,
      }}>
        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(22,163,74,0.45), 0 0 0 1px rgba(34,197,94,0.2)',
            flexShrink: 0,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
              <polyline points="9 21 9 12 15 12 15 21"/>
            </svg>
          </div>

          <div style={{ textAlign: 'left' }}>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}>
              HomeRent{' '}
              <span style={{
                background: 'linear-gradient(90deg, #22C55E, #4ADE80)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>AI</span>
            </h1>
            <p style={{
              color: '#4ADE80',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: 2,
            }}>
              Machine Learning · Rent Prediction
            </p>
          </div>
        </div>

        {/* Subtitle */}
        <p style={{
          color: '#94A3B8',
          fontSize: '1rem',
          fontWeight: 400,
          maxWidth: 520,
          lineHeight: 1.7,
        }}>
          Upload your dataset, train{' '}
          <span style={{ color: '#CBD5E1', fontWeight: 600 }}>3 ML models</span>,
          compare performance, and predict house rent — all in one place.
        </p>

        {/* Step flow pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 40,
          padding: '8px 20px',
          marginTop: 4,
        }}>
          {[
            { n: 1, label: 'Upload Dataset', icon: '⬆' },
            { n: 2, label: 'Train Models', icon: '⚡' },
            { n: 3, label: 'Predict Rent', icon: '৳' },
          ].map((step, i) => (
            <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #16A34A, #22C55E)',
                  color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(22,163,74,0.4)',
                  flexShrink: 0,
                }}>{step.n}</span>
                <span style={{ color: '#CBD5E1', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {step.label}
                </span>
              </div>
              {i < 2 && (
                <span style={{ color: 'rgba(148,163,184,0.4)', fontSize: '0.9rem', margin: '0 2px' }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
