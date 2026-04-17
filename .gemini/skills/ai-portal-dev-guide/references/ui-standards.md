# AI Portal UI 规范

## 1. 技术栈
*   **React 18**: 并发渲染，确保流畅性。
*   **Ant Design 5.x**: 核心组件库（Table, Modal, Breadcrumb）。
*   **Tailwind CSS**: 灵活布局和间距控制（`p-4`, `gap-6`）。
*   **TanStack Query**: 定时轮询监控数据。

## 2. 视觉规范
*   **颜色**: 
    *   主色 (Primary): `tech-blue (#0052D9)`。
    *   辅助色: `slate` 色系。
*   **字体**: `Inter` 或苹果系统默认字体。
*   **布局**: 侧边栏导航 + 头部面包屑 + 响应式主内容区。

## 3. 开发规范
*   **响应式**: 必须兼容 `md (768px)`。
*   **组件开发**: 优先使用 AntD 组件，通过 Tailwind 调整样式细节。
*   **监控展示**: 使用 Ant Design Charts (G2Plot) 进行数据可视化。
