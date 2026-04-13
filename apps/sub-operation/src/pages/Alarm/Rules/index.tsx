import { useEffect, useRef, useState } from 'react'
import { Button, Card, Modal, Table, message } from 'antd'
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
import {
  getLevelOptions,
  getDeviceTypeOptions,
  getParamOptions,
  operatorOptions,
  getNotifyOptions,
  getColumns,
} from './config'

export default function AlarmRules() {
  const { t } = useTranslation()
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

  const columns = getColumns(t, {
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggle: handleToggle,
  })

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
          <ProFormSelect
            name="deviceType"
            label={t('alarm.rules.deviceType')}
            options={getDeviceTypeOptions(t)}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="param"
            label={t('alarm.rules.param')}
            options={getParamOptions(t)}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="operator"
            label={t('alarm.rules.operator')}
            options={operatorOptions}
            rules={[{ required: true }]}
          />
          <ProFormDigit
            name="threshold"
            label={t('alarm.rules.threshold')}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="level"
            label={t('alarm.rules.alarmLevel')}
            options={getLevelOptions(t)}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="notifyMethod"
            label={t('alarm.rules.notifyMethod')}
            options={getNotifyOptions(t)}
            rules={[{ required: true }]}
          />
        </ProForm>
      </Modal>
    </div>
  )
}
