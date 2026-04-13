import { useCallback, useEffect, useState } from 'react'
import { Button, Card, Checkbox, DatePicker, Empty, message, Space, Spin, Table } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import dayjs, { type Dayjs } from 'dayjs'
import { useAppStore } from '@/store/appStore'
import { useTranslation } from 'react-i18next'
import {
  getIndicators,
  getCustomReport,
  type IndicatorItem,
  type CustomReportData,
} from '@/api/report'
import { getChartOption, getTableColumns } from './config'

const { RangePicker } = DatePicker

export default function CustomReport() {
  const { t } = useTranslation()
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
    message.success(t('report.exportCustomMock'))
  }

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
    <div>
      <Card title={t('report.custom')} style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('report.selectIndicators')}</div>
            <Checkbox.Group
              value={selected}
              onChange={(vals) => setSelected(vals as string[])}
              options={indicators.map((i) => ({ label: i.label, value: i.key }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>{t('report.timeRange')}</div>
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
              {t('report.preview')}
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport} disabled={!data}>
              {t('report.export')}
            </Button>
          </Space>
        </Space>
      </Card>

      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }} />
      ) : data ? (
        <>
          <Card title={t('report.trendChart')} style={{ marginBottom: 16 }}>
            <ReactECharts
              option={getChartOption(t, indicators, selected, data)}
              theme={theme === 'dark' ? 'dark' : undefined}
              style={{ height: 400 }}
            />
          </Card>
          <Card title={t('report.dataTable')}>
            <Table
              dataSource={tableData}
              columns={getTableColumns(t, indicators, selected)}
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
