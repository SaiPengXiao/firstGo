import {
  DashboardOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  SettingOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Dropdown, Layout, Menu, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { clearCart } from '../store/menuSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const NAV_ITEMS = [
  { key: '/home', icon: <DashboardOutlined />, label: '数据概览' },
  { key: '/menu/manage', icon: <SettingOutlined />, label: '菜单配置' },
  { key: '/orders', icon: <OrderedListOutlined />, label: '订单管理' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector((s) => s.auth.user)

  const selectedKey =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.key))?.key ?? '/home'

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    void navigate('/login', { replace: true })
  }

  return (
    <Layout className="admin-layout">
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        width={220}
        className="admin-sider"
        theme="light"
      >
        <div className="admin-brand" onClick={() => navigate('/home')}>
          <div className="admin-brand-icon">
            <ShopOutlined />
          </div>
          <div className="admin-brand-text">
            <span className="admin-brand-name">点餐后台</span>
            <span className="admin-brand-sub">管理中心</span>
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={NAV_ITEMS}
          onClick={({ key }) => navigate(key)}
          className="admin-menu"
        />
      </Sider>

      <Layout>
        <Header className="admin-header">
          <Text type="secondary" className="admin-header-hint">
            点餐小程序 · 运营管理
          </Text>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  label: '退出登录',
                  icon: <LogoutOutlined />,
                  onClick: handleLogout,
                },
              ],
            }}
            placement="bottomRight"
          >
            <div className="home-header-user">
              <Avatar size={34} icon={<UserOutlined />} className="home-header-avatar" />
              <span className="home-header-username">{user?.username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="admin-content">{children}</Content>
      </Layout>
    </Layout>
  )
}
