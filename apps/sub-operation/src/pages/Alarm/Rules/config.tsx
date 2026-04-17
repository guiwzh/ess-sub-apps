import type { TFunction } from 'i18next'
import { Tag, Button, Switch, Space, Popconfirm } from 'antd'
import type { AlarmRule } from '@/api/operation'

export const getLevelOptions = (t: TFunction) => [
  { label: t('alarm.level.critical'), value: 'critical' },
  { label: t('alarm.level.warning'), value: 'warning' },
  { label: t('alarm.level.info'), value: 'info' },
]

export const getDeviceTypeOptions = (t: TFunction) => [
  { label: t('device.type.pcs'), value: 'PCS' },
  { label: t('device.type.bms'), value: 'BMS' },
  { label: t('device.type.hvac'), value: 'HVAC' },
  { label: t('device.type.fire'), value: 'FIRE' },
  { label: t('device.type.trans'), value: 'TRANS' },
]

export const getParamOptions = (t: TFunction) => [
  { label: t('alarm.rules.param.temp'), value: 'temperature' },
  { label: t('alarm.rules.param.voltage'), value: 'voltage' },
  { label: t('alarm.rules.param.current'), value: 'current' },
  { label: t('alarm.rules.param.power'), value: 'power' },
  { label: t('alarm.rules.param.soc'), value: 'soc' },
  { label: t('alarm.rules.param.soh'), value: 'soh' },
]

export const operatorOptions = [
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '>=', value: '>=' },
  { label: '<=', value: '<=' },
  { label: '==', value: '==' },
]

export const getNotifyOptions = (t: TFunction) => [
  { label: t('alarm.rules.notify.sms'), value: 'sms' },
  { label: t('alarm.rules.notify.email'), value: 'email' },
  { label: t('alarm.rules.notify.message'), value: 'push' },
]

export const getColumns = (
  t: TFunction,
  handlers: {
    onEdit: (rule: AlarmRule) => void
    onDelete: (id: string) => void
    onToggle: (id: string, enabled: boolean) => void
  },
) => [
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
  {
    title: t('alarm.rules.notifyMethod'),
    dataIndex: 'notifyMethod',
    key: 'notifyMethod',
    width: 100,
  },
  {
    title: t('alarm.rules.enabled'),
    key: 'enabled',
    width: 80,
    render: (_: unknown, record: AlarmRule) => (
      <Switch
        checked={record.enabled}
        onChange={(checked) => handlers.onToggle(record.id, checked)}
      />
    ),
  },
  {
    title: t('operation'),
    key: 'action',
    width: 130,
    render: (_: unknown, record: AlarmRule) => (
      <Space>
        <Button type="link" size="small" onClick={() => handlers.onEdit(record)}>
          {t('edit')}
        </Button>
        <Popconfirm title={t('confirmDelete')} onConfirm={() => handlers.onDelete(record.id)}>
          <Button type="link" size="small" danger>
            {t('delete')}
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
]
