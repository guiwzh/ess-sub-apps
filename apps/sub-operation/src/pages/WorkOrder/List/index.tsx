import { useRef, useState } from 'react'
import { type ActionType, ProTable } from '@ant-design/pro-components'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { getWorkOrders, type WorkOrder } from '@/api/workorder'
import WorkOrderCreate from '../Create'
import { getColumns } from './config'

export default function WorkOrderList() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const actionRef = useRef<ActionType>()
  const [createOpen, setCreateOpen] = useState(false)
  const columns = getColumns(t, navigate)

  return (
    <div>
      <ProTable<WorkOrder>
        headerTitle={t('workorder.title')}
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            {t('workorder.create')}
          </Button>,
        ]}
        request={async (params) => {
          const { data: res } = await getWorkOrders({
            current: params.current,
            pageSize: params.pageSize,
            status: params.status,
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
      <WorkOrderCreate
        open={createOpen}
        onClose={(created) => {
          setCreateOpen(false)
          if (created) actionRef.current?.reload()
        }}
      />
    </div>
  )
}
