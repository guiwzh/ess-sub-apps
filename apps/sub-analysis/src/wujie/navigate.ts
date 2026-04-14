interface NavigateOptions {
  state?: Record<string, unknown>
}

type WujieProps = {
  basePath?: string
  navigate?: (path: string, options?: NavigateOptions) => void
}

function getWujieProps(): WujieProps | undefined {
  return (window as unknown as Record<string, { props?: WujieProps }>).$wujie?.props
}

/**
 * 应用级导航：在 wujie 模式下调用主应用注入的 navigate 函数（地址栏同步），独立运行时直接跳转。
 * @param path 子应用内部路径，如 `/some-page?param=xxx`
 * @param options 可选配置，如 `{ state: { id: '123' } }`
 */
export function appNavigate(path: string, options?: NavigateOptions) {
  if (window.__POWERED_BY_WUJIE__) {
    const props = getWujieProps()
    const basePath = props?.basePath || ''
    props?.navigate?.(basePath + path, options)
  } else {
    window.location.href = path
  }
}

/**
 * 获取主应用当前路由的 history state（通过 window.parent 同域通信）。
 * 仅在 wujie 环境下有效，独立运行时返回 undefined。
 */
export function getMainState<T = Record<string, unknown>>(): T | undefined {
  if (!window.__POWERED_BY_WUJIE__) return undefined
  try {
    return window.parent.history.state?.usr as T | undefined
  } catch {
    return undefined
  }
}
