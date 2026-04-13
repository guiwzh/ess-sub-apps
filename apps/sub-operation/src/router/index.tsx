import { createBrowserRouter } from 'react-router-dom'

const commonRoutes = [
  {
    path: '/devices',
    lazy: () => import('@/pages/Device/Management').then((m) => ({ Component: m.default })),
  },
  {
    path: '/devices/:id',
    lazy: () => import('@/pages/Device/Detail').then((m) => ({ Component: m.default })),
  },
  {
    path: '/alarms',
    lazy: () => import('@/pages/Alarm/Management').then((m) => ({ Component: m.default })),
  },
  {
    path: '/work-orders',
    lazy: () => import('@/pages/WorkOrder/Management').then((m) => ({ Component: m.default })),
  },
  {
    path: '/work-orders/:id',
    lazy: () => import('@/pages/WorkOrder/Detail').then((m) => ({ Component: m.default })),
  },
]

export function createRouter() {
  return createBrowserRouter(commonRoutes)
}
