import { LockOutlined, UserOutlined, ShopOutlined, GithubOutlined, GoogleOutlined, WechatOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginSuccess } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'
import type { LoginFormValues } from '../types/auth'
import { loginApi } from '../services/authService'

const { Title, Text, Paragraph } = Typography

interface LocationState {
  from?: { pathname: string }
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/home'

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
      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-left-orb auth-left-orb-1" />
          <div className="auth-left-orb auth-left-orb-2" />
          <div className="auth-left-orb auth-left-orb-3" />

          <div className="auth-left-ring" />

          <div className="auth-left-inner">
            <div className="auth-left-logo">
              <div className="auth-left-logo-icon">
                <ShopOutlined />
              </div>
              <span className="auth-left-logo-text">点餐后台</span>
            </div>

            <div className="auth-left-quote">
              <Title level={1} className="auth-left-title">
                欢迎<br />回来
              </Title>
              <Paragraph className="auth-left-desc">
                管理菜单、查看订单、掌握每日营业数据。
              </Paragraph>
            </div>

            <div className="auth-left-pills">
              <span className="auth-left-pill">营业概览</span>
              <span className="auth-left-pill">菜单配置</span>
              <span className="auth-left-pill">订单管理</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-right-inner">
            <div className="auth-right-header">
              <Title level={2} className="auth-right-title">登录</Title>
              <Text className="auth-right-switch">
                还没有账号？<Link to="/login">立即注册</Link>
              </Text>
            </div>

            <Form<LoginFormValues>
              name="login"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              className="auth-right-form"
            >
              <div className="auth-field-group">
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="用户名"
                    className="auth-field"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码"
                    className="auth-field"
                  />
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className="auth-submit"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            <Divider className="auth-divider">
              <Text type="secondary" style={{ fontSize: 12 }}>其他方式登录</Text>
            </Divider>

            <div className="auth-oauth">
              <Button shape="circle" size="large" icon={<WechatOutlined />} className="auth-oauth-btn" disabled />
              <Button shape="circle" size="large" icon={<GithubOutlined />} className="auth-oauth-btn" disabled />
              <Button shape="circle" size="large" icon={<GoogleOutlined />} className="auth-oauth-btn" disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}