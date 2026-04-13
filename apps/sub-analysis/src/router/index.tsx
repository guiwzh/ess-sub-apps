import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'

const DevLogin = lazy(() => import('@/pages/DevLogin'))
const EnergyOverview = lazy(() => import('@/pages/Merged/EnergyOverview'))
const OperationAnalysis = lazy(() => import('@/pages/Merged/OperationAnalysis'))
const ReportCenter = lazy(() => import('@/pages/Merged/ReportCenter'))

const isWujie = !!window.__POWERED_BY_WUJIE__

function InitialRedirect() {
  return <Navigate to="/energy-stats" replace />
}

const commonRoutes = [
  { path: '/energy-stats', element: <EnergyOverview /> },
  { path: '/operation-analysis', element: <OperationAnalysis /> },
  { path: '/report', element: <ReportCenter /> },
]

export function createRouter() {
  return createBrowserRouter(
    isWujie
      ? [{ path: '/', element: <InitialRedirect /> }, ...commonRoutes]
      : [
          { path: '/login', element: <DevLogin /> },
          { path: '/', element: <Navigate to="/energy-stats" replace /> },
          ...commonRoutes,
        ],
  )
}
