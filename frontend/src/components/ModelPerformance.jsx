import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'

const MODEL_LABELS = {
  linear_regression: 'Linear Regression',
  random_forest: 'Random Forest',
  gradient_boosting: 'Gradient Boosting',
}

const MODEL_COLORS = {
  linear_regression: '#94A3B8',
  random_forest:     '#16A34A',
  gradient_boosting: '#3B82F6',
}

const MODEL_DESCRIPTIONS = {
  linear_regression: 'Baseline model',
  random_forest:     'Primary model',
  gradient_boosting: 'Comparison model',
}

function MetricCard({ modelKey, metrics, isBest }) {
  const label = MODEL_LABELS[modelKey]
  const color = MODEL_COLORS[modelKey]
  const desc  = MODEL_DESCRIPTIONS[modelKey]
  const r2pct = (metrics.r2 * 100).toFixed(1)

  return (
    <div className={`metric-card ${isBest ? 'best' : ''}`} style={{ animationDelay: '0.1s' }}>
      {/* Best badge */}
      {isBest && (
        <div style={{
          position: 'absolute', top: -1, right: -1,
          background: 'linear-gradient(135deg, #16A34A, #22C55E)',
          color: '#fff', borderRadius: '0 16px 0 12px',
          padding: '5px 14px', fontSize: '0.7rem', fontWeight: 800,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          ★ Best
        </div>
      )}

      {/* Color dot + model name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%', marginTop: 5,
          background: color, flexShrink: 0,
          boxShadow: `0 0 0 3px ${color}28`,
        }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{label}</div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500 }}>{desc}</div>
        </div>
      </div>

      {/* Big R² number */}
      <div style={{
        fontSize: '2.6rem', fontWeight: 900, lineHeight: 1,
        color: isBest ? '#16A34A' : '#334155',
        letterSpacing: '-0.03em', marginBottom: 4,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {r2pct}<span style={{ fontSize: '1.2rem', fontWeight: 600, color: isBest ? '#16A34A' : '#64748B' }}>%</span>
      </div>
      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500, marginBottom: 16 }}>R² Score</div>

      {/* R² bar */}
      <div style={{ height: 6, background: '#E2E8F0', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{
          height: '100%', borderRadius: 10,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          width: `${Math.max(metrics.r2 * 100, 0)}%`,
          transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>

      {/* MAE + RMSE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { k: 'MAE',  v: metrics.mae },
          { k: 'RMSE', v: metrics.rmse },
        ].map(({ k, v }) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8',
              background: '#F1F5F9', borderRadius: 6, padding: '2px 8px',
            }}>{k}</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
              ৳ {v.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: '#0F172A', color: '#fff',
        borderRadius: 12, padding: '10px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginBottom: 4 }}>{label}</p>
        <p style={{ fontWeight: 700, fontSize: '1rem' }}>
          {(payload[0].value * 100).toFixed(1)}%
          <span style={{ color: '#64748B', fontSize: '0.75rem', marginLeft: 4 }}>R²</span>
        </p>
      </div>
    )
  }
  return null
}

export default function ModelPerformance({ models, bestModel }) {
  if (!models) return null

  const bestKey = Object.entries(MODEL_LABELS).find(([, v]) => v === bestModel)?.[0]

  const chartData = Object.entries(models).map(([key, m]) => ({
    name: key === 'linear_regression' ? 'Linear' : key === 'random_forest' ? 'Random Forest' : 'Gradient Boost',
    r2: m.r2, key,
  }))

  return (
    <div className="section-box animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* Section Header */}
      <div className="section-header">
        <div className="section-number">2</div>
        <div className="section-icon-wrap" style={{ background: 'rgba(59,130,246,0.1)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6"  y1="20" x2="6"  y2="14"/>
          </svg>
        </div>
        <div>
          <div className="section-title">Model Performance</div>
          <div className="section-subtitle">
            Evaluated on 20% test set ·{' '}
            <span style={{ color: '#16A34A', fontWeight: 600 }}>Best: {bestModel}</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 16, padding: '24px 28px 0',
      }}>
        {Object.entries(models).map(([key, metrics]) => (
          <MetricCard key={key} modelKey={key} metrics={metrics} isBest={key === bestKey} />
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ padding: '24px 28px 28px' }}>
        <div style={{
          background: '#FAFBFD',
          border: '1.5px solid #E2E8F0',
          borderRadius: 16, padding: '20px 20px 10px',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#475569', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            R² Score Comparison
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={52} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 1]}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 8 }} />
              <Bar dataKey="r2" radius={[8, 8, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={MODEL_COLORS[entry.key]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
