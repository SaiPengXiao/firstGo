import type { Post } from '../types/post'

export const mockHotPosts: Post[] = [
  {
    id: '1',
    title: '从 Redux 到 Zustand：状态管理的一次思维跃迁',
    summary: '当我们不再执着于 action/reducer 的模式时，状态管理变得异常简单。',
    author: '张晓',
    section: 'thinking',
    views: 2340,
    createdAt: '2026-06-28',
  },
  {
    id: '2',
    title: 'Rust + WASM 在 Web 端的落地实践',
    summary: '我们用 Rust 重写了核心计算模块，性能提升了 20 倍。',
    author: '李明',
    section: 'collab',
    views: 1890,
    createdAt: '2026-06-25',
  },
  {
    id: '3',
    title: '我的 CLI 工具链：效率提升 300% 的秘诀',
    summary: '一套精心打造的终端工具集，从 alias 到自定义脚本。',
    author: '王五',
    section: 'toolbox',
    views: 1567,
    createdAt: '2026-06-22',
  },
  {
    id: '4',
    title: '微服务架构下如何做分布式追踪',
    summary: 'OpenTelemetry + Jaeger 的完整落地指南。',
    author: '赵六',
    section: 'thinking',
    views: 1230,
    createdAt: '2026-06-20',
  },
  {
    id: '5',
    title: '共建 AI Coding Agent 的踩坑与反思',
    summary: '从一个 idea 到可用的工具，我们经历了什么。',
    author: '孙七',
    section: 'collab',
    views: 980,
    createdAt: '2026-06-18',
  },
]

export const mockPostsBySection: Record<string, Post[]> = {
  thinking: [
    { id: '1', title: '从 Redux 到 Zustand：状态管理的一次思维跃迁', summary: '当我们不再执着于 action/reducer 的模式时，状态管理变得异常简单。', author: '张晓', section: 'thinking', views: 2340, createdAt: '2026-06-28' },
    { id: '4', title: '微服务架构下如何做分布式追踪', summary: 'OpenTelemetry + Jaeger 的完整落地指南。', author: '赵六', section: 'thinking', views: 1230, createdAt: '2026-06-20' },
    { id: '6', title: 'TypeScript 高级类型体操实战', summary: '从 conditional type 到 template literal type。', author: '张三', section: 'thinking', views: 890, createdAt: '2026-06-15' },
    { id: '7', title: '重构的节奏：什么时候该停下来', summary: '过度重构和放任不管一样有害。', author: '刘一', section: 'thinking', views: 650, createdAt: '2026-06-10' },
  ],
  collab: [
    { id: '2', title: 'Rust + WASM 在 Web 端的落地实践', summary: '我们用 Rust 重写了核心计算模块，性能提升了 20 倍。', author: '李明', section: 'collab', views: 1890, createdAt: '2026-06-25' },
    { id: '5', title: '共建 AI Coding Agent 的踩坑与反思', summary: '从一个 idea 到可用的工具，我们经历了什么。', author: '孙七', section: 'collab', views: 980, createdAt: '2026-06-18' },
    { id: '8', title: '开源项目的可持续性：从维护者视角', summary: 'Star 数不等于健康度。', author: '李四', section: 'collab', views: 720, createdAt: '2026-06-12' },
  ],
  toolbox: [
    { id: '3', title: '我的 CLI 工具链：效率提升 300% 的秘诀', summary: '一套精心打造的终端工具集。', author: '王五', section: 'toolbox', views: 1567, createdAt: '2026-06-22' },
    { id: '9', title: 'Docker Compose 编排最佳实践', summary: '从开发到生产的一致性环境。', author: '陈二', section: 'toolbox', views: 1100, createdAt: '2026-06-16' },
    { id: '10', title: 'Git 工作流的艺术：一个团队的协作故事', summary: 'GitFlow、TrunkBased 还是 GitHub Flow？', author: '周八', section: 'toolbox', views: 870, createdAt: '2026-06-08' },
  ],
}
