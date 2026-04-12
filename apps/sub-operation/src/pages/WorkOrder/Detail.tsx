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
import { getWorkOrderDetail, type WorkOrderDetail as WODetailType } from '@/api/workorder'

const statusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待派发', color: 'default' },
  processing: { text: '处理中', color: 'processing' },
  completed: { text: '已完成', color: 'success' },
  closed: { text: '已关闭', color: 'default' },
}

const priorityMap: Record<string, { text: string; color: string }> = {
  high: { text: '高', color: 'red' },
  medium: { text: '中', color: 'orange' },
  low: { text: '低', color: 'blue' },
}

export default function WorkOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
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
    return <Typography.Text type="danger">工单不存在</Typography.Text>
  }

  const s = statusMap[detail.status]
  const p = priorityMap[detail.priority]

  return (
    <div style={{ padding: 24 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        返回
      </Button>

      <Typography.Title level={4}>{detail.title}</Typography.Title>

      <Card title="工单信息" style={{ marginBottom: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="工单编号">{detail.id}</Descriptions.Item>
          <Descriptions.Item label="状态">
            {s ? <Tag color={s.color}>{s.text}</Tag> : detail.status}
          </Descriptions.Item>
          <Descriptions.Item label="优先级">
            {p ? <Tag color={p.color}>{p.text}</Tag> : detail.priority}
          </Descriptions.Item>
          <Descriptions.Item label="类型">{detail.type}</Descriptions.Item>
          <Descriptions.Item label="关联设备">{detail.deviceCode}</Descriptions.Item>
          <Descriptions.Item label="站点">{detail.station}</Descriptions.Item>
          <Descriptions.Item label="负责人">{detail.assignee}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{detail.createdAt}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="处理流程" style={{ marginBottom: 16 }}>
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

      <Card title="添加备注" style={{ marginBottom: 16 }}>
        <Input.TextArea
          rows={3}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="输入处理备注..."
        />
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={() => {
            message.success('备注已提交')
            setRemark('')
          }}
        >
          提交备注
        </Button>
      </Card>

      <Card title="附件">
        <Upload
          action=""
          beforeUpload={() => {
            message.info('附件上传功能（Mock）')
            return false
          }}
        >
          <Button icon={<UploadOutlined />}>上传附件</Button>
        </Upload>
      </Card>
    </div>
  )
}
