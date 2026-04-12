import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Table, Tag, Typography, Spin, Button, Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import { getDeviceDetail, type DeviceDetail as DeviceDetailType } from '@/api/operation'
import { useAppStore } from '@/store/appStore'

export default function DeviceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useAppStore((s) => s.theme)
  const [detail, setDetail] = useState<DeviceDetailType | null>(null)
  const [loading, setLoading] = useState(true)

  const statusMap: Record<string, { text: string; color: string }> = {
    running: { text: t('device.status.running'), color: 'green' },
    standby: { text: t('device.status.standby'), color: 'blue' },
    offline: { text: t('device.status.offline'), color: 'red' },
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getDeviceDetail(id)
      .then(({ data: res }) => {
        if (res.code === 0) setDetail(res.data)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />
    )
  }

  if (!detail) {
    return <Typography.Text type="danger">{t('device.notFound')}</Typography.Text>
  }

  const chartOption = {
    tooltip: { trigger: 'axis' as const },
    legend: { data: [t('device.powerKw'), t('device.tempC')] },
    xAxis: { type: 'category' as const, data: detail.historyData.timestamps },
    yAxis: [
      { type: 'value' as const, name: 'kW' },
      { type: 'value' as const, name: '℃' },
    ],
    series: [
      {
        name: t('device.powerKw'),
        type: 'line',
        data: detail.historyData.power,
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
      {
        name: t('device.tempC'),
        type: 'line',
        yAxisIndex: 1,
        data: detail.historyData.temperature,
        smooth: true,
        itemStyle: { color: '#f5222d' },
      },
    ],
  }

  const maintenanceColumns = [
    { title: t('device.date'), dataIndex: 'date', key: 'date' },
    { title: t('device.maintType'), dataIndex: 'type', key: 'type' },
    { title: t('device.operator'), dataIndex: 'operator', key: 'operator' },
    {
      title: t('device.result'),
      dataIndex: 'result',
      key: 'result',
      render: (val: string) => <Tag color={val === '正常' ? 'green' : 'orange'}>{val}</Tag>,
    },
  ]

  const s = statusMap[detail.status]

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        {t('back')}
      </Button>

      <Typography.Title level={4}>
        {detail.name} ({detail.code})
      </Typography.Title>

      {/* 基本信息 */}
      <Card title={t('device.basicInfo')} style={{ marginBottom: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label={t('device.code')}>{detail.code}</Descriptions.Item>
          <Descriptions.Item label={t('device.name')}>{detail.name}</Descriptions.Item>
          <Descriptions.Item label={t('device.type')}>{detail.type}</Descriptions.Item>
          <Descriptions.Item label={t('device.status')}>
            {s ? <Tag color={s.color}>{s.text}</Tag> : detail.status}
          </Descriptions.Item>
          <Descriptions.Item label={t('device.ratedPower')}>{detail.ratedPower}</Descriptions.Item>
          <Descriptions.Item label={t('device.station')}>{detail.station}</Descriptions.Item>
          <Descriptions.Item label={t('device.installDate')}>{detail.installDate}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 运行参数 */}
      <Card title={t('device.runningParams')} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('device.voltage')}>{detail.runningParams.voltage} V</Descriptions.Item>
              <Descriptions.Item label={t('device.current')}>{detail.runningParams.current} A</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={6}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('device.power')}>{detail.runningParams.power} kW</Descriptions.Item>
              <Descriptions.Item label={t('device.temperature')}>
                {detail.runningParams.temperature} ℃
              </Descriptions.Item>
            </Descriptions>
          </Col>
          {detail.runningParams.soc !== undefined && (
            <Col span={6}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="SOC">{detail.runningParams.soc}%</Descriptions.Item>
                <Descriptions.Item label="SOH">{detail.runningParams.soh}%</Descriptions.Item>
              </Descriptions>
            </Col>
          )}
        </Row>
      </Card>

      {/* 历史数据曲线 */}
      <Card title={t('device.historyCurve')} style={{ marginBottom: 16 }}>
        <ReactECharts
          option={chartOption}
          theme={theme === 'dark' ? 'dark' : undefined}
          style={{ height: 350 }}
        />
      </Card>

      {/* 维保记录 */}
      <Card title={t('device.maintenance')}>
        <Table
          columns={maintenanceColumns}
          dataSource={detail.maintenanceRecords}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}
