import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Modal,
  Switch,
  Table,
  Tag,
  message,
  Space,
  Popconfirm,
} from 'antd'
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  type ProFormInstance,
} from '@ant-design/pro-components'
import { PlusOutlined } from '@ant-design/icons'
import {
  getAlarmRules,
  createAlarmRule,
  updateAlarmRule,
  deleteAlarmRule,
  type AlarmRule,
} from '@/api/operation'

const levelOptions = [
  { label: '紧急', value: 'critical' },
  { label: '重要', value: 'warning' },
  { label: '一般', value: 'info' },
]

const deviceTypeOptions = [
  { label: 'PCS', value: 'PCS' },
  { label: 'BMS', value: 'BMS' },
  { label: '空调 (HVAC)', value: 'HVAC' },
  { label: '消防 (FIRE)', value: 'FIRE' },
  { label: '变压器 (TRANS)', value: 'TRANS' },
]

const paramOptions = [
  { label: '温度', value: 'temperature' },
  { label: '电压', value: 'voltage' },
  { label: '电流', value: 'current' },
  { label: '功率', value: 'power' },
  { label: 'SOC', value: 'soc' },
  { label: 'SOH', value: 'soh' },
]

const operatorOptions = [
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '>=', value: '>=' },
  { label: '<=', value: '<=' },
  { label: '==', value: '==' },
]

const notifyOptions = [
  { label: '短信', value: 'sms' },
  { label: '邮件', value: 'email' },
  { label: '站内消息', value: 'push' },
]

export default function AlarmRules() {
  const [rules, setRules] = useState<AlarmRule[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<AlarmRule | null>(null)
  const formRef = useRef<ProFormInstance>(null)

  const fetchRules = async () => {
    setLoading(true)
    try {
      const { data: res } = await getAlarmRules()
      if (res.code === 0) setRules(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const handleAdd = () => {
    setEditingRule(null)
    setModalOpen(true)
  }

  const handleEdit = (rule: AlarmRule) => {
    setEditingRule(rule)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteAlarmRule(id)
    message.success('删除成功')
    fetchRules()
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    await updateAlarmRule(id, { enabled })
    message.success(enabled ? '已启用' : '已禁用')
    fetchRules()
  }

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editingRule) {
      await updateAlarmRule(editingRule.id, values)
      message.success('更新成功')
    } else {
      await createAlarmRule(values as Omit<AlarmRule, 'id'>)
      message.success('创建成功')
    }
    setModalOpen(false)
    fetchRules()
  }

  const columns = [
    { title: '规则名称', dataIndex: 'name', key: 'name' },
    { title: '设备类型', dataIndex: 'deviceType', key: 'deviceType', width: 100 },
    {
      title: '条件',
      key: 'condition',
      render: (_: unknown, record: AlarmRule) =>
        `${record.param} ${record.operator} ${record.threshold}`,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          critical: 'red',
          warning: 'orange',
          info: 'blue',
        }
        return <Tag color={colorMap[level]}>{level}</Tag>
      },
    },
    { title: '通知方式', dataIndex: 'notifyMethod', key: 'notifyMethod', width: 100 },
    {
      title: '启用',
      key: 'enabled',
      width: 80,
      render: (_: unknown, record: AlarmRule) => (
        <Switch
          checked={record.enabled}
          onChange={(checked) => handleToggle(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 130,
      render: (_: unknown, record: AlarmRule) => (
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
    <div>
      <Card
        title="告警规则配置"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增规则
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={rules}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={editingRule ? '编辑规则' : '新增规则'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <ProForm
          formRef={formRef}
          initialValues={editingRule ?? { enabled: true }}
          onFinish={handleSubmit}
          submitter={{
            searchConfig: { submitText: editingRule ? '更新' : '创建' },
          }}
        >
          <ProFormText name="name" label="规则名称" rules={[{ required: true }]} />
          <ProFormSelect name="deviceType" label="设备类型" options={deviceTypeOptions} rules={[{ required: true }]} />
          <ProFormSelect name="param" label="监控参数" options={paramOptions} rules={[{ required: true }]} />
          <ProFormSelect name="operator" label="运算符" options={operatorOptions} rules={[{ required: true }]} />
          <ProFormDigit name="threshold" label="阈值" rules={[{ required: true }]} />
          <ProFormSelect name="level" label="告警级别" options={levelOptions} rules={[{ required: true }]} />
          <ProFormSelect name="notifyMethod" label="通知方式" options={notifyOptions} rules={[{ required: true }]} />
        </ProForm>
      </Modal>
    </div>
  )
}
