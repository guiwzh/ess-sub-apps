import type { TFunction } from 'react-i18next'
import type { DescriptionsProps } from 'antd'
import { Tag } from 'antd'
import type { WorkOrderDetail } from '@/api/workorder'

export const getStatusMap = (t: TFunction) => ({
  pending: { text: t('workorder.status.pending'), color: 'default' },
  processing: { text: t('workorder.status.processing'), color: 'processing' },
  completed: { text: t('workorder.status.completed'), color: 'success' },
  closed: { text: t('workorder.status.closed'), color: 'default' },
})

export const getPriorityMap = (t: TFunction) => ({
  high: { text: t('workorder.priority.high'), color: 'red' },
  medium: { text: t('workorder.priority.medium'), color: 'orange' },
  low: { text: t('workorder.priority.low'), color: 'blue' },
})

export const getDescriptionItems = (
  t: TFunction,
  detail: WorkOrderDetail,
): DescriptionsProps['items'] => {
  const statusMap = getStatusMap(t)
  const priorityMap = getPriorityMap(t)
  const s = statusMap[detail.status]
  const p = priorityMap[detail.priority]

  return [
    { label: t('workorder.id'), children: detail.id },
    {
      label: t('workorder.status'),
      children: s ? <Tag color={s.color}>{s.text}</Tag> : detail.status,
    },
    {
      label: t('workorder.priority'),
      children: p ? <Tag color={p.color}>{p.text}</Tag> : detail.priority,
    },
    { label: t('workorder.type'), children: detail.type },
    { label: t('workorder.device'), children: detail.deviceCode },
    { label: t('workorder.station'), children: detail.station },
    { label: t('workorder.assignee'), children: detail.assignee },
    { label: t('workorder.createdAt'), children: detail.createdAt },
  ]
}
