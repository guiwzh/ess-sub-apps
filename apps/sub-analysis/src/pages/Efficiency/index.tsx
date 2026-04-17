import { getEfficiency, type EfficiencyData } from '@/api/analysis'
import ChartCard from '@/components/ChartCard'
import DateRangePicker, { type RangePreset } from '@/components/DateRangePicker'
import { useAppStore } from '@/store/appStore'
import { Empty, Space, Spin, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/** 能量效率分析 — 折线图 + 时间范围筛选 */
const Efficiency = () => {
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [data, setData] = useState<EfficiencyData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await getEfficiency({
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
      })
      if (res.code === 0) setData(res.data)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const option = data
    ? {
        tooltip: { trigger: 'axis' as const },
        xAxis: { type: 'category' as const, data: data.labels },
        yAxis: { type: 'value' as const, name: '%', max: 100 },
        series: [
          {
            name: t('efficiencyRate'),
            type: 'line',
            data: data.efficiency,
            smooth: true,
            areaStyle: { opacity: 0.2 },
            itemStyle: { color: '#722ed1' },
          },
        ],
      }
    : null

  return (
    <div>
      <Typography.Title level={3}>{t('efficiency')}</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <DateRangePicker
          defaultPreset="month"
          onChange={(range: [string, string], _preset: RangePreset) => setDateRange(range)}
        />
      </Space>
      <ChartCard title={t('efficiencyRate')}>
        {loading ? (
          <Spin style={{ display: 'flex', justifyContent: 'center', padding: 80 }} />
        ) : option ? (
          <ReactECharts
            option={option}
            theme={theme === 'dark' ? 'dark' : undefined}
            style={{ height: 400 }}
          />
        ) : (
          <Empty />
        )}
      </ChartCard>
    </div>
  )
}

export default Efficiency
