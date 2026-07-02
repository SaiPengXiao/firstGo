export interface Post {
  id: string
  title: string
  summary: string
  author: string
  section: 'thinking' | 'collab' | 'toolbox'
  views: number
  createdAt: string
  coverUrl?: string
}
