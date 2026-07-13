import {
  LogoutOutlined,
  UserOutlined,
  RestOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  SettingOutlined,
  FireOutlined,
  RiseOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  BellOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Layout,
  Row,
  Statistic,
  Tag,
  Typography,
  notification,
} from 'antd'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/authSlice'
import { clearCart } from '../store/menuSlice'

const { Header, Content } = Layout
const { Title,Paragraph } = Typography

// 模拟今日推荐菜品数据
const mockRecommendedDishes = [
  {
    id: '1',
    name: '宫保鸡丁',
    price: 28,
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    description: '经典川菜，麻辣鲜香',
    hot: true,
  },
  {
    id: '2',
    name: '糖醋排骨',
    price: 42,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    description: '酸甜可口，色泽诱人',
    hot: true,
  },
  {
    id: '3',
    name: '清蒸鲈鱼',
    price: 68,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    description: '鲜嫩爽滑，营养丰富',
    hot: false,
  },
  {
    id: '4',
    name: '麻婆豆腐',
    price: 18,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    description: '麻辣鲜香，下饭神器',
    hot: true,
  },
]

// 模拟公告数据
const mockAnnouncements = [
  { id: '1', title: '新菜品上线', content: '本周推出5道新菜品，欢迎品尝！', date: '2024-01-15' },
  { id: '2', title: '优惠活动', content: '满100减20，满200减50', date: '2024-01-14' },
]

export default function HomePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const cart = useAppSelector((state) => state.menu.cart)
  const isAdmin = useAppSelector((state) =>
    (state.auth.user?.roles ?? []).includes('admin')
  )

  const cartCount = useMemo(() =>
    cart.reduce((sum, item) => sum + item.quantity, 0)
  , [cart])

  useEffect(() => {
    const today = new Date().toDateString()
    const lastShown = localStorage.getItem('welcomeToastDate')
    if (lastShown === today) return
    notification.success({
      message: `欢迎回来，${user?.username ?? '用户'}`,
      description: '今天想吃点什么？开始探索美食吧！',
      placement: 'topRight',
      duration: 3,
    })
    localStorage.setItem('welcomeToastDate', today)
  }, [user?.username])

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    void navigate('/login', { replace: true })
  }

  const userMenuItems = [
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout },
  ]

  const quickActions = [
    {
      key: 'order',
      title: '开始点菜',
      desc: '浏览菜单，选择美味',
      icon: <RestOutlined />,
      color: '#fa8c16',
      gradient: 'linear-gradient(135deg, #fa8c16, #d46b08)',
      onClick: () => navigate('/menu'),
    },
    ...(isAdmin ? [
      {
        key: 'manage',
        title: '菜单配置',
        desc: '管理菜品和分类',
        icon: <SettingOutlined />,
        color: '#667eea',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
        onClick: () => navigate('/menu/manage'),
      },
      {
        key: 'orders',
        title: '订单管理',
        desc: '查看所有订单',
        icon: <OrderedListOutlined />,
        color: '#52c41a',
        gradient: 'linear-gradient(135deg, #52c41a, #389e0d)',
        onClick: () => navigate('/orders'),
      },
    ] : []),
  ]

  const statsData = [
    { title: '今日订单', value: 128, icon: <DashboardOutlined />, color: '#fa8c16' },
    { title: '今日营业额', value: 3680, prefix: '¥', icon: <DollarCircleOutlined />, color: '#52c41a' },
    { title: '活跃用户', value: 45, icon: <TeamOutlined />, color: '#667eea' },
  ]

  return (
    <Layout className="home-layout">
      {/* Header */}
      <Header className="home-header">
        <div className="home-header-brand">
          <div className="home-header-logo">
            <img src="/firstGo/favicon.svg" alt="美食工坊" width="33" height="33" style={{ display: 'block' }} />
          </div>
          <span className="home-header-name">美食工坊</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Badge count={cartCount} size="small" offset={[0, 0]}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: 20, color: '#666' }} />}
              onClick={() => navigate('/menu')}
            />
          </Badge>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="home-header-user">
              <Avatar size={34} icon={<UserOutlined />} className="home-header-avatar" />
              <span className="home-header-username">{user?.username}</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Content className="home-content">
        {/* Hero Banner - 橙色系渐变背景 + 装饰圆环 */}
        <section style={{
          background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 50%, #fa541c 100%)',
          borderRadius: 24,
          padding: '48px 40px',
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* 装饰圆环1 */}
          <div style={{
            position: 'absolute',
            right: -40,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.1)',
          }} />
          {/* 装饰圆环2 */}
          <div style={{
            position: 'absolute',
            right: 60,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 180,
            height: 180,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.06)',
          }} />

          <div style={{ position: 'relative', zIndex: 1, color: '#fff' }}>
            {/* 热门标签 */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.15)',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              marginBottom: 20,
            }}>
              <FireOutlined /> 今日热门
            </div>

            {/* 欢迎语 */}
            <Title level={1} style={{
              color: '#fff',
              margin: '0 0 12px',
              fontSize: 42,
              fontWeight: 800,
            }}>
              发现美味，享受生活
            </Title>

            <Paragraph style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 16,
              marginBottom: 24,
              maxWidth: 480,
            }}>
              精选优质食材，用心烹饪每一道菜品。快捷点餐，准时送达，让美食触手可及。
            </Paragraph>

            {/* 主要按钮 */}
            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                type="primary"
                size="large"
                icon={<RestOutlined />}
                onClick={() => navigate('/menu')}
                style={{
                  background: '#fff',
                  color: '#d46b08',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 600,
                  height: 46,
                  padding: '0 28px',
                }}
              >
                立即点餐
              </Button>
              <Button
                size="large"
                icon={<OrderedListOutlined />}
                onClick={() => navigate('/orders')}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 10,
                  height: 46,
                  padding: '0 28px',
                }}
              >
                查看订单
              </Button>
            </div>
          </div>
        </section>

        {/* 快捷入口卡片 */}
        <section style={{ marginBottom: 32 }}>
          <Title level={4} style={{ marginBottom: 20, color: '#1a1a2e' }}>
            <RiseOutlined style={{ marginRight: 8 }} />
            快捷入口
          </Title>

          <Row gutter={16}>
            {quickActions.map((action) => (
              <Col xs={24} sm={12} lg={8} key={action.key}>
                <Card
                  hoverable
                  onClick={action.onClick}
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: action.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 24,
                      flexShrink: 0,
                    }}>
                      {action.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: '#1a1a2e',
                        marginBottom: 4,
                      }}>
                        {action.title}
                      </div>
                      <div style={{ fontSize: 13, color: '#888' }}>
                        {action.desc}
                      </div>
                    </div>
                    <ArrowRightOutlined style={{ color: '#ccc', fontSize: 16 }} />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* 今日概况统计 + 最新公告 */}
        <Row gutter={24} style={{ marginBottom: 32 }}>
          {/* 今日概况 */}
          <Col xs={24} lg={16}>
            <Card
              title={<><RiseOutlined style={{ marginRight: 8 }} />今日概况</>}
              style={{ borderRadius: 16, height: '100%' }}
            >
              <Row gutter={24}>
                {statsData.map((stat) => (
                  <Col span={8} key={stat.title}>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      prefix={stat.prefix || stat.icon}
                      valueStyle={{ color: stat.color, fontWeight: 700, fontSize: 28 }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* 最新公告 */}
          <Col xs={24} lg={8}>
            <Card
              title={<><BellOutlined style={{ marginRight: 8 }} />最新公告</>}
              style={{ borderRadius: 16, height: '100%' }}
              extra={<Button type="link" size="small">查看更多</Button>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mockAnnouncements.map((item) => (
                  <div key={item.id} style={{
                    padding: 12,
                    background: '#f6ffed',
                    borderRadius: 10,
                    border: '1px solid #b7eb8f',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: '#389e0d' }}>{item.title}</span>
                      <span style={{ fontSize: 12, color: '#999' }}>{item.date}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#666' }}>{item.content}</div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 今日推荐菜品 */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Title level={4} style={{ margin: 0, color: '#1a1a2e' }}>
              <FireOutlined style={{ marginRight: 8, color: '#fa541c' }} />
              今日推荐
            </Title>
            <Button type="link" icon={<ArrowRightOutlined />} onClick={() => navigate('/menu')}>
              查看全部
            </Button>
          </div>

          <Row gutter={16}>
            {mockRecommendedDishes.map((dish) => (
              <Col xs={12} lg={6} key={dish.id}>
                <Card
                  hoverable
                  cover={(
                    <div style={{
                      height: 160,
                      background: `url(${dish.image}) center/cover`,
                      position: 'relative',
                    }}>
                      {/* 热卖标签 */}
                      {dish.hot && (
                        <Tag color="#ff4d4f" style={{ position: 'absolute', top: 8, right: 8 }}>
                          <FireOutlined /> 热卖
                        </Tag>
                      )}
                    </div>
                  )}
                  style={{ borderRadius: 16, overflow: 'hidden' }}
                  bodyStyle={{ padding: 16 }}
                  onClick={() => navigate('/menu')}
                >
                  {/* 菜品名称和价格 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{dish.name}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#d46b08' }}>¥{dish.price}</span>
                  </div>
                  {/* 描述 */}
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>{dish.description}</div>
                  {/* 加入购物车按钮 */}
                  <Button type="primary" block icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
                    加入购物车
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Content>
    </Layout>
  )
}
