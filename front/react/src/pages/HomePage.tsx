import {
  LogoutOutlined,
  UserOutlined,
  BulbOutlined,
  ExperimentOutlined,
  ToolOutlined,
  EyeOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { Button, Card, Carousel, Col, Layout, notification, Row, Space, Tag, Typography } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockHotPosts } from '../services/postData'
import { logout } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const { Header, Content } = Layout
const { Title, Paragraph, Text } = Typography

const sectionMeta: Record<string, { title: string; icon: React.ReactNode; color: string }> = {
  thinking: {
    title: '我的思考',
    icon: <BulbOutlined />,
    color: '#667eea',
  },
  collab: {
    title: '未来共研室',
    icon: <ExperimentOutlined />,
    color: '#52c41a',
  },
  toolbox: {
    title: '工具箱 · 我的实践',
    icon: <ToolOutlined />,
    color: '#fa8c16',
  },
}

const sections = [
  {
    key: 'thinking',
    title: '我的思考',
    icon: <BulbOutlined style={{ fontSize: 36, color: '#667eea' }} />,
    description: '记录日常的灵感碎片、技术反思与成长感悟。',
    color: '#667eea',
  },
  {
    key: 'collab',
    title: '未来共研室',
    icon: <ExperimentOutlined style={{ fontSize: 36, color: '#52c41a' }} />,
    description: '开放协作的研究空间，一起探索前沿技术与创新方案。',
    color: '#52c41a',
  },
  {
    key: 'toolbox',
    title: '工具箱 · 我的实践',
    icon: <ToolOutlined style={{ fontSize: 36, color: '#fa8c16' }} />,
    description: '实战中沉淀的工具集、项目经验与最佳实践汇总。',
    color: '#fa8c16',
  },
]

export default function HomePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    const today = new Date().toDateString()
    const lastShown = localStorage.getItem('welcomeToastDate')
    if (lastShown === today) return
    notification.success({
      message: `欢迎回来，${user?.username ?? '用户'}`,
      description: '今天也是充满灵感的一天，开始探索吧。',
      placement: 'topRight',
      duration: 3,
    })
    localStorage.setItem('welcomeToastDate', today)
  }, [user?.username])

  const handleLogout = () => {
    dispatch(logout())
    void navigate('/login', { replace: true })
  }

  const handleSectionClick = (key: string) => {
    navigate(`/section/${key}`)
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
        <div className="home-hero">
          <Title level={2} className="home-hero-title">
            热门推荐
          </Title>
          <Paragraph className="home-hero-sub">
            以下是各个板块中点击率最高的精选内容
          </Paragraph>
        </div>

        <div className="home-carousel-wrapper">
          <Carousel autoplay autoplaySpeed={4000} dots className="home-carousel">
            {mockHotPosts.map((post) => {
              const meta = sectionMeta[post.section]
              return (
                <div key={post.id}>
                  <div
                    className="carousel-slide"
                    style={{ borderLeftColor: meta?.color }}
                    onClick={() => navigate(`/section/${post.section}`)}
                  >
                    <div className="carousel-slide-body">
                      <Tag color={meta?.color} className="carousel-tag">
                        {meta?.icon} {meta?.title}
                      </Tag>
                      <Title level={3} className="carousel-title">
                        {post.title}
                      </Title>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        className="carousel-summary"
                      >
                        {post.summary}
                      </Paragraph>
                      <div className="carousel-meta">
                        <Text type="secondary">{post.author}</Text>
                        <Space size={4}>
                          <EyeOutlined />
                          <Text type="secondary">{post.views} 次浏览</Text>
                        </Space>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </Carousel>
        </div>

        <Row gutter={[24, 24]} className="home-sections">
          {sections.map((section) => (
            <Col xs={24} md={8} key={section.key}>
              <Card
                hoverable
                className="home-section-card"
                style={{ borderTop: `3px solid ${section.color}` }}
                onClick={() => handleSectionClick(section.key)}
              >
                <div className="home-section-icon">{section.icon}</div>
                <Title level={4} className="home-section-title">
                  {section.title}
                </Title>
                <Paragraph type="secondary" className="home-section-desc">
                  {section.description}
                </Paragraph>
                <div className="home-section-action">
                  <Text style={{ color: section.color, fontSize: 14 }}>
                    查看全部 <RightOutlined style={{ fontSize: 12 }} />
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  )
}
