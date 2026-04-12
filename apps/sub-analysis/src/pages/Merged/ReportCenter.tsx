import { Tabs } from 'antd'
import { useState } from 'react'
import ReportDaily from '../Report/Daily'
import ReportCustom from '../Report/Custom'

export default function ReportCenter() {
  const [activeKey, setActiveKey] = useState('daily')

  return (
    <div style={{ padding: 24 }}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'daily', label: '日报月报', children: <ReportDaily /> },
          { key: 'custom', label: '自定义报表', children: <ReportCustom /> },
        ]}
      />
    </div>
  )
}
