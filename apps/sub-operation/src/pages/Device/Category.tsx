import { Tabs } from 'antd'
import { ProTable, type ProColumns } from '@ant-design/pro-components'
import { Tag, Button } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDevices, type DeviceItem } from '@/api/operation'

export default function DeviceCategory() {
  const [activeType, setActiveType] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const statusMap: Record<string, { text: string; color: string }> = {
    running: { text: t('device.status.running'), color: 'green' },
    standby: { text: t('device.status.standby'), color: 'blue' },
    offline: { text: t('device.status.offline'), color: 'red' },
  }

  const categories = [
    { key: '', label: t('device.all') },
    { key: 'PCS', label: t('device.type.pcs') },
    { key: 'BMS', label: t('device.type.bms') },
    { key: 'HVAC', label: t('device.type.hvacShort') },
    { key: 'FIRE', label: t('device.type.fireShort') },
    { key: 'TRANS', label: t('device.type.transShort') },
  ]

  const columns: ProColumns<DeviceItem>[] = [
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

  return (
    <div>
      <Tabs
        activeKey={activeType}
        onChange={setActiveType}
        items={categories.map((c) => ({ key: c.key, label: c.label }))}
      />
      <ProTable<DeviceItem>
        key={activeType}
        rowKey="id"
        columns={columns}
        search={false}
        request={async (params) => {
          const { data: res } = await getDevices({
            current: params.current,
            pageSize: params.pageSize,
            type: activeType || undefined,
          })
          return {
            data: res.data.list,
            total: res.data.total,
            success: res.code === 0,
          }
        }}
        pagination={{ defaultPageSize: 10 }}
      />
    </div>
  )
}
