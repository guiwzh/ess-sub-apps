import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '../store/userStore.ts'
import { emitTokenExpired } from '../wujie/bus.ts'

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

// 供 bridge 在收到主应用广播时调用：同步 token + 释放等待队列
export function resolveTokenRefresh(token: string) {
  useUserStore.getState().setToken(token)
  flushResolve(token)
}

// 供 bridge 在收到刷新失败广播时调用：reject 等待队列
export function rejectTokenRefresh(err: Error) {
  flushReject(err)
}

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
