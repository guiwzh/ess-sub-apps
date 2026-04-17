import { Card } from 'antd'
import type { CSSProperties, ReactNode } from 'react'

interface ChartCardProps {
  title: string
  children: ReactNode
  style?: CSSProperties
  extra?: ReactNode
}

const ChartCard = ({ title, children, style, extra }: ChartCardProps) => {
  return (
    <Card title={title} extra={extra} style={{ marginBottom: 16, ...style }}>
      {children}
    </Card>
  )
}

export default ChartCard
