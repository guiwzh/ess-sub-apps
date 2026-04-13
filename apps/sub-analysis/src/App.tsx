import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { RouterProvider, type createBrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import { ProConfigProvider, zhCNIntl, enUSIntl } from '@ant-design/pro-components'
import type { IntlType } from '@ant-design/pro-components'
import { useAppStore } from '@/store/appStore'
import { useWujieBridge } from '@/wujie/bridge'
import '@/i18n'

type AppRouter = ReturnType<typeof createBrowserRouter>

const antdLocaleMap: Record<string, typeof zhCN> = {
  zh: zhCN,
  en: enUS,
}

const proIntlMap: Record<string, IntlType> = {
  zh: zhCNIntl,
  en: enUSIntl,
}

export default function App({ router }: { router: AppRouter }) {
  const appTheme = useAppStore((s) => s.theme)
  const locale = useAppStore((s) => s.locale)

  useWujieBridge()

  return (
    <ConfigProvider
      locale={antdLocaleMap[locale] ?? zhCN}
      form={{ colon: false }}
      theme={{
        algorithm: appTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <ProConfigProvider intl={proIntlMap[locale] ?? zhCNIntl}>
        <AntdApp>
          <Suspense fallback={'Loading...'}>
            <RouterProvider router={router} />
          </Suspense>
        </AntdApp>
      </ProConfigProvider>
    </ConfigProvider>
  )
}
