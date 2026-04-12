import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import ChartCard from '@/components/ChartCard'
import { useAppStore } from '@/store/appStore'

/** 能量效率分析 — 折线图 */
export default function Efficiency() {
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)

  const option = {
    tooltip: { trigger: 'axis' as const },
    xAxis: {
      type: 'category' as const,
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: { type: 'value' as const, name: '%', max: 100 },
    series: [
      {
        name: t('efficiencyRate'),
        type: 'line',
        data: [92.5, 93.1, 91.8, 94.2, 93.6, 94.8],
        smooth: true,
        areaStyle: { opacity: 0.2 },
        itemStyle: { color: '#722ed1' },
      },
    ],
  }

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>{t('efficiency')}</Typography.Title>
      <ChartCard title={t('efficiencyRate')}>
        <ReactECharts
          option={option}
          theme={theme === 'dark' ? 'dark' : undefined}
          style={{ height: 400 }}
        />
      </ChartCard>
    </div>
  )
}
