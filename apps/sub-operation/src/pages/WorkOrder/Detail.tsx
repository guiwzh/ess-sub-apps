import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Descriptions,
  Tag,
  Timeline,
  Typography,
  Spin,
  Button,
  Input,
  message,
  Upload,
} from 'antd'
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { getWorkOrderDetail, type WorkOrderDetail as WODetailType } from '@/api/workorder'

export default function WorkOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [detail, setDetail] = useState<WODetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [remark, setRemark] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getWorkOrderDetail(id)
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
    return <Typography.Text type="danger">{t('workorder.notFound')}</Typography.Text>
  }

  const statusMap: Record<string, { text: string; color: string }> = {
    pending: { text: t('workorder.status.pending'), color: 'default' },
    processing: { text: t('workorder.status.processing'), color: 'processing' },
    completed: { text: t('workorder.status.completed'), color: 'success' },
    closed: { text: t('workorder.status.closed'), color: 'default' },
  }

  const priorityMap: Record<string, { text: string; color: string }> = {
    high: { text: t('workorder.priority.high'), color: 'red' },
    medium: { text: t('workorder.priority.medium'), color: 'orange' },
    low: { text: t('workorder.priority.low'), color: 'blue' },
  }

  const s = statusMap[detail.status]
  const p = priorityMap[detail.priority]

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        {t('back')}
      </Button>

      <Typography.Title level={4}>{detail.title}</Typography.Title>

      <Card title={t('workorder.info')} style={{ marginBottom: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label={t('workorder.id')}>{detail.id}</Descriptions.Item>
          <Descriptions.Item label={t('workorder.status')}>
            {s ? <Tag color={s.color}>{s.text}</Tag> : detail.status}
          </Descriptions.Item>
          <Descriptions.Item label={t('workorder.priority')}>
            {p ? <Tag color={p.color}>{p.text}</Tag> : detail.priority}
          </Descriptions.Item>
          <Descriptions.Item label={t('workorder.type')}>{detail.type}</Descriptions.Item>
          <Descriptions.Item label={t('workorder.device')}>{detail.deviceCode}</Descriptions.Item>
          <Descriptions.Item label={t('workorder.station')}>{detail.station}</Descriptions.Item>
          <Descriptions.Item label={t('workorder.assignee')}>{detail.assignee}</Descriptions.Item>
          <Descriptions.Item label={t('workorder.createdAt')}>{detail.createdAt}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t('workorder.timeline')} style={{ marginBottom: 16 }}>
        <Timeline
          items={detail.timeline.map((item) => ({
            children: (
              <div>
                <Typography.Text strong>{item.action}</Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  {item.time} — {item.operator}
                </Typography.Text>
                <br />
                <Typography.Text>{item.remark}</Typography.Text>
              </div>
            ),
          }))}
        />
      </Card>

      <Card title={t('workorder.addRemark')} style={{ marginBottom: 16 }}>
        <Input.TextArea
          rows={3}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder={t('workorder.remarkPlaceholder')}
        />
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => {
            message.success(t('workorder.remarkSubmitted'))
            setRemark('')
          }}
        >
          {t('workorder.submitRemark')}
        </Button>
      </Card>

      <Card title={t('workorder.attachments')}>
        <Upload
          action=""
          beforeUpload={() => {
            message.info(t('workorder.uploadMock'))
            return false
          }}
        >
          <Button icon={<UploadOutlined />}>{t('workorder.upload')}</Button>
        </Upload>
      </Card>
    </div>
  )
}
