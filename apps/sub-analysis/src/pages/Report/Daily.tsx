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
import {
  getDailyReport,
  getMonthlyReport,
  type DailyReportData,
  type MonthlyReportData,
} from '@/api/report'

type ReportType = '日报' | '月报'

export default function ReportPage() {
  const theme = useAppStore((s) => s.theme)
  const [type, setType] = useState<ReportType>('日报')
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [loading, setLoading] = useState(false)
  const [dailyData, setDailyData] = useState<DailyReportData | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyReportData | null>(null)

  useEffect(() => {
    setLoading(true)
    if (type === '日报') {
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
    message.success(`${type}导出 ${format.toUpperCase()} 触发（Mock）`)
  }

  const renderDaily = () => {
    if (!dailyData) return null
    const { summary, hourly } = dailyData
    return (
      <>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={4}>
            <Statistic title="总充电量" value={summary.totalCharge} suffix="kWh" />
          </Col>
          <Col span={4}>
            <Statistic title="总放电量" value={summary.totalDischarge} suffix="kWh" />
          </Col>
          <Col span={4}>
            <Statistic title="峰值功率" value={summary.peakPower} suffix="kW" />
          </Col>
          <Col span={4}>
            <Statistic title="平均效率" value={summary.avgEfficiency} suffix="%" />
          </Col>
          <Col span={4}>
            <Statistic title="当日收益" value={summary.revenue} suffix="万元" />
          </Col>
        </Row>
        <Card title="逐时数据" style={{ marginBottom: 16 }}>
          <ReactECharts
            theme={theme === 'dark' ? 'dark' : undefined}
            style={{ height: 350 }}
            option={{
              tooltip: { trigger: 'axis' },
              legend: { data: ['充电量', '放电量', '功率'] },
              xAxis: { type: 'category', data: hourly.map((h) => h.hour) },
              yAxis: [
                { type: 'value', name: 'kWh' },
                { type: 'value', name: 'kW' },
              ],
              series: [
                { name: '充电量', type: 'bar', data: hourly.map((h) => h.charge) },
                { name: '放电量', type: 'bar', data: hourly.map((h) => h.discharge) },
                {
                  name: '功率',
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
          <Descriptions.Item label="总充电量">{summary.totalCharge} kWh</Descriptions.Item>
          <Descriptions.Item label="总放电量">{summary.totalDischarge} kWh</Descriptions.Item>
          <Descriptions.Item label="峰值功率">{summary.peakPower} kW</Descriptions.Item>
          <Descriptions.Item label="平均效率">{summary.avgEfficiency}%</Descriptions.Item>
          <Descriptions.Item label="月收益">{summary.revenue} 万元</Descriptions.Item>
        </Descriptions>
        <Card title="日度汇总" style={{ marginBottom: 16 }}>
          <Table
            dataSource={daily}
            rowKey="date"
            size="small"
            pagination={false}
            scroll={{ y: 400 }}
            columns={[
              { title: '日期', dataIndex: 'date', width: 100 },
              { title: '充电量 (kWh)', dataIndex: 'charge', width: 120 },
              { title: '放电量 (kWh)', dataIndex: 'discharge', width: 120 },
              { title: '收益 (万元)', dataIndex: 'revenue', width: 120 },
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
          options={['日报', '月报']}
          value={type}
          onChange={(v) => setType(v as ReportType)}
        />
        <DatePicker
          picker={type === '日报' ? 'date' : 'month'}
          value={date}
          onChange={(d) => d && setDate(d)}
        />
        <Button icon={<DownloadOutlined />} onClick={() => handleExport('pdf')}>
          导出 PDF
        </Button>
        <Button icon={<DownloadOutlined />} onClick={() => handleExport('excel')}>
          导出 Excel
        </Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }} />
      ) : type === '日报' ? (
        renderDaily()
      ) : (
        renderMonthly()
      )}
    </div>
  )
}
