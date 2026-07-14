import {
  UnorderedListOutlined,
  ShoppingOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  FileTextOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Spin,
  Table,
  Tag,
  Typography,
  Card,
  Empty,
  Statistic,
  Row,
  Col,
  Input,
  DatePicker,
  Space,
  Form,
} from 'antd'
import type { Dayjs } from 'dayjs'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import type { Order, OrderItem, Pagination } from '../types/order'
import { listOrdersApi } from '../services/orderService'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

function isSameDay(iso: string, date: Date) {
  const d = new Date(iso)
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  )
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search form state
  const [username, setUsername] = useState('')
  const [menuItemName, setMenuItemName] = useState('')
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs] | null>(null)

  const load = async (page = 1, pageSize = 20) => {
    setLoading(true)
    setError(null)
    try {
      const res = await listOrdersApi({
        page,
        pageSize,
        username: username || undefined,
        menuItemName: menuItemName || undefined,
        startTime: timeRange?.[0].toISOString(),
        endTime: timeRange?.[1].toISOString(),
      })
      setOrders(res.orders)
      setPagination(res.pagination)
    } catch (e) {
      setError(e instanceof Error ? e.message : '获取订单失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load(1, pagination.pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    void load(1, pagination.pageSize)
  }

  const handleReset = () => {
    setUsername('')
    setMenuItemName('')
    setTimeRange(null)
    void load(1, 20)
  }

  const handleTableChange = (newPagination: {
    current?: number
    pageSize?: number
  }) => {
    void load(newPagination.current ?? 1, newPagination.pageSize ?? 20)
  }

  const stats = useMemo(() => {
    const today = new Date()
    const todayOrders = orders.filter((o) => isSameDay(o.createdAt, today))
    const totalOrders = todayOrders.length
    const totalAmount = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const totalItems = todayOrders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0,
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
        <span style={{ fontWeight: 500 }}>{username}</span>
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
          <Text type="secondary" style={{ fontSize: 13 }}>{note}</Text>
        ) : (
          <Text type="secondary" style={{ fontSize: 13, fontStyle: 'italic' }}>无备注</Text>
        ),
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary)' }}>
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
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={3} style={{ margin: 0 }}>
            <UnorderedListOutlined style={{ marginRight: 8 }} />
            订单管理
          </Title>
          <Text type="secondary">查看全部用户订单，默认统计今日数据</Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => void load(pagination.page, pagination.pageSize)}
          loading={loading}
        >
          刷新
        </Button>
      </div>

      {!loading && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card className="admin-stat-card" bordered={false}>
              <Statistic
                title="今日订单"
                value={stats.totalOrders}
                prefix={<ShoppingOutlined style={{ color: 'var(--color-stat-orders)' }} />}
                valueStyle={{ fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="admin-stat-card" bordered={false}>
              <Statistic
                title="今日营业额"
                value={stats.totalAmount}
                prefix={<span style={{ color: 'var(--color-stat-revenue)' }}>¥</span>}
                precision={2}
                valueStyle={{ color: 'var(--color-stat-revenue)', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="admin-stat-card" bordered={false}>
              <Statistic
                title="今日份数"
                value={stats.totalItems}
                prefix={<ShoppingOutlined style={{ color: 'var(--color-stat-users)' }} />}
                valueStyle={{ color: 'var(--color-stat-users)', fontWeight: 700 }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Search Panel */}
      <Card className="admin-panel-card" bordered={false} style={{ marginBottom: 24 }}>
        <Form layout="inline" style={{ flexWrap: 'wrap', gap: 12 }}>
          <Form.Item label="顾客" style={{ marginBottom: 0 }}>
            <Input
              placeholder="模糊搜索用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              prefix={<UserOutlined />}
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item label="菜品" style={{ marginBottom: 0 }}>
            <Input
              placeholder="模糊搜索菜品名"
              value={menuItemName}
              onChange={(e) => setMenuItemName(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              prefix={<ShoppingOutlined />}
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item label="时间" style={{ marginBottom: 0 }}>
            <RangePicker
              showTime
              value={timeRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setTimeRange([dates[0], dates[1]])
                } else {
                  setTimeRange(null)
                }
              }}
              style={{ width: 320 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={loading}
              >
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16, borderRadius: 12 }}
          action={
            <Button size="small" onClick={() => void load(pagination.page, pagination.pageSize)}>
              重试
            </Button>
          }
        />
      )}

      <Card className="admin-panel-card" bordered={false} styles={{ body: { padding: 0 } }}>
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
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条订单`,
              style: { padding: '16px 24px', margin: 0 },
            }}
            onChange={handleTableChange}
          />
        )}
      </Card>
    </div>
  )
}
