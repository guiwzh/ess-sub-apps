import ReactDOM from 'react-dom/client'
import App from './App'

// wujie 子应用生命周期
declare global {
  interface Window {
    __POWERED_BY_WUJIE__?: boolean
    __WUJIE?: {
      id: string
      mount: () => void
      provide: {
        props: Record<string, unknown>
        bus: unknown
        location: unknown
      }
    }
    $wujie?: {
      props: Record<string, unknown>
      bus: unknown
      location: unknown
    }
    __WUJIE_MOUNT: () => void
    __WUJIE_UNMOUNT: () => void
  }
}

let root: ReactDOM.Root | null = null

function mount() {
  // 防重入：wujie alive/切换场景下可能重复回调 __WUJIE_MOUNT，避免 createRoot 触发
  // "You are calling ReactDOMClient.createRoot() on a container that has already been passed" 警告
  if (root) {
    root.render(<App />)
    return
  }
  const container = document.getElementById('root')!
  root = ReactDOM.createRoot(container)
  root.render(<App />)
}

function unmount() {
  if (!root) return
  root.unmount()
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
