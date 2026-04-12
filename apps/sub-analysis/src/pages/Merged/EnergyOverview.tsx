import { Tabs } from 'antd'
import { useState } from 'react'
import EnergyStats from '../EnergyStats'
import Efficiency from '../Efficiency'

export default function EnergyOverview() {
  const [activeKey, setActiveKey] = useState('energy')

  return (
    <div style={{ padding: 24 }}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'energy', label: '充放电统计', children: <EnergyStats /> },
          { key: 'efficiency', label: '能量效率', children: <Efficiency /> },
        ]}
      />
    </div>
  )
}
