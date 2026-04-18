import NotFound from '@/pages/404'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const EnergyOverview = lazy(() => import('@/pages/Merged/EnergyOverview'))
const OperationAnalysis = lazy(() => import('@/pages/Merged/OperationAnalysis'))
const ReportCenter = lazy(() => import('@/pages/Merged/ReportCenter'))

const commonRoutes = [
  { path: '/energy-stats', element: <EnergyOverview /> },
  { path: '/operation-analysis', element: <OperationAnalysis /> },
  { path: '/report', element: <ReportCenter /> },
]

export const routes = [
  { path: '/', element: <Navigate to="/energy-stats" replace /> },
  ...commonRoutes,
  { path: '*', element: <NotFound /> },
]
