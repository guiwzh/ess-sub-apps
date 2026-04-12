import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'

const DevLogin = lazy(() => import('@/pages/DevLogin'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const DeviceList = lazy(() => import('@/pages/DeviceList'))
const AlarmList = lazy(() => import('@/pages/AlarmList'))

function LazyLoad(props: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        />
      }
    >
      {props.children}
    </Suspense>
  )
}

const isWujie = !!window.__POWERED_BY_WUJIE__

/**
 * wujie 模式：主应用控制路由，子应用只展示页面内容
 * 独立模式：有自己的路由（含 DevLogin）
 */
export const router = createBrowserRouter(
  isWujie
    ? [
        // wujie 模式下由主应用控制路径，子应用直接渲染对应页面
        {
          path: '/',
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: '/dashboard',
          element: (
            <LazyLoad>
              <Dashboard />
            </LazyLoad>
          ),
        },
        {
          path: '/devices',
          element: (
            <LazyLoad>
              <DeviceList />
            </LazyLoad>
          ),
        },
        {
          path: '/alarms',
          element: (
            <LazyLoad>
              <AlarmList />
            </LazyLoad>
          ),
        },
      ]
    : [
        // 独立模式
        {
          path: '/login',
          element: (
            <LazyLoad>
              <DevLogin />
            </LazyLoad>
          ),
        },
        {
          path: '/',
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: '/dashboard',
          element: (
            <LazyLoad>
              <Dashboard />
            </LazyLoad>
          ),
        },
        {
          path: '/devices',
          element: (
            <LazyLoad>
              <DeviceList />
            </LazyLoad>
          ),
        },
        {
          path: '/alarms',
          element: (
            <LazyLoad>
              <AlarmList />
            </LazyLoad>
          ),
        },
      ],
)
