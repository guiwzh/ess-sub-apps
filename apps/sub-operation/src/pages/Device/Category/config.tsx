import type { DeviceItem } from '@/api/operation'
import { getDeviceCategories } from '@/constants/options'
import type { ProColumns } from '@ant-design/pro-components'
import { appNavigate } from '@ess/shared/wujie/navigate'
import { Button, Space, Tag } from 'antd'
import type { TFunction } from 'i18next'
import type { NavigateFunction } from 'react-router-dom'

export const getStatusMap = (t: TFunction): Record<string, { text: string; color: string }> => ({
  running: { text: t('device.status.running'), color: 'green' },
  standby: { text: t('device.status.standby'), color: 'blue' },
  offline: { text: t('device.status.offline'), color: 'red' },
})

export const getCategories = getDeviceCategories

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
      width: 150,
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
