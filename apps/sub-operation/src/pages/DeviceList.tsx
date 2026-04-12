import { Table, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '设备名称', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '站点', dataIndex: 'station', key: 'station' },
]

const mockData = [
  { id: '1', name: 'PCS-001', status: '运行中', station: '站点A' },
  { id: '2', name: 'BMS-001', status: '离线', station: '站点A' },
  { id: '3', name: 'PCS-002', status: '运行中', station: '站点B' },
]

export default function DeviceList() {
  const { t } = useTranslation()

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>{t('deviceList')}</Typography.Title>
      <Table columns={columns} dataSource={mockData} rowKey="id" />
    </div>
  )
}
