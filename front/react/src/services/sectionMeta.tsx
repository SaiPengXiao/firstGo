import type { ReactNode } from 'react'
import {
  BulbOutlined,
  ExperimentOutlined,
  ToolOutlined,
} from '@ant-design/icons'

export const sectionMeta: Record<
  string,
  { title: string; icon: ReactNode; color: string; gradient: string; desc: string }
> = {
  thinking: {
    title: '我的思考',
    icon: <BulbOutlined />,
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    desc: '记录日常灵感与技术反思',
  },
  collab: {
    title: '未来共研室',
    icon: <ExperimentOutlined />,
    color: '#11998e',
    gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
    desc: '前沿探索与开放协作',
  },
  toolbox: {
    title: '工具箱 · 我的实践',
    icon: <ToolOutlined />,
    color: '#f093fb',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    desc: '实战沉淀与经验汇总',
  },
}