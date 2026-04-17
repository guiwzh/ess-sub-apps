import axios from 'axios'
import { useUserStore } from '@/store/userStore'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

/** 请求拦截器：注入 token */
request.interceptors.request.use((config) => {
  // 优先从 store 读取（wujie 模式下由主应用同步），独立模式从 localStorage
  const token = useUserStore.getState().token ?? localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** 响应拦截器 */
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // wujie 模式下通知主应用 token 过期
      if (window.__POWERED_BY_WUJIE__) {
        import('@/wujie/bus').then(({ emitTokenExpired }) => emitTokenExpired())
      } else {
        // 独立模式：清除 token 跳登录
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default request
