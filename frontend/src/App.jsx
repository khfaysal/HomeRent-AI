import { useState, useEffect, useCallback } from 'react'
import api, { getErrorMessage } from './api'
import Header from './components/Header'
import DatasetUpload from './components/DatasetUpload'
import TrainingStatus from './components/TrainingStatus'
import ModelPerformance from './components/ModelPerformance'
import PredictionForm from './components/PredictionForm'
import PredictionResult from './components/PredictionResult'
import DatasetHistory from './components/DatasetHistory'
import ProjectSummary from './components/ProjectSummary'

export default function App() {
  const [isTraining, setIsTraining]       = useState(false)
  const [isTrained, setIsTrained]         = useState(false)
  const [isPredicting, setIsPredicting]   = useState(false)

  const [modelMetrics, setModelMetrics]   = useState(null)
  const [bestModel, setBestModel]         = useState(null)
  const [locations, setLocations]         = useState([])

  const [history, setHistory]             = useState([])
  const [activeDatasetId, setActiveId]    = useState(null)

  const [predictionResult, setPrediction] = useState(null)
  const [trainError, setTrainError]       = useState('')
  const [predictError, setPredictError]   = useState('')

  const saveStateToStorage = (metrics, best, locs, activeIdVal, historyItems) => {
    try {
      localStorage.setItem('homerent_model_state', JSON.stringify({
        metrics, bestModel: best, locations: locs, activeId: activeIdVal, history: historyItems
      }))
    } catch (e) {
      console.error('LocalStorage save error:', e)
    }
  }

  const fetchHistory = useCallback(async () => {
    // 1. Instantly restore from LocalStorage fallback if available
    try {
      const cached = localStorage.getItem('homerent_model_state')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.metrics && parsed.locations) {
          setModelMetrics(parsed.metrics)
          setBestModel(parsed.bestModel)
          setLocations(parsed.locations)
          setIsTrained(true)
          if (parsed.history) setHistory(parsed.history)
          if (parsed.activeId) setActiveId(parsed.activeId)
        }
      }
    } catch (e) {
      console.error('LocalStorage restore error:', e)
    }

    // 2. Fetch live state from Backend History API
    try {
      const { data } = await api.get('/history')
      setHistory(data.history || [])
      setActiveId(data.active_dataset_id || null)

      const activeItem = data.history?.find(i => i.id === data.active_dataset_id || i.is_active)
      if (activeItem) {
        setModelMetrics(activeItem.metrics)
        setBestModel(activeItem.best_model)
        setLocations(activeItem.locations)
        setIsTrained(true)
        saveStateToStorage(activeItem.metrics, activeItem.best_model, activeItem.locations, data.active_dataset_id, data.history)
      } else if (data.history?.length === 0) {
        setIsTrained(false)
        setModelMetrics(null)
        setBestModel(null)
        setLocations([])
        setPrediction(null)
        localStorage.removeItem('homerent_model_state')
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleTrain = async (file, targetModel = 'all') => {
    setTrainError(''); setIsTraining(true)
    setIsTrained(false); setModelMetrics(null); setPrediction(null)

    const fd = new FormData()
    fd.append('file', file)
    if (targetModel) {
      fd.append('target_model', targetModel)
    }
    try {
      const { data } = await api.post('/train', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setModelMetrics(data.models)
      setBestModel(data.best_model)
      setLocations(data.locations)
      setIsTrained(true)
      saveStateToStorage(data.models, data.best_model, data.locations, data.dataset_id, history)
      await fetchHistory()
    } catch (err) {
      setTrainError(
        getErrorMessage(err, 'Unable to train the models. Please check your dataset and backend connection.')
      )
    } finally {
      setIsTraining(false)
    }
  }

  const handleActivateHistory = async (datasetId) => {
    try {
      const { data } = await api.post(`/history/${datasetId}/activate`)
      setHistory(data.history || [])
      setActiveId(data.active_dataset_id || null)

      const activeItem = data.history?.find(i => i.id === data.active_dataset_id || i.is_active)
      if (activeItem) {
        setModelMetrics(activeItem.metrics)
        setBestModel(activeItem.best_model)
        setLocations(activeItem.locations)
        setIsTrained(true)
        saveStateToStorage(activeItem.metrics, activeItem.best_model, activeItem.locations, data.active_dataset_id, data.history)
      }
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to activate dataset model.'))
    }
  }

  const handleDeleteHistory = async (datasetId) => {
    try {
      const { data } = await api.delete(`/history/${datasetId}`)
      setHistory(data.history || [])
      setActiveId(data.active_dataset_id || null)

      const activeItem = data.history?.find(i => i.id === data.active_dataset_id || i.is_active)
      if (activeItem) {
        setModelMetrics(activeItem.metrics)
        setBestModel(activeItem.best_model)
        setLocations(activeItem.locations)
        setIsTrained(true)
        saveStateToStorage(activeItem.metrics, activeItem.best_model, activeItem.locations, data.active_dataset_id, data.history)
      } else {
        setIsTrained(false)
        setModelMetrics(null)
        setBestModel(null)
        setLocations([])
        setPrediction(null)
        localStorage.removeItem('homerent_model_state')
      }
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete dataset track.'))
    }
  }

  const handlePredict = async (form) => {
    setPredictError(''); setIsPredicting(true); setPrediction(null)
    try {
      const { data } = await api.post('/predict', {
        location: form.location,
        room_count: form.room_count,
        balcony_count: form.balcony_count,
        road_facility: form.road_facility,
        selected_model: form.selected_model || 'best',
      })
      setPrediction(data)

      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setPredictError(
        getErrorMessage(err, 'Please provide valid property information.')
      )
    } finally {
      setIsPredicting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />

      <main style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '2.5rem 1.5rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
      }}>

        {/* ── 1. Dataset Upload ── */}
        <DatasetUpload onTrainSuccess={handleTrain} isTraining={isTraining} />

        {trainError && (
          <div className="alert-error animate-fade-in">{trainError}</div>
        )}

        {/* ── 1b. Training Status (during training) ── */}
        {isTraining && <TrainingStatus />}

        {/* ── 2. Model Performance (after training) ── */}
        {isTrained && modelMetrics && (
          <ModelPerformance models={modelMetrics} bestModel={bestModel} />
        )}

        {/* ── 2b. Tracked Trained Datasets ── */}
        <DatasetHistory
          history={history}
          activeId={activeDatasetId}
          onDelete={handleDeleteHistory}
          onActivate={handleActivateHistory}
        />

        {/* ── 3. Predict Your Rent — ALWAYS VISIBLE ── */}
        <PredictionForm
          locations={locations}
          onPredict={handlePredict}
          isPredicting={isPredicting}
          isTrained={isTrained}
        />

        {predictError && (
          <div className="alert-error animate-fade-in">{predictError}</div>
        )}

        {/* ── 4. Prediction Result ── */}
        {predictionResult && (
          <div id="result-section">
            <PredictionResult
              predicted_rent={predictionResult.predicted_rent}
              model={predictionResult.model}
            />
          </div>
        )}
        {/* ── Summary ── */}
        <ProjectSummary />

      </main>
    </div>
  )
}

