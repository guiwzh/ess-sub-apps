import { BUS_EVENTS } from '@/constants/bus-events'
import { useUserStore } from '@/store/userStore'
import { emitTokenExpired, onBusEvent } from '@/wujie/bus'
import axios, { type InternalAxiosRequestConfig } from 'axios'

const request = axios.create({
  baseURL: (window.$wujie?.props?.apiBaseUrl as string) || '/api',
  timeout: 15000,
})

// ---------- Token 刷新等待机制 ----------
let isWaitingForRefresh = false
let pendingRequests: Array<(token: string) => void> = []

// 监听主应用广播的 token-refresh 事件，更新本地 store 并释放排队请求
if (window.$wujie) {
  onBusEvent(BUS_EVENTS.TOKEN_REFRESH, (...args: unknown[]) => {
    const token = args[0] as string
    useUserStore.getState().setToken(token)
    isWaitingForRefresh = false
    pendingRequests.forEach((cb) => cb(token))
    pendingRequests = []
  })
}

function waitForNewToken(): Promise<string> {
  if (!isWaitingForRefresh) {
    isWaitingForRefresh = true
    emitTokenExpired()
  }
  return new Promise((resolve) => {
    pendingRequests.push(resolve)
  })
}

// ---------- 请求拦截器 ----------
request.interceptors.request.use((config) => {
  const token = useUserStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------- 响应拦截器 ----------
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 401: 通知主应用刷新 → 等待新 token → 重放请求
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await waitForNewToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return request(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default request
