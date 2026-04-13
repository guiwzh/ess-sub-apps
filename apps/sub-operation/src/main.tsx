import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createRouter } from '@/router'

// wujie 子应用生命周期
declare global {
  interface Window {
    __POWERED_BY_WUJIE__?: boolean
    __WUJIE?: {
      props: Record<string, unknown>
      id: string
      mount: () => void
    }
    __WUJIE_MOUNT: () => void
    __WUJIE_UNMOUNT: () => void
  }
}

let root: ReactDOM.Root | null = null

function mount() {
  const container = document.getElementById('root')!
  root = ReactDOM.createRoot(container)
  root.render(<App />)
}

function unmount() {
  root?.unmount()
  root = null
}

if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = mount
  window.__WUJIE_UNMOUNT = unmount
  //   Vite 异步加载必须主动调用 mount
  window.__WUJIE?.mount()
} else {
  mount()
}
