import { Tabs } from 'antd'
import { ProTable, type ProColumns } from '@ant-design/pro-components'
import { Tag, Button } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDevices, type DeviceItem } from '@/api/operation'

const statusMap: Record<string, { text: string; color: string }> = {
  running: { text: '运行中', color: 'green' },
  standby: { text: '待机', color: 'blue' },
  offline: { text: '离线', color: 'red' },
}

const categories = [
  { key: '', label: '全部' },
  { key: 'PCS', label: 'PCS' },
  { key: 'BMS', label: 'BMS' },
  { key: 'HVAC', label: '空调' },
  { key: 'FIRE', label: '消防' },
  { key: 'TRANS', label: '变压器' },
]

export default function DeviceCategory() {
  const [activeType, setActiveType] = useState('')
  const navigate = useNavigate()

  const columns: ProColumns<DeviceItem>[] = [
    { title: '设备编号', dataIndex: 'code', width: 120 },
    { title: '设备名称', dataIndex: 'name', ellipsis: true },
    { title: '设备类型', dataIndex: 'type', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (_, record) => {
        const s = statusMap[record.status]
        return s ? <Tag color={s.color}>{s.text}</Tag> : record.status
      },
    },
    { title: '额定功率', dataIndex: 'ratedPower', width: 100 },
    { title: '所属站点', dataIndex: 'station', width: 120 },
    {
      title: '操作',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => navigate(`/devices/${record.id}`)}>
          详情
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Tabs
        activeKey={activeType}
        onChange={setActiveType}
        items={categories.map((c) => ({ key: c.key, label: c.label }))}
      />
      <ProTable<DeviceItem>
        key={activeType}
        rowKey="id"
        columns={columns}
        search={false}
        request={async (params) => {
          const { data: res } = await getDevices({
            current: params.current,
            pageSize: params.pageSize,
            type: activeType || undefined,
          })
          return {
            data: res.data.list,
            total: res.data.total,
            success: res.code === 0,
          }
        }}
        pagination={{ defaultPageSize: 10 }}
      />
    </div>
  )
}
