import { Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AlarmRealtime from './Realtime'
import AlarmHistory from './History'
import AlarmRules from './Rules'

export default function AlarmManagement() {
  const [activeKey, setActiveKey] = useState('realtime')
  const { t } = useTranslation()

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'realtime', label: t('alarm.realtime'), children: <AlarmRealtime /> },
          { key: 'history', label: t('alarm.history'), children: <AlarmHistory /> },
          { key: 'rules', label: t('alarm.rules'), children: <AlarmRules /> },
        ]}
      />
    </div>
  )
}
