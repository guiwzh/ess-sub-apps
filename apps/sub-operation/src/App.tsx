import ErrorBoundary from '@/components/ErrorBoundary'
import '@/i18n'
import { useAppStore } from '@/store/appStore'
import { useWujieBridge } from '@/wujie/bridge'
import type { IntlType } from '@ant-design/pro-components'
import { enUSIntl, ProConfigProvider, zhCNIntl } from '@ant-design/pro-components'
import { App as AntdApp, theme as antdTheme, ConfigProvider, Spin } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { Suspense, useMemo } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './router'

const antdLocaleMap: Record<string, typeof zhCN> = {
  zh: zhCN,
  en: enUS,
}

const proIntlMap: Record<string, IntlType> = {
  zh: zhCNIntl,
  en: enUSIntl,
}

const App = () => {
  const appTheme = useAppStore((s) => s.theme)
  const locale = useAppStore((s) => s.locale)

  // 监听主应用 bus 事件（wujie 模式下）
  useWujieBridge()

  const isWujie = !!window.__POWERED_BY_WUJIE__
  const basename = isWujie ? (window.$wujie?.props?.basePath as string) : undefined
  const fontFamily = window.$wujie?.props?.fontFamily as string
  const router = useMemo(() => createBrowserRouter(routes, { basename }), [basename])

  return (
    <ErrorBoundary>
      <ConfigProvider
        locale={antdLocaleMap[locale] ?? zhCN}
        form={{ colon: false }}
        theme={{
          algorithm: appTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            fontFamily,
          },
        }}
      >
        <ProConfigProvider intl={proIntlMap[locale] ?? zhCNIntl}>
          <AntdApp>
            <Suspense
              fallback={
                <Spin style={{ display: 'flex', justifyContent: 'center', paddingTop: 200 }} />
              }
            >
              <RouterProvider router={router} />
            </Suspense>
          </AntdApp>
        </ProConfigProvider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App
