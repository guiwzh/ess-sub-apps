import { createBrowserRouter, Navigate } from 'react-router-dom'

const isWujie = !!window.__POWERED_BY_WUJIE__

function InitialRedirect() {
  return <Navigate to="/energy-stats" replace />
}

const commonRoutes = [
  {
    path: '/energy-stats',
    lazy: () => import('@/pages/Merged/EnergyOverview').then((m) => ({ Component: m.default })),
  },
  {
    path: '/operation-analysis',
    lazy: () =>
      import('@/pages/Merged/OperationAnalysis').then((m) => ({ Component: m.default })),
  },
  {
    path: '/report',
    lazy: () => import('@/pages/Merged/ReportCenter').then((m) => ({ Component: m.default })),
  },
]

export function createRouter() {
  return createBrowserRouter(
    isWujie
      ? [{ path: '/', element: <InitialRedirect /> }, ...commonRoutes]
      : [
          {
            path: '/login',
            lazy: () => import('@/pages/DevLogin').then((m) => ({ Component: m.default })),
          },
          { path: '/', element: <Navigate to="/energy-stats" replace /> },
          ...commonRoutes,
        ],
  )
}
