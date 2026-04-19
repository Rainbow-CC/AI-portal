# DashScope API 调用指南

本文介绍如何通过 DashScope API 调用千问模型，包括输入输出参数说明及调用示例。

## 地域与请求地址

### 华北2（北京）地域

**HTTP 请求地址：**

- **纯文本模型**（如 `qwen-plus`）：`POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- **多模态模型**（如 `qwen-vl-plus`）：`POST https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`

> SDK 调用无需配置 `base_url`。

### 新加坡地域

**HTTP 请求地址：**

- **纯文本模型**：`POST https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- **多模态模型**：`POST https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`

**SDK 调用配置：**

- **Python 代码**
  ```python
  dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1'
  ```
- **Java 代码**
  - **方式一：**
    ```java
    import com.alibaba.dashscope.protocol.Protocol;
    Generation gen = new Generation(Protocol.HTTP.getValue(), "https://dashscope-intl.aliyuncs.com/api/v1");
    ```
  - **方式二：**
    ```java
    import com.alibaba.dashscope.utils.Constants;
    Constants.baseHttpApiUrl="https://dashscope-intl.aliyuncs.com/api/v1";
    ```

### 美国（弗吉尼亚）地域

**HTTP 请求地址：**

- **纯文本模型**：`POST https://dashscope-us.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- **多模态模型**：`POST https://dashscope-us.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`

**SDK 调用配置：**

- **Python 代码**
  ```python
  dashscope.base_http_api_url = 'https://dashscope-us.aliyuncs.com/api/v1'
  ```
- **Java 代码**
  - **方式一：**
    ```java
    import com.alibaba.dashscope.protocol.Protocol;
    Generation gen = new Generation(Protocol.HTTP.getValue(), "https://dashscope-us.aliyuncs.com/api/v1");
    ```
  - **方式二：**
    ```java
    import com.alibaba.dashscope.utils.Constants;
    Constants.baseHttpApiUrl="https://dashscope-us.aliyuncs.com/api/v1";
    ```

---

## 快速开始

> 您需要已[获取 API Key](https://help.aliyun.com/zh/model-studio/get-api-key)并[配置到环境变量](https://help.aliyun.com/zh/model-studio/configure-api-key-through-environment-variables)。

### 调用示例

#### Python 示例
```python
import os
import dashscope

messages = [
    {'role': 'system', 'content': 'You are a helpful assistant.'},
    {'role': 'user', 'content': '你是谁？'}
]

response = dashscope.Generation.call(
    api_key=os.getenv('DASHSCOPE_API_KEY'),
    model="qwen-plus",
    messages=messages,
    result_format='message'
)
print(response)
```

#### Java 示例
```java
// 建议 dashscope SDK 版本 >= 2.12.0
import java.util.Arrays;
import com.alibaba.dashscope.aigc.generation.Generation;
import com.alibaba.dashscope.aigc.generation.GenerationParam;
import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.common.Message;
import com.alibaba.dashscope.common.Role;
import com.alibaba.dashscope.utils.JsonUtils;

public class Main {
    public static void main(String[] args) {
        try {
            Generation gen = new Generation();
            Message systemMsg = Message.builder()
                .role(Role.SYSTEM.getValue())
                .content("You are a helpful assistant.")
                .build();
            Message userMsg = Message.builder()
                .role(Role.USER.getValue())
                .content("你是谁？")
                .build();
            GenerationParam param = GenerationParam.builder()
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .model("qwen-plus")
                .messages(Arrays.asList(systemMsg, userMsg))
                .resultFormat(GenerationParam.ResultFormat.MESSAGE)
                .build();
            
            GenerationResult result = gen.call(param);
            System.out.println(JsonUtils.toJson(result));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

---

## API 参数说明

### 请求参数 (Input)

| 参数名 | 类型 | 必选 | 说明 |
| :--- | :--- | :--- | :--- |
| **model** | `string` | 是 | 模型名称。例如 `qwen-plus`, `qwen-max` 等。 |
| **messages** | `array` | 是 | 包含对话内容的数组。HTTP 调用时需放在 `input` 对象中。 |
| **parameters** | `object` | 否 | 模型生成的参数配置（如 `temperature`, `top_p` 等）。 |

#### messages 属性说明

| 属性名 | 类型 | 必选 | 说明 |
| :--- | :--- | :--- | :--- |
| **role** | `string` | 是 | 角色，可选值：`system`, `user`, `assistant`, `tool`。 |
| **content** | `string/array` | 是 | 消息内容。多模态输入时为 `array`。 |

#### parameters 属性说明

| 参数名 | 类型 | 默认值 | 取值范围 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| **temperature** | `float` | 0.7 (见注) | [0, 2) | 采样温度，控制多样性。值越高越随机。 |
| **top_p** | `float` | 0.8 (见注) | (0, 1.0] | 核采样概率。值越高越随机。 |
| **top_k** | `integer` | 20 (见注) | >= 0 | 采样候选集大小。 |
| **max_tokens** | `integer` | 模型上限 | - | 限制输出的最大 Token 数。 |
| **seed** | `integer` | - | [0, 2^31-1] | 随机数种子，用于结果复现。 |
| **stream** | `boolean` | `false` | - | 是否流式输出（Python SDK 专用）。 |
| **incremental_output** | `boolean` | `false` | - | 是否增量输出。建议设为 `true`。 |
| **enable_search** | `boolean` | `false` | - | 是否启用联网搜索。 |

> **注**：不同模型的默认值可能有所差异，详情请参考[官方模型列表](https://help.aliyun.com/zh/model-studio/models)。

### 响应参数 (Output)

| 参数名 | 类型 | 说明 |
| :--- | :--- | :--- |
| **request_id** | `string` | 请求唯一标识。 |
| **output** | `object` | 包含生成的具体内容。 |
| **usage** | `object` | Token 消耗统计。 |

#### output 属性说明

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| **text** | `string` | 生成的内容（当 `result_format` 为 `text` 时）。 |
| **choices** | `array` | 生成的消息数组（当 `result_format` 为 `message` 时）。 |
| **finish_reason** | `string` | 停止原因：`stop`, `length`, `tool_calls`。 |

---

## 错误处理

如果调用失败，API 会返回相应的错误码。详细说明请参考[百炼错误码文档](https://help.aliyun.com/zh/model-studio/error-code)。

<style>
/* 针对特定渲染环境的样式微调 */
.markdown-body table { width: 100%; display: table; }
.markdown-body pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; }
</style>
