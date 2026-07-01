import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Layout, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const { Header, Content } = Layout
const { Title, Paragraph, Text } = Typography

export default function HomePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    void navigate('/login', { replace: true })
  }

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <Title level={4} style={{ color: '#fff', margin: 0 }}>
          首页
        </Title>
        <Space>
          <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            <UserOutlined /> {user?.username}
          </Text>
          <Button
            type="default"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </Space>
      </Header>
      <Content className="home-content">
        <Card>
          <Title level={3}>欢迎，{user?.username ?? '用户'}</Title>
          <Paragraph type="secondary">邮箱：{user?.email}</Paragraph>
          <Paragraph>
            张晓鹏诶！张晓鹏诶！张晓鹏诶！张晓鹏诶！张晓鹏诶！张晓鹏诶！张晓鹏诶！张晓鹏诶！张晓鹏诶！
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  )
}