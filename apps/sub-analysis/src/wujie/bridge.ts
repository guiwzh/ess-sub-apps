import { useEffect } from 'react'
import { BUS_EVENTS } from '@/constants/bus-events'
import { onBusEvent } from './bus'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import i18n from '@/i18n'

export function useWujieBridge() {
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
