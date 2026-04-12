import { ProTable, type ProColumns } from '@ant-design/pro-components'
import { Tag, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getDevices, type DeviceItem } from '@/api/operation'

const statusMap: Record<string, { text: string; color: string }> = {
  running: { text: '运行中', color: 'green' },
  standby: { text: '待机', color: 'blue' },
  offline: { text: '离线', color: 'red' },
}

const typeOptions = [
  { label: 'PCS', value: 'PCS' },
  { label: 'BMS', value: 'BMS' },
  { label: '空调 (HVAC)', value: 'HVAC' },
  { label: '消防 (FIRE)', value: 'FIRE' },
  { label: '变压器 (TRANS)', value: 'TRANS' },
]

export default function DeviceIndex() {
  const navigate = useNavigate()

  const columns: ProColumns<DeviceItem>[] = [
    { title: '设备编号', dataIndex: 'code', width: 120 },
    { title: '设备名称', dataIndex: 'name', ellipsis: true },
    {
      title: '设备类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      fieldProps: { options: typeOptions },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (_, record) => {
        const s = statusMap[record.status]
        return s ? <Tag color={s.color}>{s.text}</Tag> : record.status
      },
    },
    { title: '额定功率', dataIndex: 'ratedPower', width: 100, search: false },
    { title: '所属站点', dataIndex: 'station', width: 120, search: false },
    { title: '安装日期', dataIndex: 'installDate', width: 110, search: false },
    {
      title: '操作',
      width: 80,
      search: false,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => navigate(`/devices/${record.id}`)}>
          详情
        </Button>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <ProTable<DeviceItem>
        headerTitle="设备台账"
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const { data: res } = await getDevices({
            current: params.current,
            pageSize: params.pageSize,
            keyword: params.keyword,
            type: params.type,
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
