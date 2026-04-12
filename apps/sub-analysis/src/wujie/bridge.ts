import { useEffect } from 'react'
import { BUS_EVENTS } from '@/constants/bus-events'
import { onBusEvent } from './bus'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { router } from '@/router'
import i18n from '@/i18n'

export function useWujieBridge() {
  useEffect(() => {
    if (!window.__POWERED_BY_WUJIE__) return

    // 首次挂载时，从主应用 props 中读取初始路径并导航（解决刷新时路由丢失问题）
    const initialPath = (window as any).$wujie?.props?.initialPath as string | undefined
    if (initialPath) {
      router.navigate(initialPath)
    }

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
      // 主应用路由变更 → 子应用内部导航
      onBusEvent(BUS_EVENTS.ROUTE_CHANGE, (path) => {
        router.navigate(path as string)
      }),
    ]

    return () => {
      offs.forEach((off) => off())
    }
  }, [])
}
