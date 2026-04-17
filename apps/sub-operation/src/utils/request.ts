import { useUserStore } from '@/store/userStore'
import axios from 'axios'

const request = axios.create({
  baseURL: (window.$wujie?.props?.apiBaseUrl as string) || '/api',
  timeout: 15000,
})

request.interceptors.request.use((config) => {
  const token = useUserStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      import('@/wujie/bus').then(({ emitTokenExpired }) => emitTokenExpired())
    }
    return Promise.reject(error)
  },
)

export default request
