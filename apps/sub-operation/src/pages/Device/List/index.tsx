import { ProTable } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDevices, type DeviceItem } from '@/api/operation'
import { getColumns } from './config'

export default function DeviceList() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const columns = getColumns(t, navigate)

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
