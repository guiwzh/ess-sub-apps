import { Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReportCustom from '../../Report/Custom'
import ReportDaily from '../../Report/Daily'

const ReportCenter = () => {
  const [activeKey, setActiveKey] = useState('daily')
  const { t } = useTranslation()

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: 'daily', label: t('report.dailyMonthly'), children: <ReportDaily /> },
          { key: 'custom', label: t('report.custom'), children: <ReportCustom /> },
        ]}
      />
    </div>
  )
}

export default ReportCenter
