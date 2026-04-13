import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const DeviceManagement = lazy(() => import('@/pages/Device/Management'))
const DeviceDetail = lazy(() => import('@/pages/Device/Detail'))
const AlarmManagement = lazy(() => import('@/pages/Alarm/Management'))
const WorkOrderManagement = lazy(() => import('@/pages/WorkOrder/Management'))
const WorkOrderDetail = lazy(() => import('@/pages/WorkOrder/Detail'))

function LazyLoad(props: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{props.children}</Suspense>
}

const commonRoutes = [
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

export function createRouter() {
  return createBrowserRouter(commonRoutes)
}
