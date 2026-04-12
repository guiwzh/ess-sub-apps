import { ProTable, type ProColumns } from '@ant-design/pro-components'
import { Tag, Button, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { getHistoryAlarms, type HistoryAlarmItem } from '@/api/operation'

export default function AlarmHistory() {
  const { t } = useTranslation()

  const levelMap: Record<string, { text: string; color: string }> = {
    critical: { text: t('alarm.level.critical'), color: 'red' },
    warning: { text: t('alarm.level.warning'), color: 'orange' },
    info: { text: t('alarm.level.info'), color: 'blue' },
  }

  const columns: ProColumns<HistoryAlarmItem>[] = [
    { title: t('alarm.content'), dataIndex: 'message', ellipsis: true },
    { title: t('alarm.deviceCode'), dataIndex: 'deviceCode', width: 110, search: false },
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
    {
      title: t('alarm.station'),
      dataIndex: 'station',
      width: 120,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: t('station.a'), value: '储能站点A' },
          { label: t('station.b'), value: '储能站点B' },
          { label: t('station.c'), value: '储能站点C' },
        ],
      },
    },
    { title: t('alarm.alarmTime'), dataIndex: 'time', width: 170, search: false },
    { title: t('alarm.resolvedTime'), dataIndex: 'resolvedTime', width: 170, search: false },
  ]

  const handleExport = () => {
    message.success(t('export') + ' (Mock)')
  }

  return (
    <div>
      <ProTable<HistoryAlarmItem>
        headerTitle={t('alarm.history')}
        rowKey="id"
        columns={columns}
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
