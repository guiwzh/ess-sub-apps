import { Tabs } from 'antd'
import { useState } from 'react'
import WorkOrderList from './List'
import Inspection from './Inspection'

export default function WorkOrderManagement() {
  const [activeKey, setActiveKey] = useState('list')

  return (
    <div style={{ padding: 24 }}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'list', label: '工单列表', children: <WorkOrderList /> },
          { key: 'inspection', label: '巡检计划', children: <Inspection /> },
        ]}
      />
    </div>
  )
}
