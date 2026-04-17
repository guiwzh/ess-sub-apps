import { Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Inspection from '../Inspection'
import WorkOrderList from '../List'

const WorkOrderManagement = () => {
  const [activeKey, setActiveKey] = useState('list')
  const { t } = useTranslation()

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'list', label: t('workorder.list'), children: <WorkOrderList /> },
          { key: 'inspection', label: t('inspection.plan'), children: <Inspection /> },
        ]}
      />
    </div>
  )
}

export default WorkOrderManagement
