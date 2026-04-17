import type { EnergyStatsData } from '@/api/analysis'
import type { TFunction } from 'i18next'

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
