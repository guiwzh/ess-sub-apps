import type { ProColumns } from '@ant-design/pro-components'
import { Tag, Button } from 'antd'
import type { TFunction } from 'react-i18next'
import type { NavigateFunction } from 'react-router-dom'
import type { DeviceItem } from '@/api/operation'

export const getStatusMap = (t: TFunction) => ({
  running: { text: t('device.status.running'), color: 'green' },
  standby: { text: t('device.status.standby'), color: 'blue' },
  offline: { text: t('device.status.offline'), color: 'red' },
})

export const getCategories = (t: TFunction) => [
  { key: '', label: t('device.all') },
  { key: 'PCS', label: t('device.type.pcs') },
  { key: 'BMS', label: t('device.type.bms') },
  { key: 'HVAC', label: t('device.type.hvacShort') },
  { key: 'FIRE', label: t('device.type.fireShort') },
  { key: 'TRANS', label: t('device.type.transShort') },
]

export const getColumns = (t: TFunction, navigate: NavigateFunction): ProColumns<DeviceItem>[] => {
  const statusMap = getStatusMap(t)

  return [
    { title: t('device.code'), dataIndex: 'code', width: 120 },
    { title: t('device.name'), dataIndex: 'name', ellipsis: true },
    { title: t('device.type'), dataIndex: 'type', width: 100 },
    {
      title: t('device.status'),
      dataIndex: 'status',
      width: 90,
      render: (_, record) => {
        const s = statusMap[record.status]
        return s ? <Tag color={s.color}>{s.text}</Tag> : record.status
      },
    },
    { title: t('device.ratedPower'), dataIndex: 'ratedPower', width: 100 },
    { title: t('device.station'), dataIndex: 'station', width: 120 },
    {
      title: t('operation'),
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => navigate(`/devices/${record.id}`)}>
          {t('detail')}
        </Button>
      ),
    },
  ]
}
