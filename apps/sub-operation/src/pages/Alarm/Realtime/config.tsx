import type { ProColumns } from '@ant-design/pro-components'
import { Tag, Button, message } from 'antd'
import type { TFunction } from 'i18next'
import type { AlarmItem } from '@/api/operation'

export const getLevelMap = (t: TFunction) => ({
  critical: { text: t('alarm.level.critical'), color: 'red' },
  warning: { text: t('alarm.level.warning'), color: 'orange' },
  info: { text: t('alarm.level.info'), color: 'blue' },
})

export const getLevelOptions = (t: TFunction) => [
  { label: t('alarm.level.critical'), value: 'critical' },
  { label: t('alarm.level.warning'), value: 'warning' },
  { label: t('alarm.level.info'), value: 'info' },
]

export const getColumns = (t: TFunction): ProColumns<AlarmItem>[] => {
  const levelMap = getLevelMap(t)

  return [
    { title: t('alarm.content'), dataIndex: 'message', ellipsis: true },
    { title: t('alarm.deviceCode'), dataIndex: 'deviceCode', width: 110 },
    {
      title: t('alarm.level'),
      dataIndex: 'level',
      width: 80,
      valueType: 'select',
      fieldProps: { options: getLevelOptions(t) },
      render: (_, record) => {
        const l = levelMap[record.level]
        return l ? <Tag color={l.color}>{l.text}</Tag> : record.level
      },
    },
    { title: t('alarm.time'), dataIndex: 'time', width: 170, search: false },
    {
      title: t('alarm.status'),
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: t('alarm.status.active'), value: 'active' },
          { label: t('alarm.status.resolved'), value: 'resolved' },
        ],
      },
      render: (_, record) =>
        record.status === 'active' ? (
          <Tag color="red">{t('alarm.status.active')}</Tag>
        ) : (
          <Tag color="green">{t('alarm.status.resolved')}</Tag>
        ),
    },
    {
      title: t('operation'),
      width: 120,
      search: false,
      render: (_, record) =>
        record.status === 'active' ? (
          <>
            <Button type="link" size="small" onClick={() => message.success(t('alarm.confirm'))}>
              {t('alarm.confirm')}
            </Button>
            <Button type="link" size="small" onClick={() => message.success(t('alarm.clear'))}>
              {t('alarm.clear')}
            </Button>
          </>
        ) : (
          '-'
        ),
    },
  ]
}
