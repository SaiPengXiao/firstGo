import {
  EyeOutlined,
  LeftOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Card, Layout, List, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import type { Post } from '../types/post'
import { mockPostsBySection } from '../services/postData'
import { sectionMeta } from '../services/sectionMeta'
import { useAppSelector } from '../store/hooks'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography

const TAG_KEYWORDS: Record<string, string[]> = {
  thinking: ['Redux', 'Zustand', 'TypeScript', '微服务', '重构', '分布式'],
  collab: ['Rust', 'WASM', 'AI', '开源', 'Web', 'Agent'],
  toolbox: ['CLI', 'Docker', 'Git', 'Docker Compose', 'GitFlow', '终端'],
}

const extractTags = (title: string, section: string): string[] => {
  const keywords = TAG_KEYWORDS[section] ?? []
  return keywords.filter((kw) => title.includes(kw)).slice(0, 3)
}

export default function PostListPage() {
  const { section } = useParams<{ section: string }>()
  const navigate = useNavigate()
  const meta = section ? sectionMeta[section] : undefined
  const userPosts = useAppSelector((state) => state.posts.userPosts)
  const mockPosts: Post[] = section ? mockPostsBySection[section] ?? [] : []
  const userSectionPosts = userPosts.filter((p) => p.section === section)
  const posts: Post[] = [...userSectionPosts, ...mockPosts]

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
          {meta.icon} {meta.title}
        </Title>
        <div style={{ width: 80 }} />
      </Header>

      <Content className="home-content">
        {/* ---- Banner ---- */}
        <div className="section-banner" style={{ background: meta.gradient }}>
          <div className="section-banner-ring" />
          <div className="section-banner-ring section-banner-ring-sm" />
          <div className="section-banner-body">
            <div className="section-banner-icon">{meta.icon}</div>
            <Title level={1} className="section-banner-title">
              {meta.title}
            </Title>
            <Text className="section-banner-desc">
              {meta.desc} · {posts.length} 篇文章
            </Text>
          </div>
        </div>

        {/* ---- Post List ---- */}
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3 }}
          dataSource={posts}
          locale={{ emptyText: '暂无帖子' }}
          renderItem={(post: Post) => {
            const tags = extractTags(post.title, post.section)
            return (
              <List.Item>
                <Card
                  hoverable
                  className="post-card"
                  onClick={() => navigate(`/section/${post.section}/${post.id}`)}
                  cover={
                    <img
                      className="post-card-cover"
                      src={`https://picsum.photos/seed/${post.id}/400/120`}
                      alt={post.title}
                    />
                  }
                >
                  {tags.length > 0 && (
                    <div className="post-card-tags">
                      {tags.map((tag) => (
                        <span key={tag} className="post-card-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
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
                    <div className="post-card-author">
                      <Avatar size={26} icon={<UserOutlined />} className="post-card-avatar" />
                      <span>{post.author}</span>
                    </div>
                    <span className="post-card-views">
                      <EyeOutlined /> {post.views.toLocaleString()}
                    </span>
                  </div>
                </Card>
              </List.Item>
            )
          }}
        />
      </Content>
    </Layout>
  )
}