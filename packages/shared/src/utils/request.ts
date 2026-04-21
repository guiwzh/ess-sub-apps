import axios, { type InternalAxiosRequestConfig } from 'axios'
import { BUS_EVENTS } from '../constants/bus-events.ts'
import { useUserStore } from '../store/userStore.ts'
import { emitTokenExpired, onBusEvent } from '../wujie/bus.ts'

const request = axios.create({
  baseURL: (window.$wujie?.props?.apiBaseUrl as string) || '/api',
  timeout: 15000,
})

// ---------- Token 刷新等待机制 ----------
const REFRESH_TIMEOUT = 10_000

let isWaitingForRefresh = false
let pendingRequests: Array<{
  resolve: (token: string) => void
  reject: (err: Error) => void
}> = []
let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null

function clearRefreshState() {
  isWaitingForRefresh = false
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
    refreshTimeoutId = null
  }
}

function flushResolve(token: string) {
  const queue = pendingRequests
  pendingRequests = []
  clearRefreshState()
  queue.forEach(({ resolve }) => resolve(token))
}

function flushReject(err: Error) {
  const queue = pendingRequests
  pendingRequests = []
  clearRefreshState()
  queue.forEach(({ reject }) => reject(err))
}

// 无条件订阅（独立模式下也订阅，不会触发，但保证 wujie 环境绝对不漏订阅）
onBusEvent(BUS_EVENTS.TOKEN_REFRESH, (...args: unknown[]) => {
  const token = args[0] as string
  useUserStore.getState().setToken(token)
  flushResolve(token)
})

onBusEvent(BUS_EVENTS.TOKEN_REFRESH_FAILED, () => {
  flushReject(new Error('Token refresh failed'))
})

function waitForNewToken(): Promise<string> {
  // 独立模式无 bus 通道 → 直接跳登录，避免永久挂起
  if (!window.__POWERED_BY_WUJIE__) {
    window.location.href = '/login'
    return Promise.reject(new Error('Standalone mode: re-login required'))
  }

  if (!isWaitingForRefresh) {
    isWaitingForRefresh = true
    emitTokenExpired()
    // 超时兜底：主应用若因异常未广播 TOKEN_REFRESH(_FAILED)，避免队列永久 pending
    refreshTimeoutId = setTimeout(() => {
      flushReject(new Error('Token refresh timeout'))
    }, REFRESH_TIMEOUT)
  }
  return new Promise((resolve, reject) => {
    pendingRequests.push({ resolve, reject })
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
