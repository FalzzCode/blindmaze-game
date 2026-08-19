import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wtid_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function getApiMessage(error, fallback = 'Terjadi kesalahan.') {
  const response = error?.response?.data
  if (response?.errors) {
    const firstError = Object.values(response.errors).flat()?.[0]
    if (firstError) return firstError
  }
  return response?.message || error?.message || fallback
}

export default api
