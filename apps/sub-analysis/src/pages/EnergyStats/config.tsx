import type { TFunction } from 'react-i18next'
import type { EnergyStatsData } from '@/api/analysis'

export const getStationOptions = (t: TFunction) => [
  { label: t('station.all'), value: '' },
  { label: t('station.nameA'), value: '储能站点A' },
  { label: t('station.nameB'), value: '储能站点B' },
  { label: t('station.nameC'), value: '储能站点C' },
]

export const getChartOption = (t: TFunction, data: EnergyStatsData) => ({
  tooltip: { trigger: 'axis' as const },
  legend: { data: [t('chargeEnergy'), t('dischargeEnergy')] },
  xAxis: { type: 'category' as const, data: data.labels },
  yAxis: { type: 'value' as const, name: 'kWh' },
  series: [
    {
      name: t('chargeEnergy'),
      type: 'bar',
      data: data.charge,
      itemStyle: { color: '#1890ff' },
    },
    {
      name: t('dischargeEnergy'),
      type: 'bar',
      data: data.discharge,
      itemStyle: { color: '#52c41a' },
    },
  ],
})
