import { ProTable } from '@ant-design/pro-components'
import { Tabs } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getDevices, type DeviceItem } from '@/api/operation'
import { getCategories, getColumns } from './config'

export default function DeviceCategory() {
  const [activeType, setActiveType] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const categories = getCategories(t)
  const columns = getColumns(t, navigate)

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
