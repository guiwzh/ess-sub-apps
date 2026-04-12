import { useCallback, useEffect, useState } from 'react'
import { Typography, Radio, Select, Space, Spin, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import ChartCard from '@/components/ChartCard'
import DateRangePicker, { type RangePreset } from '@/components/DateRangePicker'
import { useAppStore } from '@/store/appStore'
import { getEnergyStats, type EnergyStatsData } from '@/api/analysis'

type Dimension = 'day' | 'month' | 'year'

const stationOptions = [
  { label: '全部站点', value: '' },
  { label: '储能站点A', value: '储能站点A' },
  { label: '储能站点B', value: '储能站点B' },
  { label: '储能站点C', value: '储能站点C' },
]

/** 充放电统计 — 可切换维度 + 时间范围 + 站点 */
export default function EnergyStats() {
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)
  const [dimension, setDimension] = useState<Dimension>('month')
  const [station, setStation] = useState('')
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [data, setData] = useState<EnergyStatsData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await getEnergyStats({
        dimension,
        station: station || undefined,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
      })
      if (res.code === 0) setData(res.data)
    } finally {
      setLoading(false)
    }
  }, [dimension, station, dateRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const option = data
    ? {
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
      }
    : null

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>{t('energyStats')}</Typography.Title>
      <Space wrap style={{ marginBottom: 16 }}>
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          size="small"
          value={dimension}
          onChange={(e) => setDimension(e.target.value)}
          options={[
            { label: '日', value: 'day' },
            { label: '月', value: 'month' },
            { label: '年', value: 'year' },
          ]}
        />
        <Select
          size="small"
          style={{ width: 140 }}
          options={stationOptions}
          value={station}
          onChange={setStation}
        />
        <DateRangePicker
          defaultPreset="month"
          onChange={(range: [string, string], _preset: RangePreset) => setDateRange(range)}
        />
      </Space>
      <ChartCard title={t('energyStats')}>
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
