import { useState } from 'react'

export default function DatasetHistory({ history, activeId, onDelete, onActivate }) {
  const [deletingId, setDeletingId] = useState(null)

  if (!history || history.length === 0) {
    return null
  }

  const handleDeleteClick = async (id, filename) => {
    if (window.confirm(`Are you sure you want to delete dataset "${filename}" and purge its trained models?`)) {
      setDeletingId(id)
      try {
        await onDelete(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="section-box animate-fade-in-up" style={{ marginTop: '1.5rem' }}>
      {/* Section Header */}
      <div className="section-header">
        <div className="section-number" style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3"/>
            <circle cx="12" cy="12" r="9"/>
          </svg>
        </div>
        <div>
          <div className="section-title">Tracked Trained Datasets</div>
          <div className="section-subtitle">Manage uploaded dataset training history & remove inappropriate datasets</div>
        </div>
        <div style={{ marginLeft: 'auto', background: 'rgba(14,165,233,0.1)', padding: '4px 12px', borderRadius: 20 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0284C7' }}>
            {history.length} {history.length === 1 ? 'Dataset Tracked' : 'Datasets Tracked'}
          </span>
        </div>
      </div>

      {/* History Grid */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {history.map((item) => {
          const isActive = item.id === activeId || item.is_active

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                padding: '16px 20px',
                borderRadius: 12,
                background: isActive ? 'linear-gradient(135deg, rgba(22,163,74,0.04), rgba(34,197,94,0.02))' : '#F8FAFC',
                border: isActive ? '1px solid rgba(22,163,74,0.3)' : '1px solid #E2E8F0',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Left Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: isActive ? 'rgba(22,163,74,0.12)' : '#E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isActive ? '#16A34A' : '#64748B',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>{item.filename}</span>
                    {isActive && (
                      <span style={{
                        background: '#16A34A', color: '#FFFFFF',
                        fontSize: '0.68rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: 10,
                        textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}>
                        Active Model
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: 2 }}>
                    Trained on {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Middle Metrics */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Best Model</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', marginTop: 2 }}>{item.best_model}</div>
                </div>
                <div style={{ width: 1, height: 28, background: '#CBD5E1' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>R² Score</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: item.r2_score > 0.8 ? '#16A34A' : '#D97706', marginTop: 2 }}>
                    {(item.r2_score * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!isActive && onActivate && (
                  <button
                    type="button"
                    onClick={() => onActivate(item.id)}
                    style={{
                      background: 'rgba(22,163,74,0.08)',
                      color: '#16A34A',
                      border: '1px solid rgba(22,163,74,0.25)',
                      borderRadius: 8,
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>⚡</span> Activate Model
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteClick(item.id, item.filename)}
                  disabled={deletingId === item.id}
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    color: '#DC2626',
                    border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: deletingId === item.id ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#FFF' }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#DC2626' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  {deletingId === item.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
