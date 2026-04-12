import { Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import ChartCard from '@/components/ChartCard'
import { useAppStore } from '@/store/appStore'

/** 收益分析 — 饼图 + 折线图 */
export default function Revenue() {
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)

  const pieOption = {
    tooltip: { trigger: 'item' as const },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 4500, name: '峰时收益' },
          { value: 2800, name: '平时收益' },
          { value: 1200, name: '谷时收益' },
          { value: 600, name: '补贴收入' },
        ],
      },
    ],
  }

  const lineOption = {
    tooltip: { trigger: 'axis' as const },
    xAxis: {
      type: 'category' as const,
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: { type: 'value' as const, name: '万元' },
    series: [
      {
        name: '月收益',
        type: 'line',
        data: [8.2, 9.1, 7.8, 10.5, 11.2, 10.8],
        smooth: true,
        itemStyle: { color: '#fa8c16' },
      },
    ],
  }

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>{t('revenue')}</Typography.Title>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <ChartCard title="收益构成" style={{ flex: 1, minWidth: 400 }}>
          <ReactECharts
            option={pieOption}
            theme={theme === 'dark' ? 'dark' : undefined}
            style={{ height: 350 }}
          />
        </ChartCard>
        <ChartCard title="月度收益趋势" style={{ flex: 1, minWidth: 400 }}>
          <ReactECharts
            option={lineOption}
            theme={theme === 'dark' ? 'dark' : undefined}
            style={{ height: 350 }}
          />
        </ChartCard>
      </div>
    </div>
  )
}
