import { useEffect } from 'react'
import { BUS_EVENTS } from '../constants/bus-events.ts'
import { useAppStore } from '../store/appStore.ts'
import { useUserStore } from '../store/userStore.ts'
import { onBusEvent } from './bus.ts'

interface I18nLike {
  changeLanguage: (lng: string) => void
}

/**
 * 创建 wujie 桥接 hook 工厂 — 监听主应用 bus 事件，同步到子应用 store
 * 需要传入子应用自己的 i18n 实例
 */
export function createWujieBridge(i18n: I18nLike) {
  return function useWujieBridge() {
    useEffect(() => {
      if (!window.__POWERED_BY_WUJIE__) return

      const offs = [
        onBusEvent(BUS_EVENTS.LOCALE_CHANGE, (locale) => {
          useAppStore.getState().setLocale(locale as string)
          i18n.changeLanguage(locale as string)
        }),
        onBusEvent(BUS_EVENTS.THEME_CHANGE, (theme) => {
          useAppStore.getState().setTheme(theme as string)
        }),
        onBusEvent(BUS_EVENTS.STATION_CHANGE, (station) => {
          useAppStore.getState().setCurrentStation(station as string)
        }),
        onBusEvent(BUS_EVENTS.TOKEN_REFRESH, (token) => {
          useUserStore.getState().setToken(token as string)
        }),
      ]

      return () => {
        offs.forEach((off) => off())
      }
    }, [])
  }
}
