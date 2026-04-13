import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const DevLogin = lazy(() => import('@/pages/DevLogin'))
const EnergyOverview = lazy(() => import('@/pages/Merged/EnergyOverview'))
const OperationAnalysis = lazy(() => import('@/pages/Merged/OperationAnalysis'))
const ReportCenter = lazy(() => import('@/pages/Merged/ReportCenter'))

function LazyLoad(props: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{props.children}</Suspense>
}

const isWujie = !!window.__POWERED_BY_WUJIE__

function InitialRedirect() {
  return <Navigate to="/energy-stats" replace />
}

const commonRoutes = [
  {
    path: '/energy-stats',
    element: (
      <LazyLoad>
        <EnergyOverview />
      </LazyLoad>
    ),
  },
  {
    path: '/operation-analysis',
    element: (
      <LazyLoad>
        <OperationAnalysis />
      </LazyLoad>
    ),
  },
  {
    path: '/report',
    element: (
      <LazyLoad>
        <ReportCenter />
      </LazyLoad>
    ),
  },
]

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
          { path: '/', element: <Navigate to="/energy-stats" replace /> },
          ...commonRoutes,
        ],
  )
}
