import { Button, Card, Form, Input, message, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import request from '@/utils/request'

interface LoginValues {
  username: string
  password: string
}

/**
 * 独立运行时的开发登录页
 * wujie 模式下不会用到这个页面（Token 由主应用传入）
 */
export default function DevLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const onFinish = async (values: LoginValues) => {
    try {
      const { data: res } = await request.post('/api/auth/login', values)
      if (res.code === 0) {
        const { accessToken } = res.data
        localStorage.setItem('token', accessToken)
        useUserStore.getState().setToken(accessToken)
        message.success('Login success')
        navigate('/', { replace: true })
      } else {
        message.error(res.message || 'Login failed')
      }
    } catch {
      message.error('Login failed')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400 }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          {t('appName')} - Dev Login
        </Typography.Title>
        <Form onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: t('username') }]}
          >
            <Input placeholder={t('username')} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: t('password') }]}
          >
            <Input.Password placeholder={t('password')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('loginBtn')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
