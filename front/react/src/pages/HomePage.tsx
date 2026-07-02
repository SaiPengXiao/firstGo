import {
  LogoutOutlined,
  UserOutlined,
  BulbOutlined,
  EditOutlined,
  ExperimentOutlined,
  ToolOutlined,
  EyeOutlined,
  ArrowRightOutlined,
  FireOutlined,
  CompassOutlined,
} from '@ant-design/icons'
import { Avatar, Carousel, Dropdown, Layout, notification, Typography } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockHotPosts } from '../services/postData'
import { logout } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const { Header, Content } = Layout
const { Title, Paragraph, Text } = Typography

const carouselBadge: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  thinking: { icon: <BulbOutlined />, label: '我的思考', color: '#667eea' },
  collab: { icon: <ExperimentOutlined />, label: '未来共研室', color: '#38ef7d' },
  toolbox: { icon: <ToolOutlined />, label: '工具箱', color: '#f093fb' },
}

const sections = [
  {
    key: 'thinking',
    title: '我的思考',
    desc: '记录日常灵感与技术反思',
    icon: <BulbOutlined />,
    gradient: '#667eea',
    shadow: '0 8px 32px rgba(102, 126, 234, 0.25)',
  },
  {
    key: 'collab',
    title: '未来共研室',
    desc: '前沿探索与开放协作',
    icon: <ExperimentOutlined />,
    gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
    shadow: '0 8px 32px rgba(17, 153, 142, 0.25)',
  },
  {
    key: 'toolbox',
    title: '工具箱 · 我的实践',
    desc: '实战沉淀与经验汇总',
    icon: <ToolOutlined />,
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    shadow: '0 8px 32px rgba(240, 147, 251, 0.25)',
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

  const userMenuItems = [
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
  ]

  return (
    <Layout className="home-layout">
      {/* ---- Header ---- */}
      <Header className="home-header">
        <div className="home-header-brand">
          <div className="home-header-logo">
            <img src="/firstGo/favicon.svg" alt="墨规" width="33" height="33" style={{ display: 'block' }} />
          </div>
          <span className="home-header-name">墨规</span>
        </div>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="home-header-user">
            <Avatar size={34} icon={<UserOutlined />} className="home-header-avatar" />
            <span className="home-header-username">{user?.username}</span>
          </div>
        </Dropdown>
      </Header>

      <Content className="home-content">
        {/* ---- Hero ---- */}
        <section className="home-hero">
          <div className="home-hero-badge">
            <FireOutlined /> 热门推荐
          </div>
          <Title className="home-hero-title">
            探索 <span className="home-hero-gradient">创造</span> 沉淀
          </Title>
          <Paragraph className="home-hero-sub">
            一个属于技术人的数字花园，让每一次思考都值得被看见
          </Paragraph>

          <div className="home-hero-stats">
            <div className="home-hero-stat">
              <span className="home-hero-stat-num">35</span>
              <span className="home-hero-stat-label">篇文章</span>
            </div>
            <div className="home-hero-stat-div" />
            <div className="home-hero-stat">
              <span className="home-hero-stat-num">128</span>
              <span className="home-hero-stat-label">次讨论</span>
            </div>
            <div className="home-hero-stat-div" />
            <div className="home-hero-stat">
              <span className="home-hero-stat-num">3</span>
              <span className="home-hero-stat-label">大板块</span>
            </div>
          </div>
        </section>

        {/* ---- Carousel ---- */}
        <section className="home-carousel-wrap">
          <Carousel autoplay autoplaySpeed={3000} dots className="home-carousel" effect="fade">
            {mockHotPosts.map((post) => {
              const badge = carouselBadge[post.section]
              return (
                <div key={post.id}>
                  <div
                    className="carousel-card"
                    onClick={() => navigate(`/section/${post.section}`)}
                  >
                    <div className="carousel-card-shape" />
                    <div className="carousel-card-content">
                      <div className="carousel-card-eyebrow" style={{ color: badge.color }}>
                        {badge.icon} <span>{badge.label}</span>
                      </div>
                      <Title level={2} className="carousel-card-title">
                        {post.title}
                      </Title>
                      <Paragraph className="carousel-card-desc">
                        {post.summary}
                      </Paragraph>
                      <div className="carousel-card-meta">
                        <div className="carousel-card-author">
                          <Avatar size={28} icon={<UserOutlined />} />
                          <span>{post.author}</span>
                        </div>
                        <span className="carousel-card-views">
                          <EyeOutlined /> {post.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </Carousel>
        </section>

        {/* ---- Sections ---- */}
        <section className="home-sections">
          <div className="home-sections-head">
            <Title level={3} className="home-sections-title">
              <CompassOutlined /> 探索板块
            </Title>
            <Text type="secondary">选择一个方向，开始你的探索之旅</Text>
          </div>

          <div className="home-sections-grid">
            {sections.map((s) => (
              <div
                key={s.key}
                className="section-card"
                onClick={() => navigate(`/section/${s.key}`)}
              >
                <div
                  className="section-card-glow"
                  style={{ background: s.gradient }}
                />
                <div
                  className="section-card-icon"
                  style={{ background: s.gradient, boxShadow: s.shadow }}
                >
                  {s.icon}
                </div>
                <Title level={4} className="section-card-title">{s.title}</Title>
                <Text type="secondary" className="section-card-desc">{s.desc}</Text>
                <div className="section-card-link">
                  <span>进入板块</span>
                  <ArrowRightOutlined />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAB */}
        <div className="home-fab" onClick={() => navigate('/post/new')} title="发表文章">
          <EditOutlined />
        </div>
      </Content>
    </Layout>
  )
}