import { create } from 'zustand'

interface AppState {
  theme: string
  locale: string
  currentStation: string | null
  setTheme: (theme: string) => void
  setLocale: (locale: string) => void
  setCurrentStation: (station: string | null) => void
}

/** 从主应用 props 读取初始值 */
function getInitFromWujie() {
  const props = window.__WUJIE?.props
  if (!props) return {}
  return {
    theme: (props.theme as string) || 'light',
    locale: (props.locale as string) || 'zh',
    currentStation: (props.currentStation as string) || null,
  }
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  locale: 'zh',
  currentStation: null,
  ...getInitFromWujie(),
  setTheme: (theme) => set({ theme }),
  setLocale: (locale) => set({ locale }),
  setCurrentStation: (station) => set({ currentStation: station }),
}))
