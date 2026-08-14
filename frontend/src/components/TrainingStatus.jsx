import { useEffect, useState } from 'react'

const STEPS = [
  { label: 'Preparing dataset', icon: '📊' },
  { label: 'Training Linear Regression', icon: '📈' },
  { label: 'Training Random Forest', icon: '🌲' },
  { label: 'Training Gradient Boosting', icon: '⚡' },
  { label: 'Evaluating all models', icon: '✅' },
]

export default function TrainingStatus() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const delays = [500, 1300, 2200, 3100, 4000]
    const timers = delays.map((d, i) => setTimeout(() => setCurrentStep(i + 1), d))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="section-box animate-fade-in-up">
      {/* Header */}
      <div className="section-header">
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spin">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        <div>
          <div className="section-title">Training in Progress</div>
          <div className="section-subtitle">Please wait while models are being trained…</div>
        </div>
        {/* Progress fraction */}
        <div style={{
          marginLeft: 'auto',
          background: 'rgba(22,163,74,0.08)',
          borderRadius: 20, padding: '4px 14px',
          fontSize: '0.8rem', fontWeight: 700, color: '#16A34A',
          border: '1px solid rgba(22,163,74,0.2)',
        }}>
          {Math.min(currentStep, STEPS.length)} / {STEPS.length}
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Progress bar */}
        <div style={{
          height: 6, borderRadius: 10,
          background: '#F1F5F9',
          marginBottom: 16, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 10,
            background: 'linear-gradient(90deg, #16A34A, #22C55E)',
            width: `${(Math.min(currentStep, STEPS.length) / STEPS.length) * 100}%`,
            transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 0 10px rgba(22,163,74,0.4)',
          }} />
        </div>

        {STEPS.map((step, i) => {
          const done = currentStep > i
          const active = currentStep === i
          const pending = currentStep < i

          return (
            <div
              key={step.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px',
                borderRadius: 12,
                background: done
                  ? 'linear-gradient(135deg, rgba(22,163,74,0.06), rgba(34,197,94,0.04))'
                  : active
                    ? 'rgba(15,23,42,0.04)'
                    : 'transparent',
                border: done
                  ? '1px solid rgba(22,163,74,0.15)'
                  : active
                    ? '1px solid rgba(15,23,42,0.08)'
                    : '1px solid transparent',
                opacity: pending ? 0.4 : 1,
                transition: 'all 0.4s ease',
              }}
            >
              {/* Status icon */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done
                  ? 'linear-gradient(135deg, #16A34A, #22C55E)'
                  : active
                    ? '#F1F5F9'
                    : '#F8FAFC',
                border: done ? 'none' : '1.5px solid #E2E8F0',
                boxShadow: done ? '0 2px 8px rgba(22,163,74,0.3)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : active ? (
                  <span className="pulse-dot" style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: '#16A34A', display: 'block',
                  }} />
                ) : (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#CBD5E1', display: 'block',
                  }} />
                )}
              </div>

              {/* Label */}
              <span style={{ fontSize: '0.9rem', fontWeight: done ? 600 : active ? 600 : 400 }}>
                {step.label}
              </span>

              {/* Right status */}
              <div style={{ marginLeft: 'auto' }}>
                {done && (
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700, color: '#16A34A',
                    background: 'rgba(22,163,74,0.1)',
                    padding: '2px 10px', borderRadius: 20,
                  }}>Done</span>
                )}
                {active && (
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontStyle: 'italic' }}>
                    in progress…
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
