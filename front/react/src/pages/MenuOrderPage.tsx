import {
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RestOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Badge,
  Button,
  Card,
  Drawer,
  Empty,
  Input,
  Layout,
  Segmented,
  Spin,
  Typography,
  message,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MenuItem } from '../types/menu'
import {
  clearCart,
  decrementCart,
  incrementCart,
  loadMenu,
  setOrderNote,
} from '../store/menuSlice'
import { createOrderApi } from '../services/orderService'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography

function cartCount(lines: { quantity: number }[]) {
  return lines.reduce((s, l) => s + l.quantity, 0)
}

export default function MenuOrderPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const categories = useAppSelector((s) => s.menu.categories)
  const items = useAppSelector((s) => s.menu.items)
  const cart = useAppSelector((s) => s.menu.cart)
  const orderNote = useAppSelector((s) => s.menu.orderNote)
  const loading = useAppSelector((s) => s.menu.loading)
  const error = useAppSelector((s) => s.menu.error)
  const isAdmin = useAppSelector((s) => (s.auth.user?.roles ?? []).includes('admin'))
  const [categoryId, setCategoryId] = useState<string>('全部')
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    void dispatch(loadMenu(false))
  }, [dispatch])

  const categoryNameById = useMemo(() => {
    const m = new Map<string, string>()
    categories.forEach((c) => m.set(c.id, c.name))
    return m
  }, [categories])

  const segmentOptions = useMemo(() => {
    const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
    return ['全部', ...sorted.map((c) => c.id)]
  }, [categories])

  const segmentLabel = (v: string) => {
    if (v === '全部') return '全部'
    return categoryNameById.get(v) ?? v
  }

  const availableItems = useMemo(
    () => items.filter((i) => i.available),
    [items],
  )

  const filtered = useMemo(() => {
    if (categoryId === '全部') return availableItems
    return availableItems.filter((i) => i.categoryId === categoryId)
  }, [availableItems, categoryId])

  const itemMap = useMemo(() => {
    const m = new Map<string, MenuItem>()
    items.forEach((i) => m.set(i.id, i))
    return m
  }, [items])

  const cartLines = useMemo(() => {
    return cart
      .map((line) => {
        const item = itemMap.get(line.menuItemId)
        if (!item || !item.available) return null
        return { ...line, item }
      })
      .filter(Boolean) as { menuItemId: string; quantity: number; item: MenuItem }[]
  }, [cart, itemMap])

  const total = cartLines.reduce((s, l) => s + l.item.price * l.quantity, 0)
  const count = cartCount(cart)

  const qtyOf = (id: string) => cart.find((l) => l.menuItemId === id)?.quantity ?? 0

  const submitOrder = async () => {
    if (cartLines.length === 0) {
      message.warning('请先选择菜品')
      return
    }
    try {
      const order = await createOrderApi({
        items: cartLines.map((l) => ({ menuItemId: l.menuItemId, quantity: l.quantity })),
        note: orderNote || undefined,
      })
      message.success({
        content: `下单成功：¥${order.totalAmount.toFixed(2)}，共 ${cartCount(cartLines)} 份`,
        duration: 4,
      })
      dispatch(clearCart())
      setCartOpen(false)
    } catch (e) {
      message.error(e instanceof Error ? e.message : '下单失败')
    }
  }

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <div className="home-header-brand">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate('/home')}
            style={{ color: '#666' }}
          >
            返回
          </Button>
        </div>
        <Title level={4} style={{ margin: 0, color: '#1a1a2e' }}>
          <RestOutlined /> 今日点菜
        </Title>
        <div className="menu-header-actions">
          {isAdmin && (
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => navigate('/menu/manage')}
            >
              配置菜单
            </Button>
          )}
          {isAdmin && (
            <Button
              type="text"
              icon={<UnorderedListOutlined />}
              onClick={() => navigate('/orders')}
            >
              订单
            </Button>
          )}
          <Badge count={count} size="small" offset={[-2, 2]}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => setCartOpen(true)}
              className="menu-cart-btn"
            >
              购物车
            </Button>
          </Badge>
        </div>
      </Header>

      <Content className="home-content menu-page-content">
        <div className="section-banner menu-order-banner">
          <div className="section-banner-ring" />
          <div className="section-banner-ring section-banner-ring-sm" />
          <div className="section-banner-body">
            <div className="section-banner-icon">
              <RestOutlined />
            </div>
            <Title level={1} className="section-banner-title">
              点菜台
            </Title>
            <Text className="section-banner-desc">
              共 {availableItems.length} 道在售
            </Text>
          </div>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" onClick={() => void dispatch(loadMenu(false))}>
                重试
              </Button>
            }
          />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" tip="加载菜单…" />
          </div>
        ) : (
          <>
            <div className="menu-category-bar">
              <Segmented
                options={segmentOptions.map((v) => ({
                  value: v,
                  label: segmentLabel(v),
                }))}
                value={categoryId}
                onChange={(v) => setCategoryId(v as string)}
              />
            </div>

            {filtered.length === 0 ? (
              <Empty description="该分类暂无菜品，去配置菜单添加吧">
                {isAdmin && (
                  <Button type="primary" onClick={() => navigate('/menu/manage')}>
                    去配置
                  </Button>
                )}
              </Empty>
            ) : (
              <div className="menu-dish-grid">
                {filtered.map((dish) => {
                  const q = qtyOf(dish.id)
                  const catName = categoryNameById.get(dish.categoryId) ?? ''
                  return (
                    <Card key={dish.id} className="menu-dish-card" bordered={false}>
                      <div
                        className="menu-dish-cover"
                        style={{
                          backgroundImage: `url(${dish.imageUrl ?? `https://picsum.photos/seed/${dish.id}/320/180`})`,
                        }}
                      />
                      <div className="menu-dish-body">
                        <div className="menu-dish-head">
                          <Title level={5} className="menu-dish-name">
                            {dish.name}
                          </Title>
                          <Text className="menu-dish-price">¥{dish.price.toFixed(2)}</Text>
                        </div>
                        <Text type="secondary" className="menu-dish-cat">
                          {catName}
                        </Text>
                        <Paragraph
                          type="secondary"
                          ellipsis={{ rows: 2 }}
                          className="menu-dish-desc"
                        >
                          {dish.description || ' '}
                        </Paragraph>
                        <div className="menu-dish-actions">
                          {q === 0 ? (
                            <Button
                              type="primary"
                              block
                              size="middle"
                              className="menu-dish-add-btn"
                              icon={<PlusOutlined />}
                              onClick={() => dispatch(incrementCart(dish.id))}
                            >
                              加入
                            </Button>
                          ) : (
                            <div className="menu-qty-control">
                              <Button
                                icon={<MinusOutlined />}
                                onClick={() => dispatch(decrementCart(dish.id))}
                              />
                              <span className="menu-qty-num">{q}</span>
                              <Button
                                icon={<PlusOutlined />}
                                onClick={() => dispatch(incrementCart(dish.id))}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </Content>

      <Drawer
        title="购物车"
        placement="right"
        width={380}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        className="menu-cart-drawer"
        footer={
          <div className="menu-cart-footer">
            <div className="menu-cart-total">
              <Text type="secondary">合计</Text>
              <Title level={3} style={{ margin: 0 }}>
                ¥{total.toFixed(2)}
              </Title>
            </div>
            <Button type="primary" block size="large" onClick={() => void submitOrder()}>
              提交订单
            </Button>
          </div>
        }
      >
        {cartLines.length === 0 ? (
          <Empty description="购物车是空的" />
        ) : (
          <>
            <ul className="menu-cart-list">
              {cartLines.map(({ menuItemId, quantity, item }) => (
                <li key={menuItemId} className="menu-cart-line">
                  <div className="menu-cart-line-info">
                    <Text strong>{item.name}</Text>
                    <Text type="secondary">
                      ¥{item.price.toFixed(2)} × {quantity}
                    </Text>
                  </div>
                  <div className="menu-qty-control menu-qty-control-sm">
                    <Button
                      size="small"
                      icon={<MinusOutlined />}
                      onClick={() => dispatch(decrementCart(menuItemId))}
                    />
                    <span className="menu-qty-num">{quantity}</span>
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => dispatch(incrementCart(menuItemId))}
                    />
                  </div>
                  <Text className="menu-cart-line-sub">
                    ¥{(item.price * quantity).toFixed(2)}
                  </Text>
                </li>
              ))}
            </ul>
            <div className="menu-cart-note">
              <Text type="secondary">备注</Text>
              <Input.TextArea
                rows={2}
                placeholder="少辣、不要葱…"
                value={orderNote}
                onChange={(e) => dispatch(setOrderNote(e.target.value))}
                maxLength={200}
              />
            </div>
            <Button
              type="link"
              danger
              onClick={() => {
                dispatch(clearCart())
                message.info('已清空购物车')
              }}
            >
              清空购物车
            </Button>
          </>
        )}
      </Drawer>
    </Layout>
  )
}