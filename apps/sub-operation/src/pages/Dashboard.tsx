import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/appStore'

export default function Dashboard() {
  const { t } = useTranslation()
  const currentStation = useAppStore((s) => s.currentStation)

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>{t('dashboard')}</Typography.Title>
      {currentStation && (
        <Typography.Text type="secondary">当前站点: {currentStation}</Typography.Text>
      )}
      <Card style={{ marginTop: 16 }}>
        <p>{t('welcome')}</p>
      </Card>
    </div>
  )
}
