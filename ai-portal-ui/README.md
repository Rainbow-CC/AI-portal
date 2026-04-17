# AI Portal UI - 前端工程说明文档

本项目是“信托 AI 技术中台”的前端实现部分，旨在为业务系统、管理员及开发者提供直观、高效的 AI 能力管理与监控界面。

## 1. 设计理念 (Design Principles)

基于 `index.html` 原型，前端设计遵循以下原则：
*   **专业感 (Professional)**：采用 `Inter` 字体族，配合 `slate` 色系与母行标准色 `tech-blue (#0052D9)`。
*   **高信息密度**：采用卡片化布局（Card-based Layout），在有限的空间内展示核心指标、调用趋势及排行。
*   **响应式与动效**：利用 Tailwind CSS 实现平滑的响应式适配，并加入 `animate-in` 微动效提升用户感知。

## 2. 技术栈 (Tech Stack)

*   **核心框架**: React 18 (Concurrent Mode)
*   **构建工具**: Vite (极速开发响应)
*   **UI 组件库**: Ant Design 5.x (使用 CSS-in-JS 与 主题定制)
*   **样式方案**: Tailwind CSS (处理布局、间距与自定义原子样式)
*   **状态管理**: 
    *   **Zustand**: 轻量级全局 UI 状态。
    *   **TanStack Query (React Query)**: 处理异步数据、缓存与实时指标轮询。
*   **路由**: React Router 6
*   **图表**: Ant Design Charts (基于 G2Plot)

## 3. 功能模块架构 (View Architecture)

1.  **数据大盘 (Dashboard)**
    *   展示今日请求数、网关状态、可用性等核心指标。
    *   实时展示近 7 日调用量趋势图。
    *   展示 API 与 应用调用的 TOP 排行榜。
2.  **能力地图 (Capability Map)**
    *   卡片式展示中台集成的原子能力（合同提取、OCR、意图识别等）。
    *   支持在线调试入口与文档跳转。
3.  **AI 案例汇总 (Cases)**
    *   展示 AI 在风险管理、合规审计等业务场景的落地实践。
    *   包含案例详情页，展示业务背景、解决方案及应用成效。
4.  **开发者中心 (Developer Center)**
    *   提供 API 文档导航。
    *   展示多语言调用代码示例（支持语法高亮）。
    *   提供 API Endpoint 快速复制与参数说明。
5.  **监控审计 (Monitoring)**
    *   (规划中) 展示全链路追踪、异常拦截日志及审计看板。

## 4. 目录结构建议

```text
ai-portal-ui/
├── src/
│   ├── assets/          # 静态资源、图标
│   ├── components/      # 通用基础组件 (Button, Card, ChartWrapper)
│   ├── hooks/           # 自定义 Hook (useMetrics, useAuth)
│   ├── services/        # API 请求封装 (Axios 拦截器)
│   ├── store/           # Zustand 状态定义
│   ├── views/           # 页面级视图 (Dashboard, Developer, etc.)
│   ├── App.tsx          # 路由入口与布局封装
│   └── main.tsx         # 应用挂载点
├── tailwind.config.js   # Tailwind 颜色与主题配置
└── README.md
```

## 5. 开发规范

*   **组件优先**: 优先使用 Ant Design 组件以保证一致性，通过 Tailwind 调整间距与细微布局。
*   **响应式**: 所有新开发的视图必须适配 `md (768px)` 及以上分辨率。
*   **Mock 数据**: 在后端接口未就绪前，在 `services/` 层统一使用 Mock 实现。
