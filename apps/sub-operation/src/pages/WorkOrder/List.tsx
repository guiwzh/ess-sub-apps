import { ProTable, type ProColumns } from '@ant-design/pro-components'
import { Tag, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'
import { getWorkOrders, type WorkOrder } from '@/api/workorder'

const statusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待派发', color: 'default' },
  processing: { text: '处理中', color: 'processing' },
  completed: { text: '已完成', color: 'success' },
  closed: { text: '已关闭', color: 'default' },
}

const typeMap: Record<string, string> = {
  fault: '故障维修',
  maintenance: '维保',
  inspection: '巡检',
}

const priorityMap: Record<string, { text: string; color: string }> = {
  high: { text: '高', color: 'red' },
  medium: { text: '中', color: 'orange' },
  low: { text: '低', color: 'blue' },
}

export default function WorkOrderList() {
  const navigate = useNavigate()

  const columns: ProColumns<WorkOrder>[] = [
    { title: '工单编号', dataIndex: 'id', width: 110 },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'type',
      width: 90,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '故障维修', value: 'fault' },
          { label: '维保', value: 'maintenance' },
          { label: '巡检', value: 'inspection' },
        ],
      },
      render: (_, r) => typeMap[r.type] || r.type,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      search: false,
      render: (_, r) => {
        const p = priorityMap[r.priority]
        return p ? <Tag color={p.color}>{p.text}</Tag> : r.priority
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '待派发', value: 'pending' },
          { label: '处理中', value: 'processing' },
          { label: '已完成', value: 'completed' },
          { label: '已关闭', value: 'closed' },
        ],
      },
      render: (_, r) => {
        const s = statusMap[r.status]
        return s ? <Tag color={s.color}>{s.text}</Tag> : r.status
      },
    },
    { title: '关联设备', dataIndex: 'deviceCode', width: 100, search: false },
    { title: '站点', dataIndex: 'station', width: 110, search: false },
    { title: '负责人', dataIndex: 'assignee', width: 80, search: false },
    { title: '创建时间', dataIndex: 'createdAt', width: 170, search: false },
    {
      title: '操作',
      width: 80,
      search: false,
      render: (_, r) => (
        <Button type="link" size="small" onClick={() => navigate(`/work-orders/${r.id}`)}>
          详情
        </Button>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <ProTable<WorkOrder>
        headerTitle="运维工单"
        rowKey="id"
        columns={columns}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/work-orders/create')}
          >
            创建工单
          </Button>,
        ]}
        request={async (params) => {
          const { data: res } = await getWorkOrders({
            current: params.current,
            pageSize: params.pageSize,
            status: params.status,
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
