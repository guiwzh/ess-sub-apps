import type { TFunction } from 'i18next'
import { Tag, Button, Switch, Space, Popconfirm } from 'antd'
import type { InspectionTemplate } from '@/api/workorder'

export const getFrequencyOptions = (t: TFunction) => [
  { label: t('inspection.frequency.daily'), value: 'daily' },
  { label: t('inspection.frequency.weekly'), value: 'weekly' },
  { label: t('inspection.frequency.monthly'), value: 'monthly' },
  { label: t('inspection.frequency.yearly'), value: 'yearly' },
]

export const getColumns = (
  t: TFunction,
  handlers: {
    onEdit: (template: InspectionTemplate) => void
    onDelete: (id: string) => void
    onToggle: (id: string, enabled: boolean) => void
  },
) => {
  const frequencyMap: Record<string, string> = {
    daily: t('inspection.frequency.daily'),
    weekly: t('inspection.frequency.weekly'),
    monthly: t('inspection.frequency.monthly'),
    yearly: t('inspection.frequency.yearly'),
  }

  return [
    { title: t('inspection.name'), dataIndex: 'name', key: 'name' },
    {
      title: t('inspection.items'),
      dataIndex: 'items',
      key: 'items',
      render: (items: string[]) =>
        items.map((item) => (
          <Tag key={item} style={{ marginBottom: 4 }}>
            {item}
          </Tag>
        )),
    },
    {
      title: t('inspection.frequency'),
      dataIndex: 'frequency',
      key: 'frequency',
      width: 80,
      render: (f: string) => frequencyMap[f] || f,
    },
    {
      title: t('enabled'),
      key: 'enabled',
      width: 80,
      render: (_: unknown, record: InspectionTemplate) => (
        <Switch
          checked={record.enabled}
          onChange={(checked) => handlers.onToggle(record.id, checked)}
        />
      ),
    },
    {
      title: t('operation'),
      key: 'action',
      width: 130,
      render: (_: unknown, record: InspectionTemplate) => (
        <Space>
          <Button type="link" size="small" onClick={() => handlers.onEdit(record)}>
            {t('edit')}
          </Button>
          <Popconfirm title={t('confirmDelete')} onConfirm={() => handlers.onDelete(record.id)}>
            <Button type="link" size="small" danger>
              {t('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]
}
