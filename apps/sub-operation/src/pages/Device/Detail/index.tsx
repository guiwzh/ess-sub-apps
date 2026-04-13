import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Table, Typography, Spin, Button, Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import { getDeviceDetail, type DeviceDetail as DeviceDetailType } from '@/api/operation'
import { useAppStore } from '@/store/appStore'
import {
  getBasicInfoItems,
  getRunningParamsItems,
  getChartOption,
  getMaintenanceColumns,
} from './config'

export default function DeviceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
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
    return <Typography.Text type="danger">{t('device.notFound')}</Typography.Text>
  }

  const runningParams = getRunningParamsItems(t, detail.runningParams)

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

      <Card title={t('device.basicInfo')} style={{ marginBottom: 16 }}>
        <Descriptions column={3} items={getBasicInfoItems(t, detail)} />
      </Card>

      <Card title={t('device.runningParams')} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Descriptions column={1} size="small" items={runningParams.left} />
          </Col>
          <Col span={6}>
            <Descriptions column={1} size="small" items={runningParams.right} />
          </Col>
          {runningParams.battery && (
            <Col span={6}>
              <Descriptions column={1} size="small" items={runningParams.battery} />
            </Col>
          )}
        </Row>
      </Card>

      <Card title={t('device.historyCurve')} style={{ marginBottom: 16 }}>
        <ReactECharts
          option={getChartOption(t, detail)}
          theme={theme === 'dark' ? 'dark' : undefined}
          style={{ height: 350 }}
        />
      </Card>

      <Card title={t('device.maintenance')}>
        <Table
          columns={getMaintenanceColumns(t)}
          dataSource={detail.maintenanceRecords}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}
