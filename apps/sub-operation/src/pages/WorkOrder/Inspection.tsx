import { useEffect, useRef, useState } from 'react'
import { Button, Card, Modal, Switch, Table, Tag, message, Space, Popconfirm } from 'antd'
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  type ProFormInstance,
} from '@ant-design/pro-components'
import { PlusOutlined } from '@ant-design/icons'
import {
  getInspectionTemplates,
  createInspectionTemplate,
  updateInspectionTemplate,
  deleteInspectionTemplate,
  type InspectionTemplate,
} from '@/api/workorder'

const frequencyOptions = [
  { label: '每日', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' },
  { label: '每年', value: 'yearly' },
]

export default function Inspection() {
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
    message.success('删除成功')
    fetchTemplates()
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    await updateInspectionTemplate(id, { enabled })
    message.success(enabled ? '已启用' : '已禁用')
    fetchTemplates()
  }

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing) {
      await updateInspectionTemplate(editing.id, values)
      message.success('更新成功')
    } else {
      await createInspectionTemplate(values as Omit<InspectionTemplate, 'id'>)
      message.success('创建成功')
    }
    setModalOpen(false)
    fetchTemplates()
  }

  const columns = [
    { title: '模板名称', dataIndex: 'name', key: 'name' },
    {
      title: '巡检项',
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
      title: '频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 80,
      render: (f: string) => {
        const map: Record<string, string> = {
          daily: '每日',
          weekly: '每周',
          monthly: '每月',
          yearly: '每年',
        }
        return map[f] || f
      },
    },
    {
      title: '启用',
      key: 'enabled',
      width: 80,
      render: (_: unknown, record: InspectionTemplate) => (
        <Switch checked={record.enabled} onChange={(checked) => handleToggle(record.id, checked)} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 130,
      render: (_: unknown, record: InspectionTemplate) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="巡检计划管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增模板
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
        title={editing ? '编辑模板' : '新增模板'}
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
            searchConfig: { submitText: editing ? '更新' : '创建' },
          }}
        >
          <ProFormText name="name" label="模板名称" rules={[{ required: true }]} />
          <ProFormSelect
            name="items"
            label="巡检项"
            mode="tags"
            rules={[{ required: true }]}
            fieldProps={{ placeholder: '输入后按回车添加' }}
          />
          <ProFormSelect
            name="frequency"
            label="巡检频率"
            options={frequencyOptions}
            rules={[{ required: true }]}
          />
        </ProForm>
      </Modal>
    </div>
  )
}
