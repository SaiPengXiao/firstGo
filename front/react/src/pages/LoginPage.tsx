import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginSuccess } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'
import type { LoginFormValues } from '../types/auth'
import { loginApi } from '../services/authService'

const { Title, Text } = Typography

interface LocationState {
  from?: { pathname: string }
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as LocationState | null)?.from?.pathname ?? '/home'

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      const result = await loginApi(values)
      dispatch(loginSuccess(result))
      message.success('登录成功')
      void navigate(from, { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : '登录失败'
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Card className="auth-card" bordered={false}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          登录
        </Title>
        <Form<LoginFormValues>
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <Text type="secondary">
          还没有账号？<Link to="/register">去注册</Link>
        </Text>
      </Card>
    </div>
  )
}