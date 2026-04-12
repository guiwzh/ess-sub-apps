import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'

const DevLogin = lazy(() => import('@/pages/DevLogin'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const DeviceIndex = lazy(() => import('@/pages/Device/index'))
const DeviceCategory = lazy(() => import('@/pages/Device/Category'))
const DeviceDetail = lazy(() => import('@/pages/Device/Detail'))
const AlarmRealtime = lazy(() => import('@/pages/Alarm/Realtime'))

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

const commonRoutes = [
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
        <DeviceIndex />
      </LazyLoad>
    ),
  },
  {
    path: '/devices/category',
    element: (
      <LazyLoad>
        <DeviceCategory />
      </LazyLoad>
    ),
  },
  {
    path: '/devices/:id',
    element: (
      <LazyLoad>
        <DeviceDetail />
      </LazyLoad>
    ),
  },
  {
    path: '/alarms',
    element: (
      <LazyLoad>
        <AlarmRealtime />
      </LazyLoad>
    ),
  },
]

export const router = createBrowserRouter(
  isWujie
    ? [
        { path: '/', element: <Navigate to="/dashboard" replace /> },
        ...commonRoutes,
      ]
    : [
        {
          path: '/login',
          element: (
            <LazyLoad>
              <DevLogin />
            </LazyLoad>
          ),
        },
        { path: '/', element: <Navigate to="/dashboard" replace /> },
        ...commonRoutes,
      ],
)
