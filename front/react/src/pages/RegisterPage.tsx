import { LockOutlined, MailOutlined, UserOutlined, ShopOutlined, GithubOutlined, GoogleOutlined, WechatOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerSuccess } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'
import type { RegisterFormValues } from '../types/auth'
import { registerApi } from '../services/authService'

const { Title, Text, Paragraph } = Typography

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm<RegisterFormValues>()

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true)
    try {
      const result = await registerApi(values)
      // 检查是否为管理员
      const isAdmin = result.user.roles?.includes('admin')
      if (!isAdmin) {
        message.error('注册失败：只有管理员账号可以访问此系统')
        return
      }
      dispatch(registerSuccess(result))
      message.success('注册成功')
      void navigate('/home', { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : '注册失败'
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
                创建<br />账号
              </Title>
              <Paragraph className="auth-left-desc">
                注册后即可登录点餐小程序后台，开始管理门店。
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
              <Title level={2} className="auth-right-title">注册</Title>
              <Text className="auth-right-switch">
                已有账号？<Link to="/login">去登录</Link>
              </Text>
            </div>

            <Form<RegisterFormValues>
              form={form}
              name="register"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              className="auth-right-form"
            >
              <div className="auth-field-group">
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少 3 个字符' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="用户名"
                    className="auth-field"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '邮箱格式不正确' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="邮箱"
                    className="auth-field"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少 6 位' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码"
                    className="auth-field"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value: string) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('两次密码不一致'))
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="确认密码"
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
                  注册
                </Button>
              </Form.Item>
            </Form>

            <Divider className="auth-divider">
              <Text type="secondary" style={{ fontSize: 12 }}>其他方式注册</Text>
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