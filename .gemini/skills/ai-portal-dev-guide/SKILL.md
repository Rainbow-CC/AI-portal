---
name: ai-portal-dev-guide
description: Guidelines and standards for the AI Portal project. Use when developing or refactoring the AI Gateway, Admin Backend, or React UI to ensure architectural consistency and adherence to UI/UX standards.
---

# AI Portal 开发者指南

## 核心任务

### 1. 后端开发 (Gateway & Admin)
*   **网关开发**: 所有逻辑必须是非阻塞的 (Reactive)。使用 `Mono` 或 `Flux`。
    *   参考 [architecture.md](references/architecture.md) 了解网关职责。
*   **协议适配**: 内部调用使用标准 JSON 协议，通过 `ProtocolFilter` 转换为目标厂商 API。
*   **异常处理**: 熔断逻辑由 `resilience4j` 和 `FallbackController` 提供。

### 2. 前端开发 (React UI)
*   **组件实现**: 采用 **Ant Design 5.x + Tailwind CSS** 的混合模式。
    *   参考 [ui-standards.md](references/ui-standards.md) 了解 UI 视觉和技术规范。
*   **数据采集**: 使用 `TanStack Query` 进行接口轮询。
*   **响应式布局**: 确保在平板和电脑终端都有良好体验。

## 关键资源
*   **项目架构**: 详见 [architecture.md](references/architecture.md)。
*   **UI/UX 规范**: 详见 [ui-standards.md](references/ui-standards.md)。
