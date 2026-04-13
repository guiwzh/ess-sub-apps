import { useEffect, useState } from 'react'
import {
  Card,
  DatePicker,
  Descriptions,
  Segmented,
  Spin,
  Statistic,
  Table,
  Row,
  Col,
  Button,
  message,
} from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import dayjs, { type Dayjs } from 'dayjs'
import { useAppStore } from '@/store/appStore'
import { useTranslation } from 'react-i18next'
import {
  getDailyReport,
  getMonthlyReport,
  type DailyReportData,
  type MonthlyReportData,
} from '@/api/report'
import {
  getMonthlyDescriptionItems,
  getDailySummaryColumns,
  getHourlyChartOption,
} from './config'

type ReportType = 'daily' | 'monthly'

export default function ReportPage() {
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)
  const [type, setType] = useState<ReportType>('daily')
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [loading, setLoading] = useState(false)
  const [dailyData, setDailyData] = useState<DailyReportData | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyReportData | null>(null)

  useEffect(() => {
    setLoading(true)
    if (type === 'daily') {
      getDailyReport({ date: date.format('YYYY-MM-DD') })
        .then(({ data: res }) => {
          if (res.code === 0) setDailyData(res.data)
        })
        .finally(() => setLoading(false))
    } else {
      getMonthlyReport({ month: date.format('YYYY-MM') })
        .then(({ data: res }) => {
          if (res.code === 0) setMonthlyData(res.data)
        })
        .finally(() => setLoading(false))
    }
  }, [type, date])

  const handleExport = (format: 'pdf' | 'excel') => {
    message.success(t('report.exportMock', { format: format.toUpperCase() }))
  }

  const renderDaily = () => {
    if (!dailyData) return null
    const { summary, hourly } = dailyData
    return (
      <>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={4}>
            <Statistic title={t('report.totalCharge')} value={summary.totalCharge} suffix="kWh" />
          </Col>
          <Col span={4}>
            <Statistic
              title={t('report.totalDischarge')}
              value={summary.totalDischarge}
              suffix="kWh"
            />
          </Col>
          <Col span={4}>
            <Statistic title={t('report.peakPower')} value={summary.peakPower} suffix="kW" />
          </Col>
          <Col span={4}>
            <Statistic
              title={t('report.avgEfficiency')}
              value={summary.avgEfficiency}
              suffix="%"
            />
          </Col>
          <Col span={4}>
            <Statistic
              title={t('report.dailyRevenue')}
              value={summary.revenue}
              suffix={t('revenue.unit')}
            />
          </Col>
        </Row>
        <Card title={t('report.hourlyData')} style={{ marginBottom: 16 }}>
          <ReactECharts
            theme={theme === 'dark' ? 'dark' : undefined}
            style={{ height: 350 }}
            option={getHourlyChartOption(t, hourly)}
          />
        </Card>
      </>
    )
  }

  const renderMonthly = () => {
    if (!monthlyData) return null
    const { summary, daily } = monthlyData
    return (
      <>
        <Descriptions
          bordered
          column={5}
          style={{ marginBottom: 16 }}
          items={getMonthlyDescriptionItems(t, summary)}
        />
        <Card title={t('report.dailySummary')} style={{ marginBottom: 16 }}>
          <Table
            dataSource={daily}
            rowKey="date"
            size="small"
            pagination={false}
            scroll={{ y: 400 }}
            columns={getDailySummaryColumns(t)}
          />
        </Card>
      </>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Segmented
          options={[
            { label: t('report.daily'), value: 'daily' },
            { label: t('report.monthly'), value: 'monthly' },
          ]}
          value={type}
          onChange={(v) => setType(v as ReportType)}
        />
        <DatePicker
          picker={type === 'daily' ? 'date' : 'month'}
          value={date}
          onChange={(d) => d && setDate(d)}
        />
        <Button icon={<DownloadOutlined />} onClick={() => handleExport('pdf')}>
          {t('report.exportPdf')}
        </Button>
        <Button icon={<DownloadOutlined />} onClick={() => handleExport('excel')}>
          {t('report.exportExcel')}
        </Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }} />
      ) : type === 'daily' ? (
        renderDaily()
      ) : (
        renderMonthly()
      )}
    </div>
  )
}
