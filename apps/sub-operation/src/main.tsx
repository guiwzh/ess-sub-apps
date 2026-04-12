import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// wujie 子应用生命周期
declare global {
  interface Window {
    __POWERED_BY_WUJIE__?: boolean
    __WUJIE?: {
      props: Record<string, unknown>
      id: string
    }
    __WUJIE_MOUNT: () => void
    __WUJIE_UNMOUNT: () => void
  }
}

let root: ReactDOM.Root | null = null

function mount() {
  const container = document.getElementById('root')!
  root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

function unmount() {
  root?.unmount()
  root = null
}

if (window.__POWERED_BY_WUJIE__) {
  // wujie 子应用模式：由主应用控制挂载和卸载
  window.__WUJIE_MOUNT = mount
  window.__WUJIE_UNMOUNT = unmount
} else {
  // 独立运行模式
  mount()
}
