import { getDevices, type DeviceItem } from '@/api/operation'
import { ProTable } from '@ant-design/pro-components'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getColumns } from './config'

const DeviceList = () => {
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
          try {
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
          } catch {
            message.error(t('fetchFailed'))
            return { data: [], total: 0, success: false }
          }
        }}
        search={{ labelWidth: 'auto' }}
        pagination={{ defaultPageSize: 10 }}
      />
    </div>
  )
}

export default DeviceList
