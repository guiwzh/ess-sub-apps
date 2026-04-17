import { getWorkOrderDetail, type WorkOrderDetail as WODetailType } from '@/api/workorder'
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Descriptions,
  Input,
  message,
  Spin,
  Timeline,
  Typography,
  Upload,
} from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { getDescriptionItems } from './config'

const WorkOrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [detail, setDetail] = useState<WODetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [remark, setRemark] = useState('')

  useEffect(() => {
    if (!id) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    getWorkOrderDetail(id)
      .then(({ data: res }) => {
        if (res.code === 0) setDetail(res.data)
      })
      .catch(() => message.error(t('fetchFailed')))
      .finally(() => setLoading(false))
  }, [id, t])

  if (loading) {
    return (
      <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />
    )
  }

  if (!detail) {
    return <Typography.Text type="danger">{t('workorder.notFound')}</Typography.Text>
  }

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
        <Descriptions column={3} items={getDescriptionItems(t, detail)} />
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
            // TODO: 接入真实备注提交接口
            message.info(t('workorder.remarkTodo'))
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
            // TODO: 接入真实文件上传接口
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

export default WorkOrderDetail
