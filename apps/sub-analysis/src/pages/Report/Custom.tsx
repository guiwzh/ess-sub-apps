import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Empty,
  message,
  Space,
  Spin,
  Table,
} from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import dayjs, { type Dayjs } from 'dayjs'
import { useAppStore } from '@/store/appStore'
import {
  getIndicators,
  getCustomReport,
  type IndicatorItem,
  type CustomReportData,
} from '@/api/report'

const { RangePicker } = DatePicker

const colorPalette = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#f5222d', '#13c2c2', '#eb2f96']

export default function CustomReport() {
  const theme = useAppStore((s) => s.theme)
  const [indicators, setIndicators] = useState<IndicatorItem[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(6, 'month'),
    dayjs(),
  ])
  const [data, setData] = useState<CustomReportData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getIndicators().then(({ data: res }) => {
      if (res.code === 0) {
        setIndicators(res.data)
        setSelected(res.data.slice(0, 2).map((i) => i.key))
      }
    })
  }, [])

  const fetchReport = useCallback(async () => {
    if (selected.length === 0) return
    setLoading(true)
    try {
      const { data: res } = await getCustomReport({
        indicators: selected,
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      })
      if (res.code === 0) setData(res.data)
    } finally {
      setLoading(false)
    }
  }, [selected, dateRange])

  const handlePreview = () => {
    fetchReport()
  }

  const handleExport = () => {
    message.success('自定义报表导出触发（Mock）')
  }

  const chartOption = data
    ? {
        tooltip: { trigger: 'axis' as const },
        legend: {
          data: selected.map(
            (k) => indicators.find((i) => i.key === k)?.label ?? k,
          ),
        },
        xAxis: { type: 'category' as const, data: data.labels },
        yAxis: { type: 'value' as const },
        series: selected.map((k, idx) => ({
          name: indicators.find((i) => i.key === k)?.label ?? k,
          type: 'line' as const,
          data: data.series[k] ?? [],
          smooth: true,
          itemStyle: { color: colorPalette[idx % colorPalette.length] },
        })),
      }
    : null

  const tableColumns = [
    { title: '时间', dataIndex: 'label', key: 'label' },
    ...selected.map((k) => ({
      title: indicators.find((i) => i.key === k)?.label ?? k,
      dataIndex: k,
      key: k,
    })),
  ]

  const tableData = data
    ? data.labels.map((label, idx) => {
        const row: Record<string, unknown> = { key: idx, label }
        selected.forEach((k) => {
          row[k] = data.series[k]?.[idx] ?? '-'
        })
        return row
      })
    : []

  return (
    <div style={{ padding: 24 }}>
      <Card title="自定义报表" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>选择指标：</div>
            <Checkbox.Group
              value={selected}
              onChange={(vals) => setSelected(vals as string[])}
              options={indicators.map((i) => ({ label: i.label, value: i.key }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>时间范围：</div>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]])
                }
              }}
            />
          </div>
          <Space>
            <Button type="primary" onClick={handlePreview} disabled={selected.length === 0}>
              预览
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport} disabled={!data}>
              导出
            </Button>
          </Space>
        </Space>
      </Card>

      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }} />
      ) : data ? (
        <>
          <Card title="趋势图表" style={{ marginBottom: 16 }}>
            {chartOption && (
              <ReactECharts
                option={chartOption}
                theme={theme === 'dark' ? 'dark' : undefined}
                style={{ height: 400 }}
              />
            )}
          </Card>
          <Card title="数据表格">
            <Table
              dataSource={tableData}
              columns={tableColumns}
              size="small"
              pagination={false}
              scroll={{ y: 300 }}
            />
          </Card>
        </>
      ) : (
        <Empty description="请选择指标并点击预览" />
      )}
    </div>
  )
}
