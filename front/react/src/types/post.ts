export interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  replies?: Comment[]
}

export interface Post {
  id: string
  title: string
  summary: string
  content: string
  author: string
  section: 'thinking' | 'collab' | 'toolbox'
  views: number
  createdAt: string
  coverUrl?: string
  comments?: Comment[]
}
