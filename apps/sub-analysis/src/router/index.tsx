import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'

const DevLogin = lazy(() => import('@/pages/DevLogin'))
const EnergyOverview = lazy(() => import('@/pages/Merged/EnergyOverview'))
const OperationAnalysis = lazy(() => import('@/pages/Merged/OperationAnalysis'))
const ReportCenter = lazy(() => import('@/pages/Merged/ReportCenter'))

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

export const router = createBrowserRouter(
  isWujie
    ? [
        { path: '/', element: <Navigate to="/energy-stats" replace /> },
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
        { path: '/', element: <Navigate to="/energy-stats" replace /> },
        ...commonRoutes,
      ],
)
