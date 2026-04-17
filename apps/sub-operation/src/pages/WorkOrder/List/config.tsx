import type { ProColumns } from '@ant-design/pro-components'
import { Tag, Button } from 'antd'
import type { TFunction } from 'i18next'
import type { NavigateFunction } from 'react-router-dom'
import type { WorkOrder } from '@/api/workorder'

export const getStatusMap = (t: TFunction) => ({
  pending: { text: t('workorder.status.pending'), color: 'default' },
  processing: { text: t('workorder.status.processing'), color: 'processing' },
  completed: { text: t('workorder.status.completed'), color: 'success' },
  closed: { text: t('workorder.status.closed'), color: 'default' },
})

export const getTypeMap = (t: TFunction): Record<string, string> => ({
  fault: t('workorder.type.fault'),
  maintenance: t('workorder.type.maintenance'),
  inspection: t('workorder.type.inspection'),
})

export const getPriorityMap = (t: TFunction) => ({
  high: { text: t('workorder.priority.high'), color: 'red' },
  medium: { text: t('workorder.priority.medium'), color: 'orange' },
  low: { text: t('workorder.priority.low'), color: 'blue' },
})

export const getColumns = (t: TFunction, navigate: NavigateFunction): ProColumns<WorkOrder>[] => {
  const statusMap = getStatusMap(t)
  const typeMap = getTypeMap(t)
  const priorityMap = getPriorityMap(t)

  return [
    { title: t('workorder.id'), dataIndex: 'id', width: 110 },
    { title: t('workorder.subject'), dataIndex: 'title', ellipsis: true },
    {
      title: t('workorder.type'),
      dataIndex: 'type',
      width: 90,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: t('workorder.type.fault'), value: 'fault' },
          { label: t('workorder.type.maintenance'), value: 'maintenance' },
          { label: t('workorder.type.inspection'), value: 'inspection' },
        ],
      },
      render: (_, r) => typeMap[r.type] || r.type,
    },
    {
      title: t('workorder.priority'),
      dataIndex: 'priority',
      width: 80,
      search: false,
      render: (_, r) => {
        const p = priorityMap[r.priority]
        return p ? <Tag color={p.color}>{p.text}</Tag> : r.priority
      },
    },
    {
      title: t('workorder.status'),
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: t('workorder.status.pending'), value: 'pending' },
          { label: t('workorder.status.processing'), value: 'processing' },
          { label: t('workorder.status.completed'), value: 'completed' },
          { label: t('workorder.status.closed'), value: 'closed' },
        ],
      },
      render: (_, r) => {
        const s = statusMap[r.status]
        return s ? <Tag color={s.color}>{s.text}</Tag> : r.status
      },
    },
    { title: t('workorder.device'), dataIndex: 'deviceCode', width: 100, search: false },
    { title: t('workorder.station'), dataIndex: 'station', width: 110, search: false },
    { title: t('workorder.assignee'), dataIndex: 'assignee', width: 80, search: false },
    { title: t('workorder.createdAt'), dataIndex: 'createdAt', width: 170, search: false },
    {
      title: t('operation'),
      width: 80,
      search: false,
      render: (_, r) => (
        <Button type="link" size="small" onClick={() => navigate(`/work-orders/${r.id}`)}>
          {t('detail')}
        </Button>
      ),
    },
  ]
}
