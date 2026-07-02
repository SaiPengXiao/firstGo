import {
  BulbOutlined,
  ExperimentOutlined,
  EyeOutlined,
  LeftOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { Button, Card, Layout, List, Space, Tag, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import type { Post } from '../types/post'
import { mockPostsBySection } from '../services/postData'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography

const sectionMeta: Record<
  string,
  { title: string; icon: React.ReactNode; color: string }
> = {
  thinking: {
    title: '我的思考',
    icon: <BulbOutlined />,
    color: '#667eea',
  },
  collab: {
    title: '未来共研室',
    icon: <ExperimentOutlined />,
    color: '#52c41a',
  },
  toolbox: {
    title: '工具箱 · 我的实践',
    icon: <ToolOutlined />,
    color: '#fa8c16',
  },
}

export default function PostListPage() {
  const { section } = useParams<{ section: string }>()
  const navigate = useNavigate()
  const meta = section ? sectionMeta[section] : undefined
  const posts: Post[] = section ? mockPostsBySection[section] ?? [] : []

  if (!meta) {
    return (
      <Layout className="home-layout">
        <Content className="home-content">
          <Title level={3}>板块不存在</Title>
          <Button onClick={() => navigate('/home')}>返回首页</Button>
        </Content>
      </Layout>
    )
  }

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <Space>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate('/home')}
            style={{ color: '#fff' }}
          >
            返回
          </Button>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>
            {meta.title}
          </Title>
        </Space>
      </Header>
      <Content className="home-content">
        <div className="post-list-header">
          <span className="post-list-icon">{meta.icon}</span>
          <Title level={3} style={{ color: meta.color, margin: 0 }}>
            {meta.title}
          </Title>
        </div>
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3 }}
          dataSource={posts}
          locale={{ emptyText: '暂无帖子' }}
          renderItem={(post: Post) => (
            <List.Item>
              <Card hoverable className="post-card">
                <Title level={5} className="post-card-title">
                  {post.title}
                </Title>
                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  className="post-card-summary"
                >
                  {post.summary}
                </Paragraph>
                <div className="post-card-meta">
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {post.author}
                  </Text>
                  <Space size={4}>
                    <EyeOutlined style={{ fontSize: 13, color: '#999' }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {post.views}
                    </Text>
                  </Space>
                </div>
                <Tag
                  color={meta.color}
                  style={{ marginTop: 8, borderRadius: 4 }}
                >
                  {meta.title}
                </Tag>
              </Card>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  )
}
