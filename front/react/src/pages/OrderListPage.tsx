import { LeftOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Alert, Button, Layout, Spin, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Order, OrderItem } from '../types/order'
import { listOrdersApi } from '../services/orderService'

const { Header, Content } = Layout
const { Title } = Typography

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

  const columns: ColumnsType<Order> = [
    { title: '用户', dataIndex: 'username', key: 'username' },
    {
      title: '菜品',
      dataIndex: 'items',
      key: 'items',
      render: (items: OrderItem[]) =>
        (items ?? []).map((it) => (
          <Tag key={it.id}>
            {it.name} × {it.quantity}
          </Tag>
        )),
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v: number) => `¥${Number(v).toFixed(2)}`,
    },
    { title: '下单时间', dataIndex: 'createdAt', key: 'createdAt' },
  ]

  return (
    <Layout className="home-layout">
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
        <div className="menu-header-actions" />
      </Header>

      <Content className="home-content">
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16 }}
            action={<Button size="small" onClick={() => void load()}>重试</Button>}
          />
        )}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" tip="加载订单…" />
          </div>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={orders}
            pagination={{ pageSize: 20 }}
            locale={{ emptyText: '暂无订单' }}
          />
        )}
      </Content>
    </Layout>
  )
}
