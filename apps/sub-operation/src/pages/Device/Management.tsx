import { Tabs } from 'antd'
import { useState } from 'react'
import DeviceIndex from './index'
import DeviceCategory from './Category'

export default function DeviceManagement() {
  const [activeKey, setActiveKey] = useState('list')

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'list', label: '设备列表', children: <DeviceIndex /> },
          { key: 'category', label: '设备分类', children: <DeviceCategory /> },
        ]}
      />
    </div>
  )
}
