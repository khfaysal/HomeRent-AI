import axios from 'axios'

// Use environment variable VITE_API_URL in production if set, otherwise fallback to relative path (dev proxy)
const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
})

export const getErrorMessage = (err, fallbackMsg) => {
  if (!err) return fallbackMsg
  if (err.response) {
    const data = err.response.data
    if (data && typeof data.detail === 'string') {
      return data.detail
    }
    if (typeof data === 'string' && data.trim().length > 0 && data.trim().length < 250) {
      return data
    }
    if (err.response.status === 404) {
      return `Backend API endpoint not found (404). Please ensure VITE_API_URL points to your live backend server.`
    }
    if (err.response.status >= 500) {
      return `Backend server error (${err.response.status}). Please check backend server logs.`
    }
  }
  if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
    return `Network Error: Unable to connect to backend server. Please check your backend deployment URL.`
  }
  return err.message || fallbackMsg
}

export default api
