import { ProTable, type ProColumns } from '@ant-design/pro-components'
import { Tag, Button, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { getHistoryAlarms, type HistoryAlarmItem } from '@/api/operation'

const levelMap: Record<string, { text: string; color: string }> = {
  critical: { text: '紧急', color: 'red' },
  warning: { text: '重要', color: 'orange' },
  info: { text: '一般', color: 'blue' },
}

export default function AlarmHistory() {
  const columns: ProColumns<HistoryAlarmItem>[] = [
    { title: '告警内容', dataIndex: 'message', ellipsis: true },
    { title: '设备编号', dataIndex: 'deviceCode', width: 110, search: false },
    {
      title: '级别',
      dataIndex: 'level',
      width: 80,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '紧急', value: 'critical' },
          { label: '重要', value: 'warning' },
          { label: '一般', value: 'info' },
        ],
      },
      render: (_, record) => {
        const l = levelMap[record.level]
        return l ? <Tag color={l.color}>{l.text}</Tag> : record.level
      },
    },
    {
      title: '站点',
      dataIndex: 'station',
      width: 120,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '储能站点A', value: '储能站点A' },
          { label: '储能站点B', value: '储能站点B' },
          { label: '储能站点C', value: '储能站点C' },
        ],
      },
    },
    { title: '告警时间', dataIndex: 'time', width: 170, search: false },
    { title: '恢复时间', dataIndex: 'resolvedTime', width: 170, search: false },
  ]

  const handleExport = () => {
    message.success('导出功能已触发（Mock）')
  }

  return (
    <div style={{ padding: 24 }}>
      <ProTable<HistoryAlarmItem>
        headerTitle="历史告警"
        rowKey="id"
        columns={columns}
        toolBarRender={() => [
          <Button key="export" icon={<DownloadOutlined />} onClick={handleExport}>
            导出
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
