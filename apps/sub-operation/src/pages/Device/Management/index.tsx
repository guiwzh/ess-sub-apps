import { Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DeviceList from '../List'
import DeviceCategory from '../Category'

export default function DeviceManagement() {
  const [activeKey, setActiveKey] = useState('list')
  const { t } = useTranslation()

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'list', label: t('device.list'), children: <DeviceList /> },
          { key: 'category', label: t('device.category'), children: <DeviceCategory /> },
        ]}
      />
    </div>
  )
}
