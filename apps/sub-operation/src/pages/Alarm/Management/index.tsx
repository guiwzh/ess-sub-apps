import { getMainState } from '@/wujie/navigate'
import { Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AlarmHistory from '../History'
import AlarmRealtime from '../Realtime'
import AlarmRules from '../Rules'

const AlarmManagement = () => {
  const [activeKey, setActiveKey] = useState('realtime')
  const { t } = useTranslation()
  // const [searchParams] = useSearchParams()
  // const deviceCode = searchParams.get('deviceCode') ?? undefined

  const mainState = getMainState<{ deviceCode?: string }>()
  const deviceCode = mainState?.deviceCode

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: 'realtime',
            label: t('alarm.realtime'),
            children: <AlarmRealtime deviceCode={deviceCode} />,
          },
          {
            key: 'history',
            label: t('alarm.history'),
            children: <AlarmHistory deviceCode={deviceCode} />,
          },
          { key: 'rules', label: t('alarm.rules'), children: <AlarmRules /> },
        ]}
      />
    </div>
  )
}

export default AlarmManagement
