import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import { useAppStore } from '@/store/appStore'
import { useWujieBridge } from '@/wujie/bridge'
import '@/i18n'
import { routes } from './router'

const antdLocaleMap: Record<string, typeof zhCN> = {
  zh: zhCN,
  en: enUS,
}

export default function App() {
  const appTheme = useAppStore((s) => s.theme)
  const locale = useAppStore((s) => s.locale)

  // 监听主应用 bus 事件（wujie 模式下）
  useWujieBridge()

  return (
    <ConfigProvider
      locale={antdLocaleMap[locale] ?? zhCN}
      form={{ colon: false }}
      theme={{
        algorithm: appTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <AntdApp>
        <Suspense fallback={'Loading...'}>
          <RouterProvider router={createBrowserRouter(routes)} />
        </Suspense>
      </AntdApp>
    </ConfigProvider>
  )
}
