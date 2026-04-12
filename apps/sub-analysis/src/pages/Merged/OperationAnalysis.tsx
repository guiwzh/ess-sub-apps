import { Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Revenue from '../Revenue'
import BatteryHealth from '../BatteryHealth'

export default function OperationAnalysis() {
  const [activeKey, setActiveKey] = useState('revenue')
  const { t } = useTranslation()

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'revenue', label: t('tab.revenue'), children: <Revenue /> },
          { key: 'battery', label: t('tab.batteryHealth'), children: <BatteryHealth /> },
        ]}
      />
    </div>
  )
}
