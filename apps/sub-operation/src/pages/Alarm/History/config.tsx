import type { HistoryAlarmItem } from '@/api/operation'
import { getStationFilterOptions } from '@/constants/options'
import type { ProColumns } from '@ant-design/pro-components'
import { Tag } from 'antd'
import type { TFunction } from 'i18next'

export const getLevelMap = (t: TFunction) => ({
  critical: { text: t('alarm.level.critical'), color: 'red' },
  warning: { text: t('alarm.level.warning'), color: 'orange' },
  info: { text: t('alarm.level.info'), color: 'blue' },
})

export const getColumns = (t: TFunction): ProColumns<HistoryAlarmItem>[] => {
  const levelMap = getLevelMap(t)

  return [
    { title: t('alarm.content'), dataIndex: 'message', ellipsis: true },
    { title: t('alarm.deviceCode'), dataIndex: 'deviceCode', width: 110, search: false },
    {
      title: t('alarm.level'),
      dataIndex: 'level',
      width: 80,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: t('alarm.level.critical'), value: 'critical' },
          { label: t('alarm.level.warning'), value: 'warning' },
          { label: t('alarm.level.info'), value: 'info' },
        ],
      },
      render: (_, record) => {
        const l = levelMap[record.level]
        return l ? <Tag color={l.color}>{l.text}</Tag> : record.level
      },
    },
    {
      title: t('alarm.station'),
      dataIndex: 'station',
      width: 120,
      valueType: 'select',
      fieldProps: {
        options: getStationFilterOptions(t),
      },
    },
    { title: t('alarm.alarmTime'), dataIndex: 'time', width: 170, search: false },
    { title: t('alarm.resolvedTime'), dataIndex: 'resolvedTime', width: 170, search: false },
  ]
}
