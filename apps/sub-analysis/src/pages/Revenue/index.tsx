import { getRevenue, type RevenueData } from '@/api/analysis'
import ChartCard from '@/components/ChartCard'
import DateRangePicker, { type RangePreset } from '@/components/DateRangePicker'
import { useAppStore } from '@/store/appStore'
import { Empty, Space, Spin, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/** 收益分析 — 饼图 + 折线图 + 时间范围筛选 */
const Revenue = () => {
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await getRevenue({
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

  const pieOption = data
    ? {
        tooltip: { trigger: 'item' as const },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: data.composition,
          },
        ],
      }
    : null

  const lineOption = data
    ? {
        tooltip: { trigger: 'axis' as const },
        xAxis: { type: 'category' as const, data: data.monthly.labels },
        yAxis: { type: 'value' as const, name: t('revenue.unit') },
        series: [
          {
            name: t('revenue.monthly'),
            type: 'line',
            data: data.monthly.values,
            smooth: true,
            itemStyle: { color: '#fa8c16' },
          },
        ],
      }
    : null

  return (
    <div>
      <Typography.Title level={3}>{t('revenue')}</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <DateRangePicker
          defaultPreset="month"
          onChange={(range: [string, string], _preset: RangePreset) => setDateRange(range)}
        />
      </Space>
      {loading ? (
        <Spin style={{ display: 'flex', justifyContent: 'center', padding: 80 }} />
      ) : data ? (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <ChartCard title={t('revenue.composition')} style={{ flex: 1, minWidth: 400 }}>
            {pieOption ? (
              <ReactECharts
                option={pieOption}
                theme={theme === 'dark' ? 'dark' : undefined}
                style={{ height: 350 }}
              />
            ) : (
              <Empty />
            )}
          </ChartCard>
          <ChartCard title={t('revenue.monthlyTrend')} style={{ flex: 1, minWidth: 400 }}>
            {lineOption ? (
              <ReactECharts
                option={lineOption}
                theme={theme === 'dark' ? 'dark' : undefined}
                style={{ height: 350 }}
              />
            ) : (
              <Empty />
            )}
          </ChartCard>
        </div>
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default Revenue
