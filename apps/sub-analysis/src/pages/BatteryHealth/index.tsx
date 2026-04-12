import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import ChartCard from '@/components/ChartCard'
import { useAppStore } from '@/store/appStore'

/** SOC/SOH 趋势分析 — 双折线图 */
export default function BatteryHealth() {
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)

  const option = {
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['SOC (%)', 'SOH (%)'] },
    xAxis: {
      type: 'category' as const,
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: { type: 'value' as const, name: '%', max: 100 },
    series: [
      {
        name: 'SOC (%)',
        type: 'line',
        data: [85, 82, 88, 80, 86, 83],
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
      {
        name: 'SOH (%)',
        type: 'line',
        data: [98.5, 98.3, 98.1, 97.9, 97.7, 97.5],
        smooth: true,
        itemStyle: { color: '#f5222d' },
      },
    ],
  }

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>{t('batteryHealth')}</Typography.Title>
      <ChartCard title="SOC / SOH 趋势">
        <ReactECharts
          option={option}
          theme={theme === 'dark' ? 'dark' : undefined}
          style={{ height: 400 }}
        />
      </ChartCard>
    </div>
  )
}
