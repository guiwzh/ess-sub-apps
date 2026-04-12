import { ProTable, type ProColumns } from '@ant-design/pro-components'
import { Tag, Button, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { getAlarms, type AlarmItem } from '@/api/operation'

export default function AlarmRealtime() {
  const { t } = useTranslation()

  const levelMap: Record<string, { text: string; color: string }> = {
    critical: { text: t('alarm.level.critical'), color: 'red' },
    warning: { text: t('alarm.level.warning'), color: 'orange' },
    info: { text: t('alarm.level.info'), color: 'blue' },
  }

  const columns: ProColumns<AlarmItem>[] = [
    { title: t('alarm.content'), dataIndex: 'message', ellipsis: true },
    { title: t('alarm.deviceCode'), dataIndex: 'deviceCode', width: 110 },
    {
      title: t('alarm.level'),
      dataIndex: 'level',
      width: 80,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: t('alarm.level.critical'), value: 'critical' },
          { label: t('alarm.level.warning'), value: 'warning' },
          { label: t('alarm.level.info'), value: 'info' },
        ],
      },
      render: (_, record) => {
        const l = levelMap[record.level]
        return l ? <Tag color={l.color}>{l.text}</Tag> : record.level
      },
    },
    { title: t('alarm.time'), dataIndex: 'time', width: 170, search: false },
    {
      title: t('alarm.status'),
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: t('alarm.status.active'), value: 'active' },
          { label: t('alarm.status.resolved'), value: 'resolved' },
        ],
      },
      render: (_, record) =>
        record.status === 'active' ? <Tag color="red">{t('alarm.status.active')}</Tag> : <Tag color="green">{t('alarm.status.resolved')}</Tag>,
    },
    {
      title: t('operation'),
      width: 120,
      search: false,
      render: (_, record) =>
        record.status === 'active' ? (
          <>
            <Button type="link" size="small" onClick={() => message.success(t('alarm.confirm'))}>
              {t('alarm.confirm')}
            </Button>
            <Button type="link" size="small" onClick={() => message.success(t('alarm.clear'))}>
              {t('alarm.clear')}
            </Button>
          </>
        ) : (
          '-'
        ),
    },
  ]

  return (
    <div>
      <ProTable<AlarmItem>
        headerTitle={t('alarm.realtime')}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const { data: res } = await getAlarms({
            current: params.current,
            pageSize: params.pageSize,
            level: params.level,
            status: params.status,
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
