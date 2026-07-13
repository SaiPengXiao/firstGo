import {
  LeftOutlined,
  UnorderedListOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Layout,
  Spin,
  Table,
  Tag,
  Typography,
  Card,
  Empty,
  Statistic,
  Row,
  Col,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Order, OrderItem } from '../types/order'
import { listOrdersApi } from '../services/orderService'

const { Header, Content } = Layout
const { Title, Text } = Typography

export default function OrderListPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setOrders(await listOrdersApi())
    } catch (e) {
      setError(e instanceof Error ? e.message : '获取订单失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const totalItems = orders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0
    )
    return { totalOrders, totalAmount, totalItems }
  }, [orders])

  const columns: ColumnsType<Order> = [
    {
      title: (
        <span>
          <UserOutlined style={{ marginRight: 6 }} />
          用户
        </span>
      ),
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (username: string) => (
        <span style={{ fontWeight: 500, color: '#1a1a2e' }}>{username}</span>
      ),
    },
    {
      title: (
        <span>
          <ShoppingOutlined style={{ marginRight: 6 }} />
          菜品
        </span>
      ),
      dataIndex: 'items',
      key: 'items',
      render: (items: OrderItem[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(items ?? []).map((it) => (
            <Tag key={it.id} className="order-tag">
              {it.name}
              <span style={{ marginLeft: 4, fontWeight: 600 }}>×{it.quantity}</span>
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: (
        <span>
          <FileTextOutlined style={{ marginRight: 6 }} />
          备注
        </span>
      ),
      dataIndex: 'note',
      key: 'note',
      width: 150,
      render: (note?: string) =>
        note ? (
          <Text type="secondary" style={{ fontSize: 13 }}>
            {note}
          </Text>
        ) : (
          <Text type="secondary" style={{ fontSize: 13, fontStyle: 'italic' }}>
            无备注
          </Text>
        ),
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      align: 'right' as const,
      render: (v: number) => (
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: '#d46b08',
          }}
        >
          ¥{Number(v).toFixed(2)}
        </span>
      ),
    },
    {
      title: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 6 }} />
          下单时间
        </span>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (v: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {new Date(v).toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      ),
    },
  ]

  return (
    <Layout className="home-layout">
      {/* ---- Header ---- */}
      <Header className="home-header">
        <div className="home-header-brand">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate('/menu')}
            style={{ color: '#666' }}
          >
            返回
          </Button>
        </div>
        <Title level={4} style={{ margin: 0, color: '#1a1a2e' }}>
          <UnorderedListOutlined /> 订单列表
        </Title>
        <div className="menu-header-actions">
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={() => void load()}
            loading={loading}
            style={{ color: '#666' }}
          >
            刷新
          </Button>
        </div>
      </Header>

      <Content className="home-content" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* ---- Banner ---- */}
        <section
          className="section-banner menu-order-banner"
          style={{ marginBottom: 28 }}
        >
          <div className="section-banner-ring" />
          <div className="section-banner-ring section-banner-ring-sm" />
          <div className="section-banner-body">
            <div className="section-banner-icon">
              <CalendarOutlined />
            </div>
            <Title level={2} className="section-banner-title">
              订单管理中心
            </Title>
            <Text className="section-banner-desc">
              查看所有用户订单记录，追踪每日点单情况
            </Text>
          </div>
        </section>

        {/* ---- Stats Cards ---- */}
        {!loading && orders.length > 0 && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card className="order-stats-card" bodyStyle={{ padding: '20px 24px' }}>
                <Statistic
                  title="今日订单"
                  value={stats.totalOrders}
                  prefix={<ShoppingOutlined style={{ color: '#d46b08' }} />}
                  valueStyle={{ color: '#1a1a2e', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="order-stats-card" bodyStyle={{ padding: '20px 24px' }}>
                <Statistic
                  title="订单总额"
                  value={stats.totalAmount}
                  prefix={<span style={{ color: '#d46b08' }}>¥</span>}
                  precision={2}
                  valueStyle={{ color: '#d46b08', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="order-stats-card" bodyStyle={{ padding: '20px 24px' }}>
                <Statistic
                  title="总份数"
                  value={stats.totalItems}
                  prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a', fontWeight: 700 }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* ---- Error Alert ---- */}
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16, borderRadius: 12 }}
            action={
              <Button size="small" onClick={() => void load()}>
                重试
              </Button>
            }
          />
        )}

        {/* ---- Orders Table ---- */}
        <Card className="order-table-card" bodyStyle={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <Spin size="large" tip="加载订单…" />
            </div>
          ) : orders.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无订单"
              style={{ padding: 60 }}
            />
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={orders}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条订单`,
                style: { padding: '16px 24px', margin: 0 },
              }}
              rowClassName="order-table-row"
            />
          )}
        </Card>
      </Content>
    </Layout>
  )
}
