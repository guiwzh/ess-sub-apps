import { useEffect } from 'react'
import { BUS_EVENTS } from '@/constants/bus-events'
import { onBusEvent } from './bus'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { router } from '@/router'
import i18n from '@/i18n'

/**
 * wujie 桥接 hook — 监听主应用 bus 事件，同步到子应用 store
 * 在 App.tsx 中统一调用
 */
export function useWujieBridge() {
  useEffect(() => {
    if (!window.__POWERED_BY_WUJIE__) return

    // 首次挂载时，从主应用 props 中读取初始路径并导航（解决刷新时路由丢失问题）
    const wujieContext = (window as any).$wujie
    const initialPath = wujieContext?.props?.initialPath as string | undefined
    if (initialPath) {
      router.navigate(initialPath)
    }

    const offs = [
      // 语言切换
      onBusEvent(BUS_EVENTS.LOCALE_CHANGE, (locale) => {
        useAppStore.getState().setLocale(locale as string)
        i18n.changeLanguage(locale as string)
      }),
      // 主题切换
      onBusEvent(BUS_EVENTS.THEME_CHANGE, (theme) => {
        useAppStore.getState().setTheme(theme as string)
      }),
      // 站点切换
      onBusEvent(BUS_EVENTS.STATION_CHANGE, (station) => {
        useAppStore.getState().setCurrentStation(station as string)
      }),
      // token 刷新
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
