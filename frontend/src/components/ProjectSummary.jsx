export default function ProjectSummary() {
  return (
    <div className="section-box animate-fade-in-up" style={{ animationDelay: '0.2s', overflow: 'hidden' }}>

      {/* ── Section Header ── */}
      <div className="section-header">
        <div className="section-number" style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div className="section-icon-wrap" style={{ background: 'rgba(99,102,241,0.1)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div>
          <div className="section-title">Project Summary</div>
          <div className="section-subtitle">How HomeRent AI works — under the hood</div>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0B1220 0%, #0F172A 60%, #0D1F3C 100%)',
        padding: '3rem 2.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '28px 28px', pointerEvents: 'none',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 400, height: 200,
          background: 'radial-gradient(ellipse, rgba(22,163,74,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <p style={{
          color: '#4ADE80', fontWeight: 700, fontSize: '0.7rem',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          marginBottom: 12, position: 'relative',
        }}>About This Project</p>
        <h2 style={{
          color: '#fff', fontWeight: 900,
          fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
          letterSpacing: '-0.02em', lineHeight: 1.2,
          marginBottom: 14, position: 'relative',
        }}>
          AI-Powered House Rent Prediction<br />
          <span style={{
            background: 'linear-gradient(90deg, #16A34A, #4ADE80)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>using Machine Learning</span>
        </h2>
        <p style={{
          color: '#94A3B8', fontSize: '0.95rem', maxWidth: 600,
          margin: '0 auto', lineHeight: 1.8, position: 'relative',
        }}>
          HomeRent AI is a full-stack web application that combines a <strong style={{ color: '#CBD5E1' }}>React frontend</strong> with
          a <strong style={{ color: '#CBD5E1' }}>Python FastAPI backend</strong> to train machine learning models on real estate
          data and predict monthly house rent based on property features.
        </p>

        {/* Stat pills */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 12,
          flexWrap: 'wrap', marginTop: 24, position: 'relative',
        }}>
          {[
            { n: '3', label: 'ML Models' },
            { n: '4', label: 'Input Features' },
            { n: '80/20', label: 'Train/Test Split' },
            { n: '3', label: 'Eval Metrics' },
          ].map(({ n, label }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '10px 20px',
              textAlign: 'center',
            }}>
              <div style={{ color: '#22C55E', fontWeight: 900, fontSize: '1.3rem', lineHeight: 1 }}>{n}</div>
              <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600, marginTop: 4, letterSpacing: '0.04em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body Content ── */}
      <div style={{ padding: '2.5rem 2.5rem 3rem' }}>

        {/* How It Works — Flow */}
        <SectionHeading icon="⚙️" title="How It Works" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12, marginTop: 16, marginBottom: 40,
        }}>
          {[
            { step: '01', icon: '⬆️', title: 'Upload CSV', desc: 'User uploads a cleaned training dataset with location, rooms, balconies, road access, and rent.' },
            { step: '02', icon: '🔧', title: 'Preprocess', desc: 'Python encodes categorical features (location, road) via OneHotEncoder and passes numerical features through.' },
            { step: '03', icon: '🎓', title: 'Train Models', desc: 'Three regression models train on 80% of the data: Linear Regression, Random Forest, and Gradient Boosting.' },
            { step: '04', icon: '📊', title: 'Evaluate', desc: 'Each model is evaluated on the held-out 20% test set using MAE, RMSE, and R² metrics.' },
            { step: '05', icon: '🏆', title: 'Best Model', desc: 'The model with the highest R² score is selected as the best predictor and saved to disk.' },
            { step: '06', icon: '৳', title: 'Predict', desc: 'User enters property details. Python loads the saved model and returns a predicted monthly rent.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{
              background: '#FAFBFD',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14, padding: '1.1rem',
              position: 'relative', overflow: 'hidden',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = '#CBD5E1'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = '#E2E8F0'
              }}
            >
              <div style={{
                position: 'absolute', top: 10, right: 12,
                fontSize: '0.65rem', fontWeight: 800,
                color: '#CBD5E1', letterSpacing: '0.05em',
              }}>{step}</div>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <SectionHeading icon="🛠️" title="Technology Stack" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16, marginTop: 16, marginBottom: 40,
        }}>
          <TechCard
            color="#3B82F6"
            title="Frontend"
            icon="⚛️"
            items={[
              { name: 'React.js', desc: 'Component-based UI framework' },
              { name: 'Vite', desc: 'Fast build tool & dev server' },
              { name: 'Tailwind CSS v4', desc: 'Utility-first styling system' },
              { name: 'Axios', desc: 'HTTP client for API calls' },
              { name: 'Recharts', desc: 'Model performance bar charts' },
            ]}
          />
          <TechCard
            color="#16A34A"
            title="Backend"
            icon="🐍"
            items={[
              { name: 'Python', desc: 'Core language for ML logic' },
              { name: 'FastAPI', desc: 'REST API with auto validation' },
              { name: 'Uvicorn', desc: 'ASGI server with hot reload' },
              { name: 'Pandas', desc: 'CSV reading & data manipulation' },
              { name: 'Joblib', desc: 'Saving & loading trained models' },
            ]}
          />
          <TechCard
            color="#8B5CF6"
            title="Machine Learning"
            icon="🤖"
            items={[
              { name: 'scikit-learn', desc: 'ML model training & evaluation' },
              { name: 'LinearRegression', desc: 'Baseline model' },
              { name: 'RandomForestRegressor', desc: 'Primary prediction model' },
              { name: 'GradientBoostingRegressor', desc: 'Sequential boosting model' },
              { name: 'OneHotEncoder', desc: 'Categorical feature encoding' },
            ]}
          />
        </div>

        {/* ML Models explained */}
        <SectionHeading icon="🤖" title="Machine Learning Models" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16, marginBottom: 40 }}>
          {[
            {
              name: 'Linear Regression',
              tag: 'Baseline',
              tagColor: '#94A3B8',
              color: '#94A3B8',
              desc: 'The simplest model. Fits a straight line through the data to find a linear relationship between property features and rent. Used as a reference point to see how much better the advanced models perform.',
              pros: ['Fast to train', 'Easy to interpret', 'Good baseline reference'],
            },
            {
              name: 'Random Forest',
              tag: '★ Primary Model',
              tagColor: '#16A34A',
              color: '#16A34A',
              desc: 'Builds hundreds of decision trees and averages their predictions. Handles nonlinear relationships well — a house with one extra room in Gulshan adds far more rent than the same room in Badda. The selected best model for prediction.',
              pros: ['Handles nonlinear patterns', 'Robust to outliers', 'Typically highest R² score'],
            },
            {
              name: 'Gradient Boosting',
              tag: 'Comparison',
              tagColor: '#3B82F6',
              color: '#3B82F6',
              desc: 'Builds trees sequentially — each tree corrects the errors of the previous one. Often achieves high accuracy but trains slower than Random Forest. Used for comparison to show which approach works best on the uploaded dataset.',
              pros: ['Sequential error correction', 'High accuracy potential', 'Strong on structured data'],
            },
          ].map(({ name, tag, tagColor, color, desc, pros }) => (
            <div key={name} style={{
              display: 'flex', gap: 20,
              background: '#FAFBFD',
              border: `1.5px solid ${color}22`,
              borderLeft: `4px solid ${color}`,
              borderRadius: 14, padding: '1.4rem',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>{name}</span>
                  <span style={{
                    background: `${tagColor}15`, border: `1px solid ${tagColor}30`,
                    borderRadius: 20, padding: '2px 10px',
                    fontSize: '0.7rem', fontWeight: 700, color: tagColor,
                  }}>{tag}</span>
                </div>
                <p style={{ fontSize: '0.83rem', color: '#475569', lineHeight: 1.75, marginBottom: 12 }}>{desc}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {pros.map(p => (
                    <span key={p} style={{
                      background: `${color}08`, border: `1px solid ${color}20`,
                      borderRadius: 20, padding: '3px 10px',
                      fontSize: '0.73rem', fontWeight: 600, color,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Evaluation Metrics */}
        <SectionHeading icon="📏" title="Evaluation Metrics Explained" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14, marginTop: 16, marginBottom: 40,
        }}>
          {[
            {
              name: 'R² Score',
              icon: '🎯',
              color: '#16A34A',
              short: 'Higher = Better',
              desc: 'Measures how well the model explains variation in rent. An R² of 0.89 means the model explains 89% of rent differences. The closer to 1.0, the better.',
            },
            {
              name: 'MAE',
              icon: '📉',
              color: '#F59E0B',
              short: 'Lower = Better',
              desc: 'Mean Absolute Error — the average amount by which predictions differ from actual rent. An MAE of ৳3,200 means predictions are off by roughly ৳3,200 on average.',
            },
            {
              name: 'RMSE',
              icon: '📐',
              color: '#EF4444',
              short: 'Lower = Better',
              desc: 'Root Mean Squared Error — similar to MAE but penalises larger errors more heavily. Useful for detecting when the model occasionally makes very large mistakes.',
            },
          ].map(({ name, icon, color, short, desc }) => (
            <div key={name} style={{
              background: '#FAFBFD',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14, padding: '1.3rem',
              borderTop: `3px solid ${color}`,
            }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>{name}</div>
              <div style={{
                display: 'inline-block', marginTop: 4, marginBottom: 10,
                background: `${color}12`, border: `1px solid ${color}25`,
                borderRadius: 20, padding: '2px 10px',
                fontSize: '0.7rem', fontWeight: 700, color,
              }}>{short}</div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Key Design Decisions */}
        <SectionHeading icon="💡" title="Key Design Decisions" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, marginBottom: 40 }}>
          {[
            { q: 'Why save preprocessing.pkl separately?', a: 'The OneHotEncoder must be the exact same object fitted on training data. During prediction, the same encoder is loaded — ensuring locations and road values are encoded identically to how they were during training. Without this, predictions would be wrong.' },
            { q: 'Why 80/20 train-test split?', a: 'Training and evaluating on the same data gives artificially inflated scores. The 20% test set is data the models have never seen, giving a realistic picture of how well each model will perform on new property inputs.' },
            { q: 'Why three models instead of one?', a: 'Different datasets respond differently to different algorithms. By training all three and comparing, the system automatically picks the best performer for the specific dataset uploaded — rather than assuming one algorithm is always best.' },
            { q: 'Why React + FastAPI instead of one full-stack framework?', a: 'Machine learning libraries (scikit-learn, pandas, numpy) are Python-only. FastAPI provides a clean REST boundary that keeps ML logic in Python while React handles all UI state, animations, and user interaction.' },
          ].map(({ q, a }) => (
            <div key={q} style={{
              background: '#FAFBFD',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14, padding: '1.2rem 1.4rem',
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  color: '#6366F1', fontWeight: 800, fontSize: '0.72rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2,
                }}>Q</span>
                <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>{q}</p>
              </div>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10,
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(22,163,74,0.1)',
                  border: '1px solid rgba(22,163,74,0.2)',
                  color: '#16A34A', fontWeight: 800, fontSize: '0.72rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2,
                }}>A</span>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.75 }}>{a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer strip */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          borderRadius: 16, padding: '1.5rem 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: 4 }}>HomeRent AI</p>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              React · FastAPI · scikit-learn · Tailwind CSS v4
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Full-Stack', 'Machine Learning', 'REST API', 'Responsive'].map(tag => (
              <span key={tag} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '4px 12px',
                fontSize: '0.73rem', fontWeight: 600, color: '#94A3B8',
              }}>{tag}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

/* ── Helper sub-components ── */
function SectionHeading({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <h3 style={{
        fontWeight: 800, fontSize: '1rem', color: '#0F172A',
        letterSpacing: '-0.01em',
      }}>{title}</h3>
      <div style={{ flex: 1, height: 1, background: '#E2E8F0', marginLeft: 8 }} />
    </div>
  )
}

function TechCard({ color, title, icon, items }) {
  return (
    <div style={{
      border: `1.5px solid ${color}20`,
      borderTop: `3px solid ${color}`,
      borderRadius: 14, padding: '1.3rem',
      background: '#FAFBFD',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(({ name, desc }) => (
          <div key={name} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: color, flexShrink: 0, marginTop: 5,
            }} />
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155' }}>{name}</span>
              <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}> — {desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
