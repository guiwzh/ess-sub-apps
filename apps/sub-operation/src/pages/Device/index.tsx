import { ProTable, type ProColumns } from '@ant-design/pro-components'
import { Tag, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDevices, type DeviceItem } from '@/api/operation'

export default function DeviceIndex() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const statusMap: Record<string, { text: string; color: string }> = {
    running: { text: t('device.status.running'), color: 'green' },
    standby: { text: t('device.status.standby'), color: 'blue' },
    offline: { text: t('device.status.offline'), color: 'red' },
  }

  const typeOptions = [
    { label: t('device.type.pcs'), value: 'PCS' },
    { label: t('device.type.bms'), value: 'BMS' },
    { label: t('device.type.hvac'), value: 'HVAC' },
    { label: t('device.type.fire'), value: 'FIRE' },
    { label: t('device.type.trans'), value: 'TRANS' },
  ]

  const columns: ProColumns<DeviceItem>[] = [
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
      width: 80,
      search: false,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => navigate(`/devices/${record.id}`)}>
          {t('detail')}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <ProTable<DeviceItem>
        headerTitle={t('device.title')}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const { data: res } = await getDevices({
            current: params.current,
            pageSize: params.pageSize,
            keyword: params.keyword,
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
