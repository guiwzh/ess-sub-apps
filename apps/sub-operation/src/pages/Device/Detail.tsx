import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Typography,
  Spin,
  Button,
  Row,
  Col,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { getDeviceDetail, type DeviceDetail as DeviceDetailType } from '@/api/operation'
import { useAppStore } from '@/store/appStore'

const statusMap: Record<string, { text: string; color: string }> = {
  running: { text: '运行中', color: 'green' },
  standby: { text: '待机', color: 'blue' },
  offline: { text: '离线', color: 'red' },
}

export default function DeviceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useAppStore((s) => s.theme)
  const [detail, setDetail] = useState<DeviceDetailType | null>(null)
  const [loading, setLoading] = useState(true)

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
    return <Typography.Text type="danger">设备不存在</Typography.Text>
  }

  const chartOption = {
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['功率 (kW)', '温度 (℃)'] },
    xAxis: { type: 'category' as const, data: detail.historyData.timestamps },
    yAxis: [
      { type: 'value' as const, name: 'kW' },
      { type: 'value' as const, name: '℃' },
    ],
    series: [
      {
        name: '功率 (kW)',
        type: 'line',
        data: detail.historyData.power,
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '温度 (℃)',
        type: 'line',
        yAxisIndex: 1,
        data: detail.historyData.temperature,
        smooth: true,
        itemStyle: { color: '#f5222d' },
      },
    ],
  }

  const maintenanceColumns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      render: (val: string) => (
        <Tag color={val === '正常' ? 'green' : 'orange'}>{val}</Tag>
      ),
    },
  ]

  const s = statusMap[detail.status]

  return (
    <div style={{ padding: 24 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        返回
      </Button>

      <Typography.Title level={4}>
        {detail.name} ({detail.code})
      </Typography.Title>

      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="设备编号">{detail.code}</Descriptions.Item>
          <Descriptions.Item label="设备名称">{detail.name}</Descriptions.Item>
          <Descriptions.Item label="设备类型">{detail.type}</Descriptions.Item>
          <Descriptions.Item label="状态">
            {s ? <Tag color={s.color}>{s.text}</Tag> : detail.status}
          </Descriptions.Item>
          <Descriptions.Item label="额定功率">{detail.ratedPower}</Descriptions.Item>
          <Descriptions.Item label="所属站点">{detail.station}</Descriptions.Item>
          <Descriptions.Item label="安装日期">{detail.installDate}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 运行参数 */}
      <Card title="实时运行参数" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="电压">{detail.runningParams.voltage} V</Descriptions.Item>
              <Descriptions.Item label="电流">{detail.runningParams.current} A</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={6}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="功率">{detail.runningParams.power} kW</Descriptions.Item>
              <Descriptions.Item label="温度">{detail.runningParams.temperature} ℃</Descriptions.Item>
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
      <Card title="历史数据曲线" style={{ marginBottom: 16 }}>
        <ReactECharts
          option={chartOption}
          theme={theme === 'dark' ? 'dark' : undefined}
          style={{ height: 350 }}
        />
      </Card>

      {/* 维保记录 */}
      <Card title="维保记录">
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
