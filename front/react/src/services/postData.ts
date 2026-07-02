import type { Post } from '../types/post'

export const mockHotPosts: Post[] = [
  {
    id: '1',
    title: '从 Redux 到 Zustand：状态管理的一次思维跃迁',
    summary: '当我们不再执着于 action/reducer 的模式时，状态管理变得异常简单。',
    content: `## 为什么考虑迁移

在过去两年里，Redux 一直是 React 状态管理的主流选择。但随着项目规模的增长，我们开始感受到 Redux 带来的心智负担。

### 繁琐的模板代码

一个简单的状态更新需要经过 action type、action creator、reducer 三个环节。对于新手来说，这个链路过于冗长。

### Zustand 的哲学

Zustand 的设计哲学是"less is more"。它不需要 Provider 包裹，不需要 action/reducer 分离，一个简单的 store 函数就能搞定一切。

\`\`\`ts
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
\`\`\`

### 迁移过程

我们花了大约两周时间完成了核心模块的迁移。最关键的一步是理清现有的状态依赖关系，然后逐步替换。

### 总结

Zustand 并不是要取代 Redux，而是提供了一种更轻量的选择。对于中小型项目来说，它可能是更好的选择。`,
    author: '张晓',
    section: 'thinking',
    views: 2340,
    createdAt: '2026-06-28',
    comments: [
      { id: 'c1', author: '李明', content: '我们团队也在考虑迁移，这篇文章很有参考价值！', createdAt: '2026-06-29' },
      { id: 'c2', author: '王五', content: '同意，Redux Toolkit 已经简化了很多，但 Zustand 的简洁性确实难以抗拒。', createdAt: '2026-06-30' },
    ],
  },
  {
    id: '2',
    title: 'Rust + WASM 在 Web 端的落地实践',
    summary: '我们用 Rust 重写了核心计算模块，性能提升了 20 倍。',
    content: `## 背景

我们的 Web 应用需要处理大量图像计算，纯 JavaScript 实现的性能瓶颈越来越明显。

### 为什么选择 Rust + WASM

Rust 的内存安全特性和接近 C 的性能表现，加上 WASM 的浏览器原生支持，让这个组合成为了理想的选择。

### 技术架构

我们使用 wasm-pack 将 Rust 代码编译为 WASM 模块，通过 Web Worker 在后台线程中运行计算密集型任务。

### 性能对比

在图像压缩场景下，Rust + WASM 方案比纯 JS 方案快了约 20 倍，内存占用降低了 60%。

### 经验教训

调试 WASM 模块仍然比较困难，建议在开发阶段充分编写 Rust 端的单元测试。`,
    author: '李明',
    section: 'collab',
    views: 1890,
    createdAt: '2026-06-25',
    comments: [
      { id: 'c3', author: '赵六', content: '我们也在尝试类似的方案，想问下你们在 debug 方面有什么经验？', createdAt: '2026-06-26' },
    ],
  },
  {
    id: '3',
    title: '我的 CLI 工具链：效率提升 300% 的秘诀',
    summary: '一套精心打造的终端工具集，从 alias 到自定义脚本。',
    content: `## 前言

作为开发者，我们每天在终端中花费大量时间。一套趁手的 CLI 工具链可以显著提升工作效率。

### 核心工具

- **fzf**: 模糊搜索一切
- **tmux**: 会话管理
- **zsh + oh-my-zsh**: 强大的 shell 体验
- **ripgrep**: 极速文本搜索
- **bat**: 带语法高亮的 cat 替代品

### 自定义脚本

我写了一些小脚本来处理日常任务，比如快速切换项目目录、自动生成 Git commit message 等。

### 效率提升

经过统计，使用这套工具链后，我每天在重复性操作上节省了约 40 分钟。`,
    author: '王五',
    section: 'toolbox',
    views: 1567,
    createdAt: '2026-06-22',
    comments: [],
  },
  {
    id: '4',
    title: '微服务架构下如何做分布式追踪',
    summary: 'OpenTelemetry + Jaeger 的完整落地指南。',
    content: `## 为什么需要分布式追踪

在微服务架构中，一个用户请求可能经过十几个服务。当出现问题时，定位根因变得异常困难。

### OpenTelemetry 简介

OpenTelemetry 是一个开源的可观测性框架，它统一了 Trace、Metrics、Logs 三大数据类型的采集和导出。

### 实施步骤

1. 在各个服务中引入 OpenTelemetry SDK
2. 配置 Span 和 Context 传播
3. 部署 Jaeger 作为后端存储
4. 配置采样策略

### 实践中的坑

异步消息场景下的 Context 传播是最容易出错的地方，需要特别注意。`,
    author: '赵六',
    section: 'thinking',
    views: 1230,
    createdAt: '2026-06-20',
    comments: [
      { id: 'c4', author: '孙七', content: 'Jaeger 的存储成本确实是个问题，你们有做采样吗？', createdAt: '2026-06-21' },
    ],
  },
  {
    id: '5',
    title: '共建 AI Coding Agent 的踩坑与反思',
    summary: '从一个 idea 到可用的工具，我们经历了什么。',
    content: `## 起点

去年我们开始探索 AI 辅助编程的可能性，从简单的代码补全到完整的 Agent 系统。

### 架构设计

我们的 Agent 系统包含以下几个核心模块：
- 代码理解引擎
- 任务规划器
- 代码生成器
- 验证与测试

### 最大的挑战

不是技术问题，而是如何在"自动化"和"可控性"之间找到平衡。

### 反思

AI Agent 不是万能的，最好的效果是"人机协作"而非"完全替代"。`,
    author: '孙七',
    section: 'collab',
    views: 980,
    createdAt: '2026-06-18',
    comments: [],
  },
  {
    id: '6',
    title: 'TypeScript 高级类型体操实战',
    summary: '从 conditional type 到 template literal type。',
    content: `## 类型体操的意义

TypeScript 的类型系统是图灵完备的，这意味着我们可以用它来表达任何逻辑。

### Conditional Types

条件类型是类型体操的基础，配合 infer 关键字可以实现强大的类型推导。

### Template Literal Types

TypeScript 4.1 引入的模板字面量类型开启了类型体操的新纪元。

### 实战案例

我们来看一个实际的例子：实现一个类型安全的 URL 参数解析器。

类型体操虽好，但不要过度使用。代码的可读性应该始终放在第一位。`,
    author: '张三',
    section: 'thinking',
    views: 890,
    createdAt: '2026-06-15',
    comments: [],
  },
  {
    id: '7',
    title: '重构的节奏：什么时候该停下来',
    summary: '过度重构和放任不管一样有害。',
    content: `## 重构的诱惑

每个开发者都希望代码是完美的。但持续重构可能会影响交付节奏。

### 判断标准

我总结了几个判断是否需要重构的标准：
1. 这段代码修改频率是否很高？
2. 是否有人在理解这段代码时遇到困难？
3. 重构后的收益是否大于成本？

### 什么时候该停下来

当重构开始影响业务交付时，就是该停下来的时候了。完美主义是工程师的敌人。`,
    author: '刘一',
    section: 'thinking',
    views: 650,
    createdAt: '2026-06-10',
    comments: [],
  },
  {
    id: '8',
    title: '开源项目的可持续性：从维护者视角',
    summary: 'Star 数不等于健康度。',
    content: `## 开源的另一面

GitHub Star 数常常被用来衡量一个项目的成功，但维护者知道，Star 数不等于健康度。

### 可持续性的关键因素

- 核心贡献者的稳定性
- 社区响应的及时性
- 文档的完善程度
- 资金支持

### 个人经验

作为几个开源项目的维护者，我最大的感受是：社区的健康比代码的完美更重要。`,
    author: '李四',
    section: 'collab',
    views: 720,
    createdAt: '2026-06-12',
    comments: [],
  },
  {
    id: '9',
    title: 'Docker Compose 编排最佳实践',
    summary: '从开发到生产的一致性环境。',
    content: `## Docker Compose 的价值

Docker Compose 让我们能够用声明式的方式定义多容器应用。

### 最佳实践

1. 使用 profile 区分开发和生产环境
2. 合理使用 depends_on 和 healthcheck
3. 网络隔离
4. 卷管理策略

### 从开发到生产

通过多 Compose 文件叠加，我们可以实现开发环境和生产环境的一致性，同时保持各自的灵活性。`,
    author: '陈二',
    section: 'toolbox',
    views: 1100,
    createdAt: '2026-06-16',
    comments: [],
  },
  {
    id: '10',
    title: 'Git 工作流的艺术：一个团队的协作故事',
    summary: 'GitFlow、TrunkBased 还是 GitHub Flow？',
    content: `## 选择工作流

没有最好的工作流，只有最适合团队的工作流。

### 三种主流工作流

- **GitFlow**: 适合有固定发布周期的团队
- **GitHub Flow**: 适合持续部署的团队
- **Trunk Based**: 适合成熟的 DevOps 团队

### 我们的选择

经过多次迭代，我们最终选择了简化版的 GitHub Flow，配合 feature flag 来控制功能发布。`,
    author: '周八',
    section: 'toolbox',
    views: 870,
    createdAt: '2026-06-08',
    comments: [],
  },
]

export const mockPostsBySection: Record<string, Post[]> = {
  thinking: mockHotPosts.filter((p) => p.section === 'thinking'),
  collab: mockHotPosts.filter((p) => p.section === 'collab'),
  toolbox: mockHotPosts.filter((p) => p.section === 'toolbox'),
}

export function getPostById(id: string): Post | undefined {
  return mockHotPosts.find((p) => p.id === id)
}