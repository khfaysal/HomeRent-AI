import { useState } from 'react'

const ROAD_OPTIONS = ['Yes', 'No']

export default function PredictionForm({ locations, onPredict, isPredicting, isTrained }) {
  const [form, setForm] = useState({
    location: '',
    room_count: 2,
    balcony_count: 1,
    road_facility: 'Yes',
  })
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(null)

  // Sync location default when locations arrive after training
  const effectiveLocation = form.location || locations[0] || ''

  const set = (field, value) => {
    setError('')
    setForm(p => ({ ...p, [field]: value }))
  }

  const handleSubmit = () => {
    setError('')
    if (!isTrained) return
    if (!effectiveLocation) return setError('Please select a location.')
    if (form.room_count < 1) return setError('Room count must be at least 1.')
    onPredict({ ...form, location: effectiveLocation })
  }

  const focusStyle = (id) => ({
    borderColor: focused === id ? '#16A34A' : '#E2E8F0',
    boxShadow: focused === id ? '0 0 0 4px rgba(22,163,74,0.1)' : 'none',
    background: focused === id ? '#fff' : isTrained ? '#FAFBFD' : '#F8FAFC',
  })

  const baseInput = (id) => ({
    width: '100%',
    padding: '0.82rem 1rem 0.82rem 2.7rem',
    border: '1.5px solid',
    borderRadius: 12,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.92rem',
    color: isTrained ? '#1E293B' : '#94A3B8',
    outline: 'none',
    transition: 'all 0.2s',
    appearance: 'none',
    cursor: isTrained ? 'auto' : 'not-allowed',
    ...focusStyle(id),
  })

  return (
    <div
      className="section-box animate-fade-in-up"
      id="predict-section"
      style={{ animationDelay: '0.15s' }}
    >
      {/* ── Section Header ── */}
      <div className="section-header">
        <div className="section-number" style={{
          background: isTrained
            ? 'linear-gradient(135deg, #16A34A, #22C55E)'
            : 'linear-gradient(135deg, #94A3B8, #CBD5E1)',
        }}>
          {isTrained ? '3' : '3'}
        </div>
        <div className="section-icon-wrap" style={{
          background: isTrained ? 'rgba(168,85,247,0.1)' : 'rgba(148,163,184,0.1)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={isTrained ? '#A855F7' : '#94A3B8'}
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div>
          <div className="section-title">Predict Your Rent</div>
          <div className="section-subtitle">
            {isTrained
              ? 'Enter property details below to get an instant rent estimate'
              : 'Train models first — then enter your property details here'}
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          marginLeft: 'auto', borderRadius: 20,
          padding: '4px 14px', fontSize: '0.76rem', fontWeight: 700,
          background: isTrained ? 'rgba(22,163,74,0.1)' : 'rgba(148,163,184,0.1)',
          border: `1px solid ${isTrained ? 'rgba(22,163,74,0.25)' : 'rgba(148,163,184,0.25)'}`,
          color: isTrained ? '#16A34A' : '#94A3B8',
          display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: isTrained ? '#16A34A' : '#CBD5E1',
            display: 'block',
          }} />
          {isTrained ? 'Ready' : 'Awaiting Training'}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '28px', position: 'relative' }}>

        {/* Locked overlay when not trained */}
        {!isTrained && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(248,250,252,0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 10,
            borderRadius: '0 0 20px 20px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: '#F1F5F9', border: '2px solid #E2E8F0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#334155' }}>
                Models Not Trained Yet
              </p>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 4, maxWidth: 280 }}>
                Upload your CSV dataset and click <strong>Train Models</strong> above to unlock rent prediction.
              </p>
            </div>
          </div>
        )}

        {/* ── Input Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
        }}>

          {/* Location */}
          <div style={{ gridColumn: 'span 2' }}>
            <FieldLabel icon={<LocationIcon />} label="LOCATION" active={focused === 'location'} />
            <div style={{ position: 'relative' }}>
              <IconWrap><LocationIcon /></IconWrap>
              <select
                id="location-select"
                style={baseInput('location')}
                value={effectiveLocation}
                disabled={!isTrained}
                onChange={e => set('location', e.target.value)}
                onFocus={() => setFocused('location')}
                onBlur={() => setFocused(null)}
              >
                {locations.length === 0
                  ? <option value="">— select after training —</option>
                  : locations.map(l => <option key={l} value={l}>{l}</option>)
                }
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Room Count */}
          <div>
            <FieldLabel icon={<RoomIcon />} label="NUMBER OF ROOMS" active={focused === 'room_count'} />
            <div style={{ position: 'relative' }}>
              <IconWrap><RoomIcon /></IconWrap>
              <input
                id="room-count-input"
                type="number" min={1} max={20}
                style={baseInput('room_count')}
                value={form.room_count}
                disabled={!isTrained}
                onChange={e => set('room_count', Math.max(1, parseInt(e.target.value) || 1))}
                onFocus={() => setFocused('room_count')}
                onBlur={() => setFocused(null)}
              />
            </div>
          </div>

          {/* Balcony Count */}
          <div>
            <FieldLabel icon={<BalconyIcon />} label="BALCONY COUNT" active={focused === 'balcony_count'} />
            <div style={{ position: 'relative' }}>
              <IconWrap><BalconyIcon /></IconWrap>
              <input
                id="balcony-count-input"
                type="number" min={0} max={10}
                style={baseInput('balcony_count')}
                value={form.balcony_count}
                disabled={!isTrained}
                onChange={e => set('balcony_count', Math.max(0, parseInt(e.target.value) || 0))}
                onFocus={() => setFocused('balcony_count')}
                onBlur={() => setFocused(null)}
              />
            </div>
          </div>

          {/* Road Facility — full width, big toggle */}
          <div style={{ gridColumn: '1 / -1' }}>
            <FieldLabel icon={<RoadIcon />} label="ROAD-SIDE HOME?" active={false} />
            <div style={{ display: 'flex', gap: 12 }}>
              {['Yes', 'No'].map(opt => {
                const isSelected = form.road_facility === opt
                return (
                  <button
                    key={opt}
                    onClick={() => isTrained && set('road_facility', opt)}
                    style={{
                      flex: 1,
                      padding: '0.85rem 1rem',
                      borderRadius: 12,
                      border: `1.5px solid ${isSelected
                        ? (opt === 'Yes' ? '#16A34A' : '#EF4444')
                        : '#E2E8F0'}`,
                      background: isSelected
                        ? (opt === 'Yes'
                            ? 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(34,197,94,0.06))'
                            : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04))')
                        : '#FAFBFD',
                      color: isSelected
                        ? (opt === 'Yes' ? '#15803D' : '#DC2626')
                        : '#64748B',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.92rem',
                      cursor: isTrained ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {opt === 'Yes' ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke={isSelected ? '#16A34A' : '#94A3B8'}
                          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 17l2-8h14l2 8"/><path d="M7 17v-4h10v4"/>
                          <circle cx="8.5" cy="19" r="1"/><circle cx="15.5" cy="19" r="1"/>
                        </svg>
                        Yes — Road Side
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke={isSelected ? '#EF4444' : '#94A3B8'}
                          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        No Road Access
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Model Selection for Prediction */}
          <div style={{ gridColumn: '1 / -1', marginTop: 6 }}>
            <FieldLabel icon={<span>🤖</span>} label="PREDICTION MODEL CHOICE" active={false} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {[
                { id: 'best', label: 'Auto (Best Model)', icon: '🏆' },
                { id: 'gradient_boosting', label: 'Gradient Boosting', icon: '🚀' },
                { id: 'random_forest', label: 'Random Forest', icon: '🌲' },
                { id: 'linear_regression', label: 'Linear Regression', icon: '📈' },
              ].map((m) => {
                const isSelected = (form.selected_model || 'best') === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => isTrained && set('selected_model', m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: isSelected ? '2px solid #8B5CF6' : '1px solid #E2E8F0',
                      background: isSelected ? 'rgba(139,92,246,0.08)' : '#FAFBFD',
                      color: isSelected ? '#6D28D9' : '#64748B',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: isTrained ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '0.95rem' }}>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Property Summary Strip ── */}
        {isTrained && (
          <div style={{
            marginTop: 20, padding: '12px 16px',
            background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
            borderRadius: 12, border: '1.5px solid #E2E8F0',
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em' }}>
              PREDICTING FOR:
            </span>
            {[
              { label: effectiveLocation || '—', bg: '#3B82F6' },
              { label: `${form.room_count} Room${form.room_count !== 1 ? 's' : ''}`, bg: '#8B5CF6' },
              { label: `${form.balcony_count} Balcon${form.balcony_count !== 1 ? 'ies' : 'y'}`, bg: '#F59E0B' },
              { label: form.road_facility === 'Yes' ? '✓ Road Side' : '✗ No Road', bg: form.road_facility === 'Yes' ? '#16A34A' : '#EF4444' },
            ].map(({ label, bg }) => (
              <span key={label} style={{
                background: `${bg}12`, border: `1px solid ${bg}30`,
                borderRadius: 20, padding: '3px 12px',
                fontSize: '0.78rem', fontWeight: 600, color: bg,
              }}>{label}</span>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <div className="alert-error" style={{ marginTop: 14 }}>{error}</div>}

        {/* ── Predict Button ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button
            id="predict-rent-btn"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isPredicting || !isTrained}
            style={{
              minWidth: 240, fontSize: '1rem', padding: '0.95rem 2.8rem',
              background: !isTrained
                ? 'linear-gradient(135deg, #CBD5E1, #94A3B8)'
                : undefined,
              boxShadow: !isTrained ? 'none' : undefined,
            }}
          >
            {isPredicting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 9, justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spin">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Calculating Rent…
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 9, justifyContent: 'center' }}>
                <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>৳</span>
                {isTrained ? 'Predict My Rent' : 'Train Models First'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Tiny helpers ── */
function FieldLabel({ icon, label, active }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontWeight: 700, fontSize: '0.72rem',
      color: active ? '#16A34A' : '#94A3B8',
      marginBottom: 8, letterSpacing: '0.06em',
      transition: 'color 0.2s',
    }}>
      <span style={{ color: active ? '#16A34A' : '#CBD5E1' }}>{icon}</span>
      {label}
    </label>
  )
}

function IconWrap({ children }) {
  return (
    <div style={{
      position: 'absolute', left: 13, top: '50%',
      transform: 'translateY(-50%)',
      color: '#94A3B8', pointerEvents: 'none',
    }}>{children}</div>
  )
}

function ChevronIcon() {
  return (
    <div style={{
      position: 'absolute', right: 12, top: '50%',
      transform: 'translateY(-50%)',
      color: '#94A3B8', pointerEvents: 'none',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  )
}

function LocationIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function RoomIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  )
}
function BalconyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function RoadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l2-8h14l2 8"/><path d="M7 17v-4h10v4"/>
      <circle cx="8.5" cy="19" r="1"/><circle cx="15.5" cy="19" r="1"/>
    </svg>
  )
}
