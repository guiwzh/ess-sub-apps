import { BUS_EVENTS } from '@/constants/bus-events'

/** 获取 wujie bus 实例（仅在 wujie 模式下可用） */
function getBus() {
  // wujie 注入的 bus 在 window.$wujie?.bus
  return (window as unknown as Record<string, unknown>).$wujie
    ? (window as unknown as Record<string, { bus: EventBus }>).$wujie.bus
    : null
}

interface EventBus {
  $on: (event: string, fn: (...args: unknown[]) => void) => void
  $off: (event: string, fn: (...args: unknown[]) => void) => void
  $emit: (event: string, ...args: unknown[]) => void
}

/** 通知主应用 token 过期 */
export function emitTokenExpired() {
  getBus()?.$emit(BUS_EVENTS.TOKEN_EXPIRED)
}

/** 监听主应用事件 */
export function onBusEvent(event: string, handler: (...args: unknown[]) => void) {
  const bus = getBus()
  bus?.$on(event, handler)
  return () => {
    bus?.$off(event, handler)
  }
}
