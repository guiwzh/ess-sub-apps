import type { TFunction } from 'react-i18next'
import type { DescriptionsProps } from 'antd'
import type { MonthlyReportData } from '@/api/report'

export const getMonthlyDescriptionItems = (
  t: TFunction,
  summary: MonthlyReportData['summary'],
): DescriptionsProps['items'] => [
  { label: t('report.totalCharge'), children: `${summary.totalCharge} kWh` },
  { label: t('report.totalDischarge'), children: `${summary.totalDischarge} kWh` },
  { label: t('report.peakPower'), children: `${summary.peakPower} kW` },
  { label: t('report.avgEfficiency'), children: `${summary.avgEfficiency}%` },
  {
    label: t('report.monthlyRevenue'),
    children: `${summary.revenue} ${t('revenue.unit')}`,
  },
]

export const getDailySummaryColumns = (t: TFunction) => [
  { title: t('report.date'), dataIndex: 'date', width: 100 },
  { title: t('report.chargeKwh'), dataIndex: 'charge', width: 120 },
  { title: t('report.dischargeKwh'), dataIndex: 'discharge', width: 120 },
  { title: t('report.revenueWan'), dataIndex: 'revenue', width: 120 },
]

export const getHourlyChartOption = (
  t: TFunction,
  hourly: { hour: string; charge: number; discharge: number; power: number }[],
) => ({
  tooltip: { trigger: 'axis' },
  legend: { data: [t('report.charge'), t('report.discharge'), t('report.power')] },
  xAxis: { type: 'category', data: hourly.map((h) => h.hour) },
  yAxis: [
    { type: 'value', name: 'kWh' },
    { type: 'value', name: 'kW' },
  ],
  series: [
    { name: t('report.charge'), type: 'bar', data: hourly.map((h) => h.charge) },
    { name: t('report.discharge'), type: 'bar', data: hourly.map((h) => h.discharge) },
    {
      name: t('report.power'),
      type: 'line',
      yAxisIndex: 1,
      data: hourly.map((h) => h.power),
      smooth: true,
    },
  ],
})
