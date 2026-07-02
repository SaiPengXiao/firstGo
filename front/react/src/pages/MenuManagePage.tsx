import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined,
  RestOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MenuCategoryRow, MenuItem } from '../types/menu'
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  loadMenu,
  updateCategory,
  updateMenuItem,
} from '../store/menuSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const { Header, Content } = Layout
const { Title, Text } = Typography

type ItemFormValues = {
  categoryId: string
  name: string
  price: number
  description?: string
  imageUrl?: string
  available: boolean
}

type CategoryFormValues = {
  name: string
  sortOrder?: number
}

export default function MenuManagePage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const categories = useAppSelector((s) => s.menu.categories)
  const items = useAppSelector((s) => s.menu.items)
  const loading = useAppSelector((s) => s.menu.loading)
  const saving = useAppSelector((s) => s.menu.saving)
  const error = useAppSelector((s) => s.menu.error)

  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCat, setEditingCat] = useState<MenuCategoryRow | null>(null)
  const [itemForm] = Form.useForm<ItemFormValues>()
  const [catForm] = Form.useForm<CategoryFormValues>()

  useEffect(() => {
    void dispatch(loadMenu(true))
  }, [dispatch])

  const categoryNameById = useMemo(() => {
    const m = new Map<string, string>()
    categories.forEach((c) => m.set(c.id, c.name))
    return m
  }, [categories])

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  )

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const ca = categoryNameById.get(a.categoryId) ?? ''
      const cb = categoryNameById.get(b.categoryId) ?? ''
      return ca.localeCompare(cb, 'zh-CN')
    })
  }, [items, categoryNameById])

  const openCreateItem = () => {
    setEditingItem(null)
    const defaultCat = sortedCategories[0]?.id ?? ''
    itemForm.setFieldsValue({
      categoryId: defaultCat,
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      available: true,
    })
    setItemModalOpen(true)
  }

  const openEditItem = (record: MenuItem) => {
    setEditingItem(record)
    itemForm.setFieldsValue({
      categoryId: record.categoryId,
      name: record.name,
      price: record.price,
      description: record.description ?? '',
      imageUrl: record.imageUrl ?? '',
      available: record.available,
    })
    setItemModalOpen(true)
  }

  const handleItemSubmit = async () => {
    const values = await itemForm.validateFields()
    try {
      if (editingItem) {
        await dispatch(
          updateMenuItem({
            id: editingItem.id,
            body: {
              categoryId: values.categoryId,
              name: values.name,
              price: values.price,
              description: values.description,
              imageUrl: values.imageUrl,
              isAvailable: values.available,
            },
          }),
        ).unwrap()
        message.success('已更新菜品')
      } else {
        await dispatch(
          createMenuItem({
            categoryId: values.categoryId,
            name: values.name,
            price: values.price,
            description: values.description,
            imageUrl: values.imageUrl,
            isAvailable: values.available,
          }),
        ).unwrap()
        message.success('已添加菜品')
      }
      setItemModalOpen(false)
    } catch (e) {
      message.error(e instanceof Error ? e.message : '保存失败')
    }
  }

  const openCreateCat = () => {
    setEditingCat(null)
    catForm.setFieldsValue({ name: '', sortOrder: sortedCategories.length })
    setCatModalOpen(true)
  }

  const openEditCat = (record: MenuCategoryRow) => {
    setEditingCat(record)
    catForm.setFieldsValue({ name: record.name, sortOrder: record.sortOrder })
    setCatModalOpen(true)
  }

  const handleCatSubmit = async () => {
    const values = await catForm.validateFields()
    try {
      if (editingCat) {
        await dispatch(
          updateCategory({
            id: editingCat.id,
            body: { name: values.name, sortOrder: values.sortOrder },
          }),
        ).unwrap()
        message.success('已更新分类')
      } else {
        await dispatch(
          createCategory({
            name: values.name,
            sortOrder: values.sortOrder,
          }),
        ).unwrap()
        message.success('已添加分类')
      }
      setCatModalOpen(false)
    } catch (e) {
      message.error(e instanceof Error ? e.message : '保存失败')
    }
  }

  const handleDeleteCat = async (id: string) => {
    try {
      await dispatch(deleteCategory(id)).unwrap()
      message.success('已删除分类')
    } catch (e) {
      message.error(e instanceof Error ? e.message : '删除失败')
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await dispatch(deleteMenuItem(id)).unwrap()
      message.success('已删除')
    } catch (e) {
      message.error(e instanceof Error ? e.message : '删除失败')
    }
  }

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
            返回点菜
          </Button>
        </div>
        <Title level={4} style={{ margin: 0, color: '#1a1a2e' }}>
          <RestOutlined /> 菜单配置
        </Title>
        <div style={{ width: 80 }} />
      </Header>

      <Content className="home-content menu-page-content">
        <div className="menu-manage-toolbar">
          <div>
            <Title level={3} className="menu-page-title">
              管理菜单
            </Title>
            <Text type="secondary">需登录，对接后端编辑接口（Bearer Token）</Text>
          </div>
          <div className="menu-manage-actions">
            <Button onClick={openCreateCat} disabled={saving}>
              新增分类
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateItem} disabled={saving || sortedCategories.length === 0}>
              新增菜品
            </Button>
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" tip="加载菜单…" />
          </div>
        ) : (
          <>
            <Title level={5} style={{ marginBottom: 12 }}>
              分类
            </Title>
            <Table
              rowKey="id"
              size="small"
              dataSource={sortedCategories}
              pagination={false}
              style={{ marginBottom: 32 }}
              columns={[
                { title: '名称', dataIndex: 'name' },
                { title: '排序', dataIndex: 'sortOrder', width: 80 },
                {
                  title: '操作',
                  key: 'actions',
                  width: 120,
                  render: (_: unknown, record: MenuCategoryRow) => (
                    <>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openEditCat(record)}
                      />
                      <Popconfirm
                        title="删除该分类？"
                        description="分类下若有菜品可能无法删除"
                        onConfirm={() => void handleDeleteCat(record.id)}
                      >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </>
                  ),
                },
              ]}
            />

            <Title level={5} style={{ marginBottom: 12 }}>
              菜品
            </Title>
            <Table
              rowKey="id"
              dataSource={sortedItems}
              loading={saving}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  render: (name: string, row: MenuItem) => (
                    <span>
                      {name}
                      {!row.available && (
                        <Tag color="default" style={{ marginLeft: 8 }}>
                          已下架
                        </Tag>
                      )}
                    </span>
                  ),
                },
                {
                  title: '分类',
                  dataIndex: 'categoryId',
                  width: 100,
                  render: (id: string) => <Tag>{categoryNameById.get(id) ?? id}</Tag>,
                },
                {
                  title: '价格',
                  dataIndex: 'price',
                  width: 100,
                  render: (p: number) => `¥${p.toFixed(2)}`,
                },
                {
                  title: '描述',
                  dataIndex: 'description',
                  ellipsis: true,
                },
                {
                  title: '操作',
                  key: 'actions',
                  width: 140,
                  render: (_: unknown, record: MenuItem) => (
                    <>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openEditItem(record)}
                      />
                      <Popconfirm
                        title="删除该菜品？"
                        onConfirm={() => void handleDeleteItem(record.id)}
                      >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </>
                  ),
                },
              ]}
            />
          </>
        )}
      </Content>

      <Modal
        title={editingItem ? '编辑菜品' : '新增菜品'}
        open={itemModalOpen}
        confirmLoading={saving}
        onOk={() => void handleItemSubmit()}
        onCancel={() => setItemModalOpen(false)}
        destroyOnClose
        okText="保存"
      >
        <Form form={itemForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="categoryId" label="分类" rules={[{ required: true }]}>
            <Select
              options={sortedCategories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="如：红烧肉" maxLength={40} />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格（元）"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber min={0} max={9999} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} maxLength={120} showCount />
          </Form.Item>
          <Form.Item name="imageUrl" label="图片 URL">
            <Input placeholder="可选" />
          </Form.Item>
          <Form.Item name="available" label="上架" valuePropName="checked">
            <Switch checkedChildren="在售" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingCat ? '编辑分类' : '新增分类'}
        open={catModalOpen}
        confirmLoading={saving}
        onOk={() => void handleCatSubmit()}
        onCancel={() => setCatModalOpen(false)}
        destroyOnClose
        okText="保存"
      >
        <Form form={catForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入分类名' }]}>
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序（越小越靠前）">
            <InputNumber min={0} max={999} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}