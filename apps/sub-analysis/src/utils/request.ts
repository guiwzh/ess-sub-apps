import axios from 'axios'
import { useUserStore } from '@/store/userStore'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

request.interceptors.request.use((config) => {
  const token = useUserStore.getState().token ?? localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.__POWERED_BY_WUJIE__) {
        import('@/wujie/bus').then(({ emitTokenExpired }) => emitTokenExpired())
      } else {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default request
