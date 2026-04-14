import { BUS_EVENTS } from '@/constants/bus-events'

function getBus() {
  return (window as unknown as Record<string, unknown>).$wujie
    ? (window as unknown as Record<string, { bus: EventBus }>).$wujie.bus
    : null
}

interface EventBus {
  $on: (event: string, fn: (...args: unknown[]) => void) => void
  $off: (event: string, fn: (...args: unknown[]) => void) => void
  $emit: (event: string, ...args: unknown[]) => void
}

export function emitTokenExpired() {
  getBus()?.$emit(BUS_EVENTS.TOKEN_EXPIRED)
}

export function onBusEvent(event: string, handler: (...args: unknown[]) => void) {
  const bus = getBus()
  bus?.$on(event, handler)
  return () => {
    bus?.$off(event, handler)
  }
}
