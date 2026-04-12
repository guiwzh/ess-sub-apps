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
import { useTranslation } from 'react-i18next'
import {
  getAlarmRules,
  createAlarmRule,
  updateAlarmRule,
  deleteAlarmRule,
  type AlarmRule,
} from '@/api/operation'

export default function AlarmRules() {
  const { t } = useTranslation()
  const [rules, setRules] = useState<AlarmRule[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<AlarmRule | null>(null)
  const formRef = useRef<ProFormInstance>(null)

  const levelOptions = [
    { label: t('alarm.level.critical'), value: 'critical' },
    { label: t('alarm.level.warning'), value: 'warning' },
    { label: t('alarm.level.info'), value: 'info' },
  ]

  const deviceTypeOptions = [
    { label: t('device.type.pcs'), value: 'PCS' },
    { label: t('device.type.bms'), value: 'BMS' },
    { label: t('device.type.hvac'), value: 'HVAC' },
    { label: t('device.type.fire'), value: 'FIRE' },
    { label: t('device.type.trans'), value: 'TRANS' },
  ]

  const paramOptions = [
    { label: t('alarm.rules.param.temp'), value: 'temperature' },
    { label: t('alarm.rules.param.voltage'), value: 'voltage' },
    { label: t('alarm.rules.param.current'), value: 'current' },
    { label: t('alarm.rules.param.power'), value: 'power' },
    { label: t('alarm.rules.param.soc'), value: 'soc' },
    { label: t('alarm.rules.param.soh'), value: 'soh' },
  ]

  const operatorOptions = [
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
    { label: '==', value: '==' },
  ]

  const notifyOptions = [
    { label: t('alarm.rules.notify.sms'), value: 'sms' },
    { label: t('alarm.rules.notify.email'), value: 'email' },
    { label: t('alarm.rules.notify.message'), value: 'push' },
  ]

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
    message.success(t('alarm.rules.deleteSuccess'))
    fetchRules()
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    await updateAlarmRule(id, { enabled })
    message.success(enabled ? t('enabled') : t('disabled'))
    fetchRules()
  }

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editingRule) {
      await updateAlarmRule(editingRule.id, values)
      message.success(t('alarm.rules.updateSuccess'))
    } else {
      await createAlarmRule(values as Omit<AlarmRule, 'id'>)
      message.success(t('alarm.rules.createSuccess'))
    }
    setModalOpen(false)
    fetchRules()
  }

  const columns = [
    { title: t('alarm.rules.name'), dataIndex: 'name', key: 'name' },
    { title: t('alarm.rules.deviceType'), dataIndex: 'deviceType', key: 'deviceType', width: 100 },
    {
      title: t('alarm.rules.condition'),
      key: 'condition',
      render: (_: unknown, record: AlarmRule) =>
        `${record.param} ${record.operator} ${record.threshold}`,
    },
    {
      title: t('alarm.level'),
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
    { title: t('alarm.rules.notifyMethod'), dataIndex: 'notifyMethod', key: 'notifyMethod', width: 100 },
    {
      title: t('alarm.rules.enabled'),
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
      title: t('operation'),
      key: 'action',
      width: 130,
      render: (_: unknown, record: AlarmRule) => (
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
        title={t('alarm.rules.title')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t('alarm.rules.add')}
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
        title={editingRule ? t('alarm.rules.edit') : t('alarm.rules.add')}
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
            searchConfig: { submitText: editingRule ? t('update') : t('create') },
          }}
        >
          <ProFormText name="name" label={t('alarm.rules.name')} rules={[{ required: true }]} />
          <ProFormSelect name="deviceType" label={t('alarm.rules.deviceType')} options={deviceTypeOptions} rules={[{ required: true }]} />
          <ProFormSelect name="param" label={t('alarm.rules.param')} options={paramOptions} rules={[{ required: true }]} />
          <ProFormSelect name="operator" label={t('alarm.rules.operator')} options={operatorOptions} rules={[{ required: true }]} />
          <ProFormDigit name="threshold" label={t('alarm.rules.threshold')} rules={[{ required: true }]} />
          <ProFormSelect name="level" label={t('alarm.rules.alarmLevel')} options={levelOptions} rules={[{ required: true }]} />
          <ProFormSelect name="notifyMethod" label={t('alarm.rules.notifyMethod')} options={notifyOptions} rules={[{ required: true }]} />
        </ProForm>
      </Modal>
    </div>
  )
}
