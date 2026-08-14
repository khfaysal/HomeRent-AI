import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
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

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await axios.get('/history')
      setHistory(data.history || [])
      setActiveId(data.active_dataset_id || null)

      const activeItem = data.history?.find(i => i.id === data.active_dataset_id || i.is_active)
      if (activeItem) {
        setModelMetrics(activeItem.metrics)
        setBestModel(activeItem.best_model)
        setLocations(activeItem.locations)
        setIsTrained(true)
      } else if (data.history?.length === 0) {
        setIsTrained(false)
        setModelMetrics(null)
        setBestModel(null)
        setLocations([])
        setPrediction(null)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleTrain = async (file) => {
    setTrainError(''); setIsTraining(true)
    setIsTrained(false); setModelMetrics(null); setPrediction(null)

    const fd = new FormData()
    fd.append('file', file)
    try {
      const { data } = await axios.post('/train', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setModelMetrics(data.models)
      setBestModel(data.best_model)
      setLocations(data.locations)
      setIsTrained(true)
      await fetchHistory()
    } catch (err) {
      setTrainError(
        err.response?.data?.detail || 'Unable to train the models. Please check your dataset.'
      )
    } finally {
      setIsTraining(false)
    }
  }

  const handleDeleteHistory = async (datasetId) => {
    try {
      const { data } = await axios.delete(`/history/${datasetId}`)
      setHistory(data.history || [])
      setActiveId(data.active_dataset_id || null)

      const activeItem = data.history?.find(i => i.id === data.active_dataset_id || i.is_active)
      if (activeItem) {
        setModelMetrics(activeItem.metrics)
        setBestModel(activeItem.best_model)
        setLocations(activeItem.locations)
        setIsTrained(true)
      } else {
        setIsTrained(false)
        setModelMetrics(null)
        setBestModel(null)
        setLocations([])
        setPrediction(null)
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete dataset track.')
    }
  }

  const handlePredict = async (form) => {
    setPredictError(''); setIsPredicting(true); setPrediction(null)
    try {
      const { data } = await axios.post('/predict', {
        location: form.location,
        room_count: form.room_count,
        balcony_count: form.balcony_count,
        road_facility: form.road_facility,
      })
      setPrediction(data)

      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setPredictError(
        err.response?.data?.detail || 'Please provide valid property information.'
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

