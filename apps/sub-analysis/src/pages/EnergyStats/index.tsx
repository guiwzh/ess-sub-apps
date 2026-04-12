import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import ChartCard from '@/components/ChartCard'
import { useAppStore } from '@/store/appStore'

/** 充放电统计 — 柱状图 */
export default function EnergyStats() {
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)

  const option = {
    tooltip: { trigger: 'axis' as const },
    legend: { data: [t('chargeEnergy'), t('dischargeEnergy')] },
    xAxis: {
      type: 'category' as const,
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: { type: 'value' as const, name: 'kWh' },
    series: [
      {
        name: t('chargeEnergy'),
        type: 'bar',
        data: [1200, 1350, 1100, 1400, 1600, 1500],
        itemStyle: { color: '#1890ff' },
      },
      {
        name: t('dischargeEnergy'),
        type: 'bar',
        data: [1100, 1250, 1000, 1300, 1500, 1400],
        itemStyle: { color: '#52c41a' },
      },
    ],
  }

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>{t('energyStats')}</Typography.Title>
      <ChartCard title={t('energyStats')}>
        <ReactECharts
          option={option}
          theme={theme === 'dark' ? 'dark' : undefined}
          style={{ height: 400 }}
        />
      </ChartCard>
    </div>
  )
}
