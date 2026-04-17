import { getBatteryHealth, type BatteryHealthData } from '@/api/analysis'
import ChartCard from '@/components/ChartCard'
import DateRangePicker, { type RangePreset } from '@/components/DateRangePicker'
import { useAppStore } from '@/store/appStore'
import { Empty, message, Space, Spin, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/** SOC/SOH 趋势分析 — 双折线图 + 时间范围筛选 */
const BatteryHealth = () => {
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [data, setData] = useState<BatteryHealthData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await getBatteryHealth({
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
      })
      if (res.code === 0) setData(res.data)
    } catch {
      message.error(t('fetchFailed'))
    } finally {
      setLoading(false)
    }
  }, [dateRange, t])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const option = data
    ? {
        tooltip: { trigger: 'axis' as const },
        legend: { data: ['SOC (%)', 'SOH (%)'] },
        xAxis: { type: 'category' as const, data: data.labels },
        yAxis: { type: 'value' as const, name: '%', max: 100 },
        series: [
          {
            name: 'SOC (%)',
            type: 'line',
            data: data.soc,
            smooth: true,
            itemStyle: { color: '#1890ff' },
          },
          {
            name: 'SOH (%)',
            type: 'line',
            data: data.soh,
            smooth: true,
            itemStyle: { color: '#f5222d' },
          },
        ],
      }
    : null

  return (
    <div>
      <Typography.Title level={3}>{t('batteryHealth')}</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <DateRangePicker
          defaultPreset="month"
          onChange={(range: [string, string], _preset: RangePreset) => setDateRange(range)}
        />
      </Space>
      <ChartCard title={t('battery.socSohTrend')}>
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

export default BatteryHealth
