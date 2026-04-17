import { getWorkOrders, type WorkOrder } from '@/api/workorder'
import { PlusOutlined } from '@ant-design/icons'
import { type ActionType, ProTable } from '@ant-design/pro-components'
import { Button } from 'antd'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import WorkOrderCreate from '../Create'
import { getColumns } from './config'

const WorkOrderList = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const actionRef = useRef<ActionType>(null)
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

export default WorkOrderList
