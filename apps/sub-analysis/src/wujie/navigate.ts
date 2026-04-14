/**
 * 应用级导航：在 wujie 模式下调用主应用注入的 navigate 函数（地址栏同步），独立运行时直接跳转。
 * @param path 子应用内部路径，如 `/some-page?param=xxx`
 */
export function appNavigate(path: string) {
  if (window.__POWERED_BY_WUJIE__) {
    const wujie = (window as unknown as Record<string, { props?: Record<string, unknown> }>).$wujie
    const basePath = (wujie?.props?.basePath as string) || ''
    const navigate = wujie?.props?.navigate as ((path: string) => void) | undefined
    navigate?.(basePath + path)
  } else {
    window.location.href = path
  }
}
