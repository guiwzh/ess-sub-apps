import { Tabs } from 'antd'
import { useState } from 'react'
import Revenue from '../Revenue'
import BatteryHealth from '../BatteryHealth'

export default function OperationAnalysis() {
  const [activeKey, setActiveKey] = useState('revenue')

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'revenue', label: '收益分析', children: <Revenue /> },
          { key: 'battery', label: '电池健康度', children: <BatteryHealth /> },
        ]}
      />
    </div>
  )
}
