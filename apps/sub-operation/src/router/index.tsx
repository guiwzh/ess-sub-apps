import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'

const DevLogin = lazy(() => import('@/pages/DevLogin'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const DeviceManagement = lazy(() => import('@/pages/Device/Management'))
const DeviceDetail = lazy(() => import('@/pages/Device/Detail'))
const AlarmManagement = lazy(() => import('@/pages/Alarm/Management'))
const WorkOrderManagement = lazy(() => import('@/pages/WorkOrder/Management'))
const WorkOrderCreate = lazy(() => import('@/pages/WorkOrder/Create'))
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
    path: '/work-orders/create',
    element: (
      <LazyLoad>
        <WorkOrderCreate />
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
