import type { DeviceDetail } from '@/api/operation'
import type { DescriptionsProps } from 'antd'
import { Tag } from 'antd'
import type { TFunction } from 'i18next'

export const getStatusMap = (t: TFunction): Record<string, { text: string; color: string }> => ({
  running: { text: t('device.status.running'), color: 'green' },
  standby: { text: t('device.status.standby'), color: 'blue' },
  offline: { text: t('device.status.offline'), color: 'red' },
})

export const getBasicInfoItems = (
  t: TFunction,
  detail: DeviceDetail,
): DescriptionsProps['items'] => {
  const statusMap = getStatusMap(t)
  const s = statusMap[detail.status]

  return [
    { label: t('device.code'), children: detail.code },
    { label: t('device.name'), children: detail.name },
    { label: t('device.type'), children: detail.type },
    {
      label: t('device.status'),
      children: s ? <Tag color={s.color}>{s.text}</Tag> : detail.status,
    },
    { label: t('device.ratedPower'), children: detail.ratedPower },
    { label: t('device.station'), children: detail.station },
    { label: t('device.installDate'), children: detail.installDate },
  ]
}

export const getRunningParamsItems = (
  t: TFunction,
  params: DeviceDetail['runningParams'],
): {
  left: DescriptionsProps['items']
  right: DescriptionsProps['items']
  battery?: DescriptionsProps['items']
} => ({
  left: [
    { label: t('device.voltage'), children: `${params.voltage} V` },
    { label: t('device.current'), children: `${params.current} A` },
  ],
  right: [
    { label: t('device.power'), children: `${params.power} kW` },
    { label: t('device.temperature'), children: `${params.temperature} ℃` },
  ],
  battery:
    params.soc !== undefined
      ? [
          { label: 'SOC', children: `${params.soc}%` },
          { label: 'SOH', children: `${params.soh}%` },
        ]
      : undefined,
})

export const getChartOption = (t: TFunction, detail: DeviceDetail) => ({
  tooltip: { trigger: 'axis' as const },
  legend: { data: [t('device.powerKw'), t('device.tempC')] },
  xAxis: { type: 'category' as const, data: detail.historyData.timestamps },
  yAxis: [
    { type: 'value' as const, name: 'kW' },
    { type: 'value' as const, name: '℃' },
  ],
  series: [
    {
      name: t('device.powerKw'),
      type: 'line',
      data: detail.historyData.power,
      smooth: true,
      itemStyle: { color: '#1890ff' },
    },
    {
      name: t('device.tempC'),
      type: 'line',
      yAxisIndex: 1,
      data: detail.historyData.temperature,
      smooth: true,
      itemStyle: { color: '#f5222d' },
    },
  ],
})

export const getMaintenanceColumns = (t: TFunction) => [
  { title: t('device.date'), dataIndex: 'date', key: 'date' },
  { title: t('device.maintType'), dataIndex: 'type', key: 'type' },
  { title: t('device.operator'), dataIndex: 'operator', key: 'operator' },
  {
    title: t('device.result'),
    dataIndex: 'result',
    key: 'result',
    render: (val: string) => <Tag color={val === '正常' ? 'green' : 'orange'}>{val}</Tag>,
  },
]
