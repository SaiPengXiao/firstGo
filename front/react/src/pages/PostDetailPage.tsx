import {
  EyeOutlined,
  LeftOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Divider, Input, Layout, List, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Comment } from '../types/post'
import { getPostById } from '../services/postData'
import { sectionMeta } from '../services/sectionMeta'
import { useAppSelector } from '../store/hooks'

const { Header, Content } = Layout
const { Title, Text } = Typography

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

export default function PostDetailPage() {
  const { section, postId } = useParams<{ section: string; postId: string }>()
  const navigate = useNavigate()
  const userPosts = useAppSelector((state) => state.posts.userPosts)
  const post = postId
    ? (userPosts.find((p) => p.id === postId) ?? getPostById(postId))
    : undefined
  const meta = section ? sectionMeta[section] : undefined

  const [localComments, setLocalComments] = useState<Comment[]>([])
  const [localReplies, setLocalReplies] = useState<Record<string, Comment[]>>({})
  const [commentText, setCommentText] = useState('')
  const [replyText, setReplyText] = useState('')
  const [replyTarget, setReplyTarget] = useState<string | null>(null)
  const [showAllComments, setShowAllComments] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})

  const allComments = [...(post?.comments ?? []), ...localComments]
  const visibleComments = showAllComments ? allComments : allComments.slice(0, 2)
  const hasMore = allComments.length > 2

  const getReplies = (commentId: string): Comment[] => {
    const original = post?.comments?.find((c) => c.id === commentId)?.replies ?? []
    const added = localReplies[commentId] ?? []
    return [...original, ...added]
  }

  const handleAddComment = () => {
    const trimmed = commentText.trim()
    if (!trimmed) return
    const newComment: Comment = {
      id: `local-${Date.now()}`,
      author: '我',
      content: trimmed,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setLocalComments((prev) => [...prev, newComment])
    setCommentText('')
  }

  const handleAddReply = (parentId: string) => {
    const trimmed = replyText.trim()
    if (!trimmed) return
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author: '我',
      content: trimmed,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setLocalReplies((prev) => ({
      ...prev,
      [parentId]: [...(prev[parentId] ?? []), newReply],
    }))
    setReplyText('')
    setReplyTarget(null)
  }

  const startReply = (commentId: string) => {
    setReplyTarget(commentId)
    setReplyText('')
  }

  if (!post || !meta) {
    return (
      <Layout className="home-layout">
        <Content className="home-content">
          <Title level={3}>文章不存在</Title>
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
            onClick={() => navigate(`/section/${post.section}`)}
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
        <article className="post-detail">
          {/* Article Header */}
          <div className="post-detail-header">
            <Title className="post-detail-title">{post.title}</Title>
            <div className="post-detail-meta">
              <div className="post-detail-author">
                <Avatar size={36} icon={<UserOutlined />} className="post-card-avatar" />
                <div>
                  <Text strong>{post.author}</Text>
                  <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                    {post.createdAt} · <EyeOutlined /> {post.views.toLocaleString()} 阅读
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <RenderMarkdown content={post.content} />
        </article>

        {/* Comments */}
        <Divider />
        <div className="post-comments">
          <Title level={4}>
            评论 {allComments.length > 0 ? `(${allComments.length})` : ''}
          </Title>

          {allComments.length > 0 ? (
            <>
              <List
                dataSource={visibleComments}
                locale={{ emptyText: '暂无评论' }}
                renderItem={(comment) => {
                  const replies = getReplies(comment.id)
                  const showReplies = !!expandedReplies[comment.id]
                  const repliesToShow = showReplies ? replies : replies.slice(0, 2)
                  const hasMoreReplies = replies.length > 2

                  return (
                  <List.Item>
                    <div className="post-comment">
                      <div className="post-comment-author">
                        <Avatar size={28} icon={<UserOutlined />} className="post-card-avatar" />
                        <div>
                          <Text strong style={{ fontSize: 14 }}>{comment.author}</Text>
                          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                            {comment.createdAt}
                          </Text>
                        </div>
                      </div>
                      <Text className="post-comment-content">{comment.content}</Text>
                      <Button
                        type="link"
                        size="small"
                        className="post-comment-reply-btn"
                        onClick={() => startReply(comment.id)}
                      >
                        回复
                      </Button>

                      {/* Nested replies */}
                      {replies.length > 0 && (
                        <div className="post-comment-replies">
                          {repliesToShow.map((reply) => (
                            <div key={reply.id} className="post-comment-reply">
                              <div className="post-comment-author">
                                <Avatar size={22} icon={<UserOutlined />} className="post-card-avatar" />
                                <div>
                                  <Text strong style={{ fontSize: 13 }}>{reply.author}</Text>
                                  <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>
                                    {reply.createdAt}
                                  </Text>
                                </div>
                              </div>
                              <Text className="post-comment-content" style={{ fontSize: 13, paddingLeft: 30 }}>
                                {reply.content}
                              </Text>
                            </div>
                          ))}
                          {hasMoreReplies && (
                            <Button
                              type="link"
                              size="small"
                              className="post-comments-toggle"
                              onClick={() => {
                                setExpandedReplies((prev) => ({
                                  ...prev,
                                  [comment.id]: !showReplies,
                                }))
                              }}
                            >
                              {showReplies ? '收起回复' : `显示全部回复 (${replies.length})`}
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Reply input */}
                      {replyTarget === comment.id && (
                        <div className="post-comment-reply-form">
                          <Input.TextArea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`回复 ${comment.author}...`}
                            autoSize={{ minRows: 2, maxRows: 3 }}
                            onPressEnter={(e) => {
                              if (!e.shiftKey) {
                                e.preventDefault()
                                handleAddReply(comment.id)
                              }
                            }}
                          />
                          <div className="post-comment-reply-actions">
                            <Button size="small" onClick={() => setReplyTarget(null)}>
                              取消
                            </Button>
                            <Button
                              size="small"
                              type="primary"
                              onClick={() => handleAddReply(comment.id)}
                              disabled={!replyText.trim()}
                            >
                              回复
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </List.Item>
                  )
                }}
              />
              {hasMore && (
                <Button
                  type="link"
                  className="post-comments-toggle"
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  {showAllComments ? '收起评论' : `显示全部评论 (${allComments.length})`}
                </Button>
              )}
            </>
          ) : (
            <Text type="secondary">暂无评论，快来抢沙发吧</Text>
          )}

          <Divider style={{ margin: '20px 0' }} />
          <div className="post-comment-form">
            <Input.TextArea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下你的想法..."
              autoSize={{ minRows: 2, maxRows: 4 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleAddComment()
                }
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="post-comment-submit"
            >
              发布
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  )
}