import { useState, useRef } from 'react'

export default function DatasetUpload({ onTrainSuccess, isTraining }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleFile = (f) => {
    setError('')
    if (!f) return
    if (!f.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.')
      setFile(null)
      return
    }
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="section-box animate-fade-in-up">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-number">1</div>
        <div className="section-icon-wrap" style={{ background: 'rgba(22,163,74,0.1)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div>
          <div className="section-title">Upload Training Dataset</div>
          <div className="section-subtitle">Drop your cleaned CSV to begin model training</div>
        </div>
        {file && (
          <div style={{
            marginLeft: 'auto',
            background: 'rgba(22,163,74,0.1)',
            border: '1px solid rgba(22,163,74,0.25)',
            borderRadius: 20, padding: '4px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A', display: 'block' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#16A34A' }}>File ready</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '28px 28px' }}>
        {/* Drop zone */}
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          style={{ padding: '3rem 2rem', textAlign: 'center' }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input ref={inputRef} type="file" accept=".csv" style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])} />

          {file ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(34,197,94,0.1))',
                border: '2px solid rgba(22,163,74,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#0F172A', fontSize: '1rem' }}>{file.name}</p>
                <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: 2 }}>
                  {(file.size / 1024).toFixed(1)} KB · Click to change file
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              {/* Upload icon */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
                border: '2px solid #E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1"/>
                  <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#334155', fontSize: '1rem' }}>Drag & drop your CSV file here</p>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: 4 }}>or <span style={{ color: '#16A34A', fontWeight: 600 }}>click to browse files</span></p>
              </div>
              {/* Tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {['✓ CSV format', '✓ Cleaned data required', '✓ No size limit'].map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(22,163,74,0.07)',
                    border: '1px solid rgba(22,163,74,0.2)',
                    borderRadius: 20, padding: '4px 12px',
                    fontSize: '0.75rem', fontWeight: 600, color: '#16A34A',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && <div className="alert-error" style={{ marginTop: 12 }}>{error}</div>}

        {/* Train button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button
            id="train-models-btn"
            className="btn-primary"
            onClick={() => file && onTrainSuccess(file)}
            disabled={!file || isTraining}
            style={{ minWidth: 200, fontSize: '1rem', padding: '0.9rem 2.5rem' }}
          >
            {isTraining ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spin">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Training Models…
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Train Models
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
