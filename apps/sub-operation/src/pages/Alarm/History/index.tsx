import { ProTable } from '@ant-design/pro-components'
import { Button, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { getHistoryAlarms, type HistoryAlarmItem } from '@/api/operation'
import { getColumns } from './config'

export default function AlarmHistory({ deviceCode }: { deviceCode?: string }) {
  const { t } = useTranslation()
  const columns = getColumns(t)

  const handleExport = () => {
    message.success(t('export') + ' (Mock)')
  }

  return (
    <div>
      <ProTable<HistoryAlarmItem>
        headerTitle={t('alarm.history')}
        rowKey="id"
        columns={columns}
        params={{ deviceCode }}
        toolBarRender={() => [
          <Button key="export" icon={<DownloadOutlined />} onClick={handleExport}>
            {t('export')}
          </Button>,
        ]}
        request={async (params) => {
          const { data: res } = await getHistoryAlarms({
            current: params.current,
            pageSize: params.pageSize,
            level: params.level,
            station: params.station,
            deviceCode: params.deviceCode,
          })
          return {
            data: res.data.list,
            total: res.data.total,
            success: res.code === 0,
          }
        }}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
      />
    </div>
  )
}
