import {
  LeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  AppstoreOutlined,
  CoffeeOutlined,
  SaveOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd'
import type { FormInstance } from 'antd/es/form'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  loadMenu,
  updateCategory,
  updateMenuItem,
} from '../store/menuSlice'
import type { MenuCategoryRow, MenuItem } from '../types/menu'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { TabPane } = Tabs
const { Option } = Select
const { TextArea } = Input

// 模拟菜品图片
const mockFoodImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a32b7a2?w=200',
  'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200',
  'https://images.unsplash.com/photo-1555126634-323283e090fa?w=200',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200',
]

export default function MenuManagePage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { categories, items, loading, saving } = useAppSelector((state) => state.menu)
  
  const [activeTab, setActiveTab] = useState('dishes')
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [dishModalVisible, setDishModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategoryRow | null>(null)
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categoryFormRef = useRef<FormInstance>(null)
  const dishFormRef = useRef<FormInstance>(null)

  useEffect(() => {
    void dispatch(loadMenu(true))
  }, [dispatch])

  // 分类列定义
  const categoryColumns: ColumnsType<MenuCategoryRow> = [
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      render: (sortOrder: number) => (
        <Tag color="blue" style={{ borderRadius: 6 }}>{sortOrder}</Tag>
      ),
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e' }}>{name}</span>
      ),
    },
    {
      title: '菜品数量',
      key: 'count',
      width: 120,
      render: (_, record) => {
        const count = items.filter(item => item.categoryId === record.id).length
        return (
          <Tag color="default" style={{ borderRadius: 6 }}>
            {count} 道菜
          </Tag>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="删除分类"
            description={`确定要删除"${record.name}"吗？该分类下的菜品将变为未分类。`}
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 菜品列定义
  const dishColumns: ColumnsType<MenuItem> = [
    {
      title: '菜品',
      key: 'dish',
      render: (_, record) => (
        <Space size={12}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            background: `url(${record.imageUrl || mockFoodImages[record.name.length % mockFoodImages.length]}) center/cover`,
            backgroundColor: '#f5f5f5',
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e', marginBottom: 4 }}>
              {record.name}
            </div>
            <div style={{ fontSize: 13, color: '#888', maxWidth: 200 }} className="ellipsis">
              {record.description || '暂无描述'}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 120,
      render: (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId)
        return category ? (
          <Tag color="orange" style={{ borderRadius: 6 }}>{category.name}</Tag>
        ) : (
          <Tag style={{ borderRadius: 6 }}>未分类</Tag>
        )
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (price: number) => (
        <span style={{ fontWeight: 700, fontSize: 16, color: '#d46b08' }}>
          ¥{price.toFixed(2)}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'available',
      key: 'available',
      width: 100,
      align: 'center',
      render: (available: boolean) => (
        <Tag 
          color={available ? 'success' : 'default'}
          style={{ borderRadius: 6, padding: '2px 10px' }}
        >
          {available ? <><CheckCircleOutlined /> 在售</> : <><StopOutlined /> 下架</>}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditDish(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="删除菜品"
            description={`确定要删除"${record.name}"吗？`}
            onConfirm={() => handleDeleteDish(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 过滤菜品
  const filteredDishes = useMemo(() => {
    if (selectedCategory === 'all') return items
    return items.filter(item => item.categoryId === selectedCategory)
  }, [items, selectedCategory])

  // 分类操作
  const handleAddCategory = () => {
    setEditingCategory(null)
    categoryFormRef.current?.resetFields()
    setCategoryModalVisible(true)
  }

  const handleEditCategory = (category: MenuCategoryRow) => {
    setEditingCategory(category)
    categoryFormRef.current?.setFieldsValue(category)
    setCategoryModalVisible(true)
  }

  const handleDeleteCategory = async (id: string) => {
    await dispatch(deleteCategory(id))
    message.success('分类已删除')
  }

  const handleSaveCategory = async (values: { name: string; sortOrder?: number }) => {
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, body: values }))
        message.success('分类已更新')
      } else {
        await dispatch(createCategory(values))
        message.success('分类已创建')
      }
      setCategoryModalVisible(false)
    } catch {
      // error handled in slice
    }
  }

  // 菜品操作
  const handleAddDish = () => {
    setEditingDish(null)
    dishFormRef.current?.resetFields()
    dishFormRef.current?.setFieldsValue({ available: true, price: 0 })
    setDishModalVisible(true)
  }

  const handleEditDish = (dish: MenuItem) => {
    setEditingDish(dish)
    dishFormRef.current?.setFieldsValue({
      ...dish,
      price: dish.price,
    })
    setDishModalVisible(true)
  }

  const handleDeleteDish = async (id: string) => {
    await dispatch(deleteMenuItem(id))
    message.success('菜品已删除')
  }

  const handleSaveDish = async (values: {
    name: string
    categoryId: string
    price: number
    description?: string
    imageUrl?: string
    available: boolean
  }) => {
    try {
      if (editingDish) {
        await dispatch(updateMenuItem({ id: editingDish.id, body: values }))
        message.success('菜品已更新')
      } else {
        await dispatch(createMenuItem(values))
        message.success('菜品已创建')
      }
      setDishModalVisible(false)
    } catch {
      // error handled in slice
    }
  }

  // 分类菜单
  const categoryMenuItems = [
    { key: 'all', label: '全部菜品', icon: <AppstoreOutlined /> },
    ...categories.map(c => ({ key: c.id, label: c.name, icon: <CoffeeOutlined /> })),
  ]

  return (
    <Layout className="home-layout">
      {/* Header */}
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
          <SettingOutlined /> 菜单配置
        </Title>
        <div className="menu-header-actions" />
      </Header>

      <Content className="home-content" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Banner */}
        <section
          className="section-banner"
          style={{
            marginBottom: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="section-banner-ring" />
          <div className="section-banner-ring section-banner-ring-sm" />
          <div className="section-banner-body">
            <div className="section-banner-icon">
              <SettingOutlined />
            </div>
            <Title level={2} className="section-banner-title">
              菜单管理中心
            </Title>
            <Text className="section-banner-desc">
              配置菜品分类，管理菜单内容
            </Text>
          </div>
        </section>

        {/* Content */}
        <Card
          style={{
            borderRadius: 20,
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ padding: '0 24px' }}
            tabBarExtraContent={
              activeTab === 'categories' ? (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddCategory}
                  loading={saving}
                  style={{ borderRadius: 8 }}
                >
                  新增分类
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddDish}
                  loading={saving}
                  style={{ borderRadius: 8 }}
                >
                  新增菜品
                </Button>
              )
            }
          >
            {/* 菜品管理 Tab */}
            <TabPane
              tab={
                <span>
                  <CoffeeOutlined /> 菜品管理
                </span>
              }
              key="dishes"
            >
              <Row gutter={0} style={{ minHeight: 500 }}>
                {/* 左侧分类筛选 */}
                <Col xs={0} sm={6} lg={5}>
                  <div style={{ borderRight: '1px solid #f0f0f0', height: '100%' }}>
                    <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Text strong style={{ padding: '0 16px' }}>分类筛选</Text>
                    </div>
                    <Menu
                      mode="inline"
                      selectedKeys={[selectedCategory]}
                      onClick={({ key }) => setSelectedCategory(key)}
                      style={{ border: 'none' }}
                      items={categoryMenuItems}
                    />
                  </div>
                </Col>

                {/* 右侧菜品列表 */}
                <Col xs={24} sm={18} lg={19}>
                  <div style={{ padding: 24 }}>
                    <Table
                      rowKey="id"
                      columns={dishColumns}
                      dataSource={filteredDishes}
                      loading={loading}
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 道菜品`,
                      }}
                      locale={{
                        emptyText: (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            selectedCategory === 'all' 
                              ? '暂无菜品，点击上方按钮添加' 
                              : '该分类下暂无菜品'
                          }
                          />
                        ),
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </TabPane>

            {/* 分类管理 Tab */}
            <TabPane
              tab={
                <span>
                  <AppstoreOutlined /> 分类管理
                </span>
              }
              key="categories"
            >
              <div style={{ padding: 24 }}>
                <Table
                  rowKey="id"
                  columns={categoryColumns}
                  dataSource={categories}
                  loading={loading}
                  pagination={false}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无分类，点击上方按钮添加"
                      />
                    ),
                  }}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Content>

      {/* 分类编辑/新增 Modal */}
      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        footer={null}
        width={480}
      >
        <Form
          ref={categoryFormRef}
          layout="vertical"
          onFinish={handleSaveCategory}
          initialValues={{ sortOrder: categories.length + 1 }}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="如：主食、饮品、小吃" size="large" />
          </Form.Item>
          <Form.Item
            name="sortOrder"
            label="排序"
            rules={[{ required: true, message: '请输入排序数字' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} size="large" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCategoryModalVisible(false)} size="large">
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
                size="large"
              >
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 菜品编辑/新增 Modal */}
      <Modal
        title={editingDish ? '编辑菜品' : '新增菜品'}
        open={dishModalVisible}
        onCancel={() => setDishModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          ref={dishFormRef}
          layout="vertical"
          onFinish={handleSaveDish}
          initialValues={{ available: true }}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="菜品名称"
                rules={[{ required: true, message: '请输入菜品名称' }]}
              >
                <Input placeholder="如：宫保鸡丁" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="价格 (¥)"
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="选择分类" size="large">
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="菜品描述">
            <TextArea
              rows={3}
              placeholder="描述菜品特色、口味等"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item name="imageUrl" label="图片链接">
            <Input placeholder="https://..." size="large" prefix={<PictureOutlined />} />
          </Form.Item>

          <Form.Item
            name="available"
            label="售卖状态"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="在售"
              unCheckedChildren="下架"
              style={{ width: 70 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setDishModalVisible(false)} size="large">
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
                size="large"
              >
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </Layout>
  )
}
