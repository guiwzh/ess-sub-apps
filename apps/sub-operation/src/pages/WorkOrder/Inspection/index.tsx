import {
  createInspectionTemplate,
  deleteInspectionTemplate,
  getInspectionTemplates,
  updateInspectionTemplate,
  type InspectionTemplate,
} from '@/api/workorder'
import { PlusOutlined } from '@ant-design/icons'
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  type ProFormInstance,
} from '@ant-design/pro-components'
import { Button, Card, Modal, Table, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getColumns, getFrequencyOptions } from './config'

const Inspection = () => {
  const { t } = useTranslation()
  const [templates, setTemplates] = useState<InspectionTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<InspectionTemplate | null>(null)
  const formRef = useRef<ProFormInstance>(null)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const { data: res } = await getInspectionTemplates()
      if (res.code === 0) setTemplates(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (t: InspectionTemplate) => {
    setEditing(t)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteInspectionTemplate(id)
    message.success(t('deleteSuccess'))
    fetchTemplates()
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    await updateInspectionTemplate(id, { enabled })
    message.success(enabled ? t('enabled') : t('disabled'))
    fetchTemplates()
  }

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing) {
      await updateInspectionTemplate(editing.id, values)
      message.success(t('updateSuccess'))
    } else {
      await createInspectionTemplate(values as Omit<InspectionTemplate, 'id'>)
      message.success(t('createSuccess'))
    }
    setModalOpen(false)
    fetchTemplates()
  }

  const columns = getColumns(t, {
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggle: handleToggle,
  })

  return (
    <div>
      <Card
        title={t('inspection.title')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('inspection.addTemplate')}
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={editing ? t('inspection.editTemplate') : t('inspection.addTemplate')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <ProForm
          formRef={formRef}
          initialValues={editing ?? { enabled: true }}
          onFinish={handleSubmit}
          submitter={{
            searchConfig: { submitText: editing ? t('update') : t('create') },
          }}
        >
          <ProFormText name="name" label={t('inspection.name')} rules={[{ required: true }]} />
          <ProFormSelect
            name="items"
            label={t('inspection.items')}
            mode="tags"
            rules={[{ required: true }]}
            fieldProps={{ placeholder: t('inspection.itemsPlaceholder') }}
          />
          <ProFormSelect
            name="frequency"
            label={t('inspection.frequency')}
            options={getFrequencyOptions(t)}
            rules={[{ required: true }]}
          />
        </ProForm>
      </Modal>
    </div>
  )
}

export default Inspection
