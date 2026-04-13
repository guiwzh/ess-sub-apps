import { emitNavigate } from './bus'

/**
 * 应用级导航：在 wujie 模式下通知主应用跳转（地址栏同步），独立运行时直接跳转。
 * @param path 子应用内部路径，如 `/alarms?deviceCode=xxx`
 */
export function appNavigate(path: string) {
  if (window.__POWERED_BY_WUJIE__) {
    const basePath = ((window as any).$wujie?.props?.basePath as string) || ''
    emitNavigate(basePath + path)
  } else {
    window.location.href = path
  }
}
