# AI 网关调用统计与可观测性设计方案

## 1. 概述
本文档详细描述了 AI Portal 网关模块（Gateway）中关于调用统计数据的采集、存储与展示逻辑。该方案旨在满足高性能网关环境下的实时监控（Real-time Monitoring）与长周期趋势分析（Historical Analysis）需求。

## 2. 核心指标定义
系统需要支撑以下两个维度的多维分析：

| 维度 | 指标 | 展示形式 |
| :--- | :--- | :--- |
| **接口维度 (API)** | 调用量、成功率、平均响应耗时 | 近 7 日趋势柱状图 / 饼图 |
| **系统维度 (Application)** | 应用请求分布、TOP 调用排行 | 排行榜 / 热力图 |

## 3. 数据采集架构

### 3.1 采集点 (Interception Point)
数据采集统一发生在 **Gateway Global Filter 的 Post 阶段**。
- **理由**：该阶段请求已完成路由转发并获得了下游服务的响应，能同时捕获请求元数据（Path, Key）与执行结果（Status Code, Latency）。
- **技术实现**：扩展 `AccessLoggingFilter`，确保在 `chain.filter(exchange).then()` 回调中触发异步记录。

### 3.2 原始数据模型 (Data Payload)
每条流水记录包含以下核心字段：
- `timestamp`: 毫秒级请求发生时间
- `app_key`: 映射至调用系统的标识符（源自 `X-API-KEY`）
- `api_path`: 访问的接口路径
- `http_method`: GET/POST
- `status_code`: 响应状态码
- `is_success`: 逻辑判定结果 (200-299 为成功)
- `duration`: 耗时（毫秒）

## 4. 存储策略 (Storage Strategy)
采用 **“双层存储、读写分离”** 架构，平衡实时性与持久性。

### 4.1 实时层 (Hot Tier): Redis
用于支撑前端 Dashboard 的实时秒级刷新和 TOP 排行展示。
- **结构设计**：
  - **接口日计**: `stats:api:{path}:{yyyyMMdd}:total` (Counter)
  - **接口成功计**: `stats:api:{path}:{yyyyMMdd}:success` (Counter)
  - **应用日计**: `stats:system:{appKey}:{yyyyMMdd}` (Counter)
- **过期策略**：缓存数据保留 15 天，过期自动清理。

### 4.2 持久层 (Warm Tier): MySQL
用于长周期的趋势分析、审计追踪及报表生成。
- **表结构预览**: `api_access_log`
  - `id` (BigInt, PK)
  - `trace_id` (String, Indexed)
  - `app_key`, `api_path`, `duration`, `status`, `created_at`
- **写入机制**：**严禁同步写入**。通过 Spring 事件驱动 (`ApplicationEvent`) 或 消息队列（Redis Stream/RabbitMQ）实现网关逻辑与 I/O 持久化的彻底解耦。

## 5. 性能与安全性考量
1.  **非阻塞处理**：所有统计更新逻辑必须运行在 `Schedulers.boundedElastic()` 线程池中，严禁阻塞网关 Netty 调度线程。
2.  **数据脱敏**：统计日志中严禁记录 Body 中的隐私数据（如 Base64 图片、个人信息），仅保留统计元数据。
3.  **批量写入**：在持久化层可引入简单的 Buffer 机制，每积累 100 条或每 5 秒进行一次批量数据库插入（Batch Insert），降低数据库压力。

## 6. 查询逻辑 (Query Flow)
- **实时数据**：Admin 模块直接读取 Redis 指标返回，响应耗时 < 10ms。
- **趋势数据**：Admin 模块执行 MySQL 聚合查询（如 `GROUP BY api_path, DAY(created_at)`）。
- **优化**：对于超大规模流水，可定时（如每日凌晨）将流水表聚合为每日汇总表（Daily Aggregation Table）。
