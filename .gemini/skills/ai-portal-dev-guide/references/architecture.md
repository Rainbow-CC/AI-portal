# AI Portal 架构规范

## 1. 系统角色
*   **ai-portal-gateway**: 基于 Spring Cloud Gateway 的高性能异步网关。负责协议转换、SSE 转发和 API Key 鉴权。
*   **ai-portal-admin**: 基于 Spring Boot 的管理后台。负责配置管理、案例展示和监控指标汇总。
*   **ai-portal-common**: 存放共享的 POJO、常量和工具类。
*   **ai-portal-ui**: 基于 React 18 的管理界面。

## 2. 关键技术细节
*   **响应式模型**: 网关层强制使用 Project Reactor (Mono/Flux)。
*   **SSE 转发**: 必须支持 `text/event-stream` 的透明透传。
*   **Redis 鉴权**: 采用 `X-API-Key` 头部进行高速校验。
*   **监控**: 利用 Redis 原子计数器统计 TPS 和 Latency。
