import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/appStore'

export default function Dashboard() {
  const { t } = useTranslation()
  const currentStation = useAppStore((s) => s.currentStation)

  return (
    <div>
      <Typography.Title level={3}>{t('dashboard')}</Typography.Title>
      {currentStation && (
        <Typography.Text type="secondary">{t('currentStation')}: {currentStation}</Typography.Text>
      )}
      <Card style={{ marginTop: 16 }}>
        <p>{t('welcome')}</p>
      </Card>
    </div>
  )
}
