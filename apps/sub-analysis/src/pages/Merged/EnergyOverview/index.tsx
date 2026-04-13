import { Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EnergyStats from '../../EnergyStats'
import Efficiency from '../../Efficiency'

export default function EnergyOverview() {
  const [activeKey, setActiveKey] = useState('energy')
  const { t } = useTranslation()

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'energy', label: t('tab.energyStats'), children: <EnergyStats /> },
          { key: 'efficiency', label: t('tab.efficiency'), children: <Efficiency /> },
        ]}
      />
    </div>
  )
}
