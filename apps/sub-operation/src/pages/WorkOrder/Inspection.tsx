import { useEffect, useRef, useState } from 'react'
import { Button, Card, Modal, Switch, Table, Tag, message, Space, Popconfirm } from 'antd'
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  type ProFormInstance,
} from '@ant-design/pro-components'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import {
  getInspectionTemplates,
  createInspectionTemplate,
  updateInspectionTemplate,
  deleteInspectionTemplate,
  type InspectionTemplate,
} from '@/api/workorder'

export default function Inspection() {
  const { t } = useTranslation()

  const frequencyOptions = [
    { label: t('inspection.frequency.daily'), value: 'daily' },
    { label: t('inspection.frequency.weekly'), value: 'weekly' },
    { label: t('inspection.frequency.monthly'), value: 'monthly' },
    { label: t('inspection.frequency.yearly'), value: 'yearly' },
  ]
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

  const columns = [
    { title: t('inspection.name'), dataIndex: 'name', key: 'name' },
    {
      title: t('inspection.items'),
      dataIndex: 'items',
      key: 'items',
      render: (items: string[]) =>
        items.map((item) => (
          <Tag key={item} style={{ marginBottom: 4 }}>
            {item}
          </Tag>
        )),
    },
    {
      title: t('inspection.frequency'),
      dataIndex: 'frequency',
      key: 'frequency',
      width: 80,
      render: (f: string) => {
        const map: Record<string, string> = {
          daily: t('inspection.frequency.daily'),
          weekly: t('inspection.frequency.weekly'),
          monthly: t('inspection.frequency.monthly'),
          yearly: t('inspection.frequency.yearly'),
        }
        return map[f] || f
      },
    },
    {
      title: t('enabled'),
      key: 'enabled',
      width: 80,
      render: (_: unknown, record: InspectionTemplate) => (
        <Switch checked={record.enabled} onChange={(checked) => handleToggle(record.id, checked)} />
      ),
    },
    {
      title: t('operation'),
      key: 'action',
      width: 130,
      render: (_: unknown, record: InspectionTemplate) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            {t('edit')}
          </Button>
          <Popconfirm title={t('confirmDelete')} onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger>
              {t('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

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
        destroyOnClose
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
            options={frequencyOptions}
            rules={[{ required: true }]}
          />
        </ProForm>
      </Modal>
    </div>
  )
}
