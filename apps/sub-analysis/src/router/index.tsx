import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'

const DevLogin = lazy(() => import('@/pages/DevLogin'))
const EnergyStats = lazy(() => import('@/pages/EnergyStats'))
const Efficiency = lazy(() => import('@/pages/Efficiency'))
const Revenue = lazy(() => import('@/pages/Revenue'))
const BatteryHealth = lazy(() => import('@/pages/BatteryHealth'))
const ReportDaily = lazy(() => import('@/pages/Report/Daily'))
const ReportCustom = lazy(() => import('@/pages/Report/Custom'))

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
        <EnergyStats />
      </LazyLoad>
    ),
  },
  {
    path: '/efficiency',
    element: (
      <LazyLoad>
        <Efficiency />
      </LazyLoad>
    ),
  },
  {
    path: '/revenue',
    element: (
      <LazyLoad>
        <Revenue />
      </LazyLoad>
    ),
  },
  {
    path: '/battery-health',
    element: (
      <LazyLoad>
        <BatteryHealth />
      </LazyLoad>
    ),
  },
  {
    path: '/report',
    element: (
      <LazyLoad>
        <ReportDaily />
      </LazyLoad>
    ),
  },
  {
    path: '/report/custom',
    element: (
      <LazyLoad>
        <ReportCustom />
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
