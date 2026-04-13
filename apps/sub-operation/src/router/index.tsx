import { lazy } from 'react'

const DeviceManagement = lazy(() => import('@/pages/Device/Management'))
const DeviceDetail = lazy(() => import('@/pages/Device/Detail'))
const AlarmManagement = lazy(() => import('@/pages/Alarm/Management'))
const WorkOrderManagement = lazy(() => import('@/pages/WorkOrder/Management'))
const WorkOrderDetail = lazy(() => import('@/pages/WorkOrder/Detail'))

const routes = [
  { path: '/devices', element: <DeviceManagement /> },
  { path: '/devices/:id', element: <DeviceDetail /> },
  { path: '/alarms', element: <AlarmManagement /> },
  { path: '/work-orders', element: <WorkOrderManagement /> },
  { path: '/work-orders/:id', element: <WorkOrderDetail /> },
]

export { routes }
