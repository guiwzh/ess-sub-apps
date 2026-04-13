import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'

const DevLogin = lazy(() => import('@/pages/DevLogin'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const DeviceManagement = lazy(() => import('@/pages/Device/Management'))
const DeviceDetail = lazy(() => import('@/pages/Device/Detail'))
const AlarmManagement = lazy(() => import('@/pages/Alarm/Management'))
const WorkOrderManagement = lazy(() => import('@/pages/WorkOrder/Management'))
const WorkOrderDetail = lazy(() => import('@/pages/WorkOrder/Detail'))

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
        <DeviceManagement />
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
        <AlarmManagement />
      </LazyLoad>
    ),
  },
  {
    path: '/work-orders',
    element: (
      <LazyLoad>
        <WorkOrderManagement />
      </LazyLoad>
    ),
  },
  {
    path: '/work-orders/:id',
    element: (
      <LazyLoad>
        <WorkOrderDetail />
      </LazyLoad>
    ),
  },
]

function InitialRedirect() {
  return <Navigate to="/dashboard" replace />
}

export function createRouter() {
  return createBrowserRouter(
    isWujie
      ? [
          { path: '/', element: <InitialRedirect /> },
          ...commonRoutes,
          // 兜底路由：避免 wujie 加载过程中短暂出现 404
          { path: '*', element: <InitialRedirect /> },
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
}
