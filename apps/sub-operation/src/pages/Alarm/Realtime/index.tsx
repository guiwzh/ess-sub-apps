import { getAlarms, type AlarmItem } from '@/api/operation'
import { ProTable } from '@ant-design/pro-components'
import { useTranslation } from 'react-i18next'
import { getColumns } from './config'

const AlarmRealtime = ({ deviceCode }: { deviceCode?: string }) => {
  const { t } = useTranslation()
  const columns = getColumns(t)

  return (
    <div>
      <ProTable<AlarmItem>
        headerTitle={t('alarm.realtime')}
        rowKey="id"
        columns={columns}
        params={{ deviceCode }}
        request={async (params) => {
          const { data: res } = await getAlarms({
            current: params.current,
            pageSize: params.pageSize,
            level: params.level,
            status: params.status,
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

export default AlarmRealtime
