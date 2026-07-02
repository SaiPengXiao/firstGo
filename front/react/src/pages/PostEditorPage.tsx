import {
  BulbOutlined,
  ExperimentOutlined,
  LeftOutlined,
  SendOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { Button, Input, Layout, Select, Typography, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Post } from '../types/post'
import { addPost } from '../store/postsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const { Header, Content } = Layout
const { Title, Text } = Typography

const SECTION_OPTIONS = [
  { value: 'thinking', label: '我的思考', icon: <BulbOutlined /> },
  { value: 'collab', label: '未来共研室', icon: <ExperimentOutlined /> },
  { value: 'toolbox', label: '工具箱', icon: <ToolOutlined /> },
]

function RenderMarkdown({ content }: { content: string }) {
  const html = content
    .replace(/### (.+)/g, '<h3>$1</h3>')
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- (.+)/gm, '<li>$1</li>')
    .replace(/(\d+)\. (.+)/g, '<li>$2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')

  return (
    <div
      className="post-detail-body"
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
    />
  )
}

export default function PostEditorPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const [title, setTitle] = useState('')
  const [section, setSection] = useState<Post['section']>('thinking')
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const canPublish = title.trim().length > 0 && content.trim().length > 0

  const handlePublish = () => {
    if (!canPublish) return
    setPublishing(true)

    const summaryText = content.replace(/[#*`\-\d.]/g, '').trim()
    const summary = summaryText.slice(0, 80) + (summaryText.length > 80 ? '…' : '')

    const newPost: Post = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      summary,
      content,
      author: user?.username ?? '我',
      section,
      views: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      comments: [],
    }

    dispatch(addPost(newPost))
    void message.success('发布成功！')
    setPublishing(false)
    navigate(`/section/${section}`)
  }

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <div className="home-header-brand">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ color: '#666' }}
          >
            返回
          </Button>
        </div>
        <Title level={4} style={{ margin: 0, color: '#1a1a2e' }}>
          发表文章
        </Title>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="text"
            onClick={() => setPreview((v) => !v)}
            style={{ color: '#666' }}
          >
            {preview ? '编辑' : '预览'}
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            disabled={!canPublish}
            loading={publishing}
            onClick={handlePublish}
          >
            发布
          </Button>
        </div>
      </Header>

      <Content className="home-content">
        <div className="editor-wrap">
          {/* Meta row */}
          <div className="editor-meta-row">
            <Input
              className="editor-title-input"
              placeholder="文章标题…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <Select
              className="editor-section-select"
              value={section}
              onChange={(v) => setSection(v)}
              options={SECTION_OPTIONS.map((o) => ({
                value: o.value,
                label: (
                  <span>
                    {o.icon} {o.label}
                  </span>
                ),
              }))}
            />
          </div>

          {/* Body */}
          {preview ? (
            <div className="editor-preview">
              <Title className="post-detail-title">{title || '（无标题）'}</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                {user?.username ?? '我'} · {new Date().toISOString().slice(0, 10)}
              </Text>
              <RenderMarkdown content={content} />
            </div>
          ) : (
            <div className="editor-body-wrap">
              <Input.TextArea
                className="editor-textarea"
                placeholder={`支持 Markdown 语法\n\n## 小标题\n\n**加粗**、\`代码\`、- 列表…`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoSize={{ minRows: 20 }}
              />
              <div className="editor-hint">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  支持 Markdown · ## 标题 · **粗体** · `代码` · - 列表
                </Text>
              </div>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  )
}
