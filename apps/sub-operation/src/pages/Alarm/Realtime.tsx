import { ProTable, type ProColumns } from '@ant-design/pro-components'
import { Tag, Button, message } from 'antd'
import { getAlarms, type AlarmItem } from '@/api/operation'

const levelMap: Record<string, { text: string; color: string }> = {
  critical: { text: '紧急', color: 'red' },
  warning: { text: '重要', color: 'orange' },
  info: { text: '一般', color: 'blue' },
}

const statusOptions = [
  { label: '活跃', value: 'active' },
  { label: '已恢复', value: 'resolved' },
]

export default function AlarmRealtime() {
  const columns: ProColumns<AlarmItem>[] = [
    { title: '告警内容', dataIndex: 'message', ellipsis: true },
    { title: '设备编号', dataIndex: 'deviceCode', width: 110 },
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
    { title: '时间', dataIndex: 'time', width: 170, search: false },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      fieldProps: { options: statusOptions },
      render: (_, record) =>
        record.status === 'active' ? <Tag color="red">活跃</Tag> : <Tag color="green">已恢复</Tag>,
    },
    {
      title: '操作',
      width: 120,
      search: false,
      render: (_, record) =>
        record.status === 'active' ? (
          <>
            <Button type="link" size="small" onClick={() => message.success('已确认')}>
              确认
            </Button>
            <Button type="link" size="small" onClick={() => message.success('已消除')}>
              消除
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
        headerTitle="实时告警"
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
