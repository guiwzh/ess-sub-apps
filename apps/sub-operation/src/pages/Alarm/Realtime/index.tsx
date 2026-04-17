import { clearAlarm, confirmAlarm, getAlarms, type AlarmItem } from '@/api/operation'
import { ProTable, type ActionType } from '@ant-design/pro-components'
import { message } from 'antd'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getColumns } from './config'

const AlarmRealtime = ({ deviceCode }: { deviceCode?: string }) => {
  const { t } = useTranslation()
  const actionRef = useRef<ActionType>(null)

  const handleConfirm = useCallback(
    async (id: string) => {
      try {
        const { data: res } = await confirmAlarm(id)
        if (res.code === 0) {
          message.success(t('alarm.confirmSuccess'))
          actionRef.current?.reload()
        }
      } catch {
        message.error(t('alarm.operationFailed'))
      }
    },
    [t],
  )

  const handleClear = useCallback(
    async (id: string) => {
      try {
        const { data: res } = await clearAlarm(id)
        if (res.code === 0) {
          message.success(t('alarm.clearSuccess'))
          actionRef.current?.reload()
        }
      } catch {
        message.error(t('alarm.operationFailed'))
      }
    },
    [t],
  )

  // eslint-disable-next-line react-hooks/refs
  const columns = getColumns(t, { onConfirm: handleConfirm, onClear: handleClear })

  return (
    <div>
      <ProTable<AlarmItem>
        headerTitle={t('alarm.realtime')}
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        params={{ deviceCode }}
        request={async (params) => {
          try {
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
          } catch {
            message.error(t('fetchFailed'))
            return { data: [], total: 0, success: false }
          }
        }}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
      />
    </div>
  )
}

export default AlarmRealtime
