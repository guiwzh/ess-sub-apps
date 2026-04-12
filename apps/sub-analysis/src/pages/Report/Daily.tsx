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
            <Statistic title={t('report.totalDischarge')} value={summary.totalDischarge} suffix="kWh" />
          </Col>
          <Col span={4}>
            <Statistic title={t('report.peakPower')} value={summary.peakPower} suffix="kW" />
          </Col>
          <Col span={4}>
            <Statistic title={t('report.avgEfficiency')} value={summary.avgEfficiency} suffix="%" />
          </Col>
          <Col span={4}>
            <Statistic title={t('report.dailyRevenue')} value={summary.revenue} suffix={t('revenue.unit')} />
          </Col>
        </Row>
        <Card title={t('report.hourlyData')} style={{ marginBottom: 16 }}>
          <ReactECharts
            theme={theme === 'dark' ? 'dark' : undefined}
            style={{ height: 350 }}
            option={{
              tooltip: { trigger: 'axis' },
              legend: { data: [t('report.charge'), t('report.discharge'), t('report.power')] },
              xAxis: { type: 'category', data: hourly.map((h) => h.hour) },
              yAxis: [
                { type: 'value', name: 'kWh' },
                { type: 'value', name: 'kW' },
              ],
              series: [
                { name: t('report.charge'), type: 'bar', data: hourly.map((h) => h.charge) },
                { name: t('report.discharge'), type: 'bar', data: hourly.map((h) => h.discharge) },
                {
                  name: t('report.power'),
                  type: 'line',
                  yAxisIndex: 1,
                  data: hourly.map((h) => h.power),
                  smooth: true,
                },
              ],
            }}
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
        <Descriptions bordered column={5} style={{ marginBottom: 16 }}>
          <Descriptions.Item label={t('report.totalCharge')}>{summary.totalCharge} kWh</Descriptions.Item>
          <Descriptions.Item label={t('report.totalDischarge')}>{summary.totalDischarge} kWh</Descriptions.Item>
          <Descriptions.Item label={t('report.peakPower')}>{summary.peakPower} kW</Descriptions.Item>
          <Descriptions.Item label={t('report.avgEfficiency')}>{summary.avgEfficiency}%</Descriptions.Item>
          <Descriptions.Item label={t('report.monthlyRevenue')}>{summary.revenue} {t('revenue.unit')}</Descriptions.Item>
        </Descriptions>
        <Card title={t('report.dailySummary')} style={{ marginBottom: 16 }}>
          <Table
            dataSource={daily}
            rowKey="date"
            size="small"
            pagination={false}
            scroll={{ y: 400 }}
            columns={[
              { title: t('report.date'), dataIndex: 'date', width: 100 },
              { title: t('report.chargeKwh'), dataIndex: 'charge', width: 120 },
              { title: t('report.dischargeKwh'), dataIndex: 'discharge', width: 120 },
              { title: t('report.revenueWan'), dataIndex: 'revenue', width: 120 },
            ]}
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
