import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { RouterProvider } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { useWujieBridge } from '@/wujie/bridge'
import { router } from '@/router'
import '@/i18n'

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
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  )
}
