import { Tabs } from 'antd'
import { useState } from 'react'
import AlarmRealtime from './Realtime'
import AlarmHistory from './History'
import AlarmRules from './Rules'

export default function AlarmManagement() {
  const [activeKey, setActiveKey] = useState('realtime')

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'realtime', label: '实时告警', children: <AlarmRealtime /> },
          { key: 'history', label: '历史告警', children: <AlarmHistory /> },
          { key: 'rules', label: '告警规则', children: <AlarmRules /> },
        ]}
      />
    </div>
  )
}
