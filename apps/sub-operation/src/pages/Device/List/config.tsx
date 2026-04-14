import type { ProColumns } from '@ant-design/pro-components'
import { Tag, Button, Space } from 'antd'
import type { TFunction } from 'react-i18next'
import type { NavigateFunction } from 'react-router-dom'
import type { DeviceItem } from '@/api/operation'
import { appNavigate } from '@/wujie/navigate'

export const getStatusMap = (t: TFunction) => ({
  running: { text: t('device.status.running'), color: 'green' },
  standby: { text: t('device.status.standby'), color: 'blue' },
  offline: { text: t('device.status.offline'), color: 'red' },
})

export const getTypeOptions = (t: TFunction) => [
  { label: t('device.type.pcs'), value: 'PCS' },
  { label: t('device.type.bms'), value: 'BMS' },
  { label: t('device.type.hvac'), value: 'HVAC' },
  { label: t('device.type.fire'), value: 'FIRE' },
  { label: t('device.type.trans'), value: 'TRANS' },
]

export const getColumns = (t: TFunction, navigate: NavigateFunction): ProColumns<DeviceItem>[] => {
  const statusMap = getStatusMap(t)
  const typeOptions = getTypeOptions(t)

  return [
    { title: t('device.code'), dataIndex: 'code', width: 120 },
    { title: t('device.name'), dataIndex: 'name', ellipsis: true },
    {
      title: t('device.type'),
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      fieldProps: { options: typeOptions },
    },
    {
      title: t('device.status'),
      dataIndex: 'status',
      width: 90,
      render: (_, record) => {
        const s = statusMap[record.status]
        return s ? <Tag color={s.color}>{s.text}</Tag> : record.status
      },
    },
    { title: t('device.ratedPower'), dataIndex: 'ratedPower', width: 100, search: false },
    { title: t('device.station'), dataIndex: 'station', width: 120, search: false },
    { title: t('device.installDate'), dataIndex: 'installDate', width: 110, search: false },
    {
      title: t('operation'),
      width: 150,
      search: false,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/devices/${record.id}`)}>
            {t('detail')}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => appNavigate('/alarms', { state: { deviceCode: record.code } })}
          >
            {t('viewAlarms')}
          </Button>
        </Space>
      ),
    },
  ]
}
