import {
  ArrowRightOutlined,
  DollarCircleOutlined,
  OrderedListOutlined,
  ReloadOutlined,
  RiseOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listOrdersApi } from '../services/orderService'
import { useAppSelector } from '../store/hooks'
import type { Order } from '../types/order'

const { Title, Text, Paragraph } = Typography

function isSameDay(iso: string, date: Date) {
  const d = new Date(iso)
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const isAdmin = useAppSelector((s) =>
    (s.auth.user?.roles ?? []).includes('admin'),
  )

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false)
      setOrders([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await listOrdersApi()
      setOrders(res.orders)
    } catch (e) {
      setError(e instanceof Error ? e.message : '获取今日数据失败')
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    void load()
  }, [load])

  const todayStats = useMemo(() => {
    const today = new Date()
    const todayOrders = orders.filter((o) => isSameDay(o.createdAt, today))
    const revenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const activeUsers = new Set(todayOrders.map((o) => o.userId || o.username)).size
    return {
      orderCount: todayOrders.length,
      revenue,
      activeUsers,
      recent: todayOrders.slice(0, 8),
    }
  }, [orders])

  const recentColumns: ColumnsType<Order> = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: '菜品',
      dataIndex: 'items',
      key: 'items',
      render: (items: Order['items']) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(items ?? []).slice(0, 4).map((it) => (
            <Tag key={it.id}>
              {it.name}×{it.quantity}
            </Tag>
          ))}
          {(items?.length ?? 0) > 4 && <Tag>+{(items?.length ?? 0) - 4}</Tag>}
        </div>
      ),
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      align: 'right',
      render: (v: number) => (
        <Text strong style={{ color: 'var(--color-stat-revenue)' }}>
          ¥{Number(v).toFixed(2)}
        </Text>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (v: string) =>
        new Date(v).toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ]

  const quickActions = [
    {
      key: 'menu',
      title: '菜单配置',
      desc: '管理分类与菜品上下架',
      icon: <SettingOutlined />,
      onClick: () => navigate('/menu/manage'),
    },
    {
      key: 'orders',
      title: '订单管理',
      desc: '查看用户订单明细',
      icon: <OrderedListOutlined />,
      onClick: () => navigate('/orders'),
    },
  ]

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <Title level={3} style={{ margin: 0 }}>
            今日概览
          </Title>
          <Paragraph type="secondary" style={{ margin: '6px 0 0' }}>
            你好，{user?.username ?? '管理员'}。这里是点餐小程序的运营数据与管理入口。
          </Paragraph>
        </div>
        {isAdmin && (
          <Button icon={<ReloadOutlined />} onClick={() => void load()} loading={loading}>
            刷新
          </Button>
        )}
      </div>

      {!isAdmin && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
          message="当前账号无管理员权限"
          description="登录管理员账号后可查看营业数据、配置菜单与管理订单。"
        />
      )}

      {error && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
          message={error}
          action={
            <Button size="small" onClick={() => void load()}>
              重试
            </Button>
          }
        />
      )}

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card className="admin-stat-card" variant="borderless">
              <Statistic
                title="今日营业额"
                value={todayStats.revenue}
                precision={2}
                prefix={<DollarCircleOutlined />}
                suffix="元"
                styles={{ content: { color: 'var(--color-stat-revenue)', fontWeight: 700 } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="admin-stat-card" variant="borderless">
              <Statistic
                title="今日订单"
                value={todayStats.orderCount}
                prefix={<ShoppingOutlined />}
                styles={{ content: { color: 'var(--color-stat-orders)', fontWeight: 700 } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="admin-stat-card" variant="borderless">
              <Statistic
                title="今日活跃用户"
                value={todayStats.activeUsers}
                prefix={<TeamOutlined />}
                styles={{ content: { color: 'var(--color-stat-users)', fontWeight: 700 } }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>

      <section style={{ marginBottom: 24 }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          <RiseOutlined style={{ marginRight: 8 }} />
          快捷管理
        </Title>
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col xs={24} md={12} key={action.key}>
              <Card
                hoverable
                className="admin-action-card"
                onClick={action.onClick}
                variant="borderless"
              >
                <div className="admin-action-card-inner">
                  <div className="admin-action-icon">{action.icon}</div>
                  <div className="admin-action-text">
                    <div className="admin-action-title">{action.title}</div>
                    <div className="admin-action-desc">{action.desc}</div>
                  </div>
                  <ArrowRightOutlined className="admin-action-arrow" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {isAdmin && (
        <Card
          className="admin-recent-card"
          variant="borderless"
          title="今日最近订单"
          extra={
            <Button type="link" onClick={() => navigate('/orders')}>
              查看全部
            </Button>
          }
        >
          <Table
            rowKey="id"
            size="middle"
            columns={recentColumns}
            dataSource={todayStats.recent}
            pagination={false}
            locale={{ emptyText: loading ? '加载中…' : '今日暂无订单' }}
          />
        </Card>
      )}
    </div>
  )
}
