import { Table, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '告警内容', dataIndex: 'message', key: 'message' },
  {
    title: '级别',
    dataIndex: 'level',
    key: 'level',
    render: (level: string) => {
      const colorMap: Record<string, string> = {
        critical: 'red',
        warning: 'orange',
        info: 'blue',
      }
      return <Tag color={colorMap[level] ?? 'default'}>{level}</Tag>
    },
  },
  { title: '时间', dataIndex: 'time', key: 'time' },
]

const mockData = [
  {
    id: '1',
    message: 'PCS-001 过温告警',
    level: 'critical',
    time: '2025-01-15 10:30:00',
  },
  {
    id: '2',
    message: 'BMS-001 通信中断',
    level: 'warning',
    time: '2025-01-15 10:25:00',
  },
  {
    id: '3',
    message: '系统巡检完成',
    level: 'info',
    time: '2025-01-15 10:00:00',
  },
]

export default function AlarmList() {
  const { t } = useTranslation()

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>{t('alarmList')}</Typography.Title>
      <Table columns={columns} dataSource={mockData} rowKey="id" />
    </div>
  )
}
