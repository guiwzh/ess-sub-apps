import { Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeviceIndex from './index'
import DeviceCategory from './Category'

export default function DeviceManagement() {
  const [activeKey, setActiveKey] = useState('list')
  const { t } = useTranslation()

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'list', label: t('device.list'), children: <DeviceIndex /> },
          { key: 'category', label: t('device.category'), children: <DeviceCategory /> },
        ]}
      />
    </div>
  )
}
