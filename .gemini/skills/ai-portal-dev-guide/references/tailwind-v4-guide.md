# Tailwind CSS v4 配置与开发规范

AI Portal 项目已升级至 **Tailwind CSS v4**。与传统版本不同，v4 采用 **"CSS 优先 (CSS-first)"** 的配置模式，不再推荐使用 `tailwind.config.js`。

## 1. 核心配置入口
所有全局样式、主题变量和插件引入均统一在 `src/index.css` 中完成。

```css
@import "tailwindcss"; /* 核心库 */
@plugin "@tailwindcss/typography"; /* 插件引入 */

@theme {
  /* 自定义变量定义 */
}
```

## 2. 主题变量定义 (`@theme`)
在 v4 中，自定义颜色、动画和间距应在 `@theme` 区块中定义。定义的变量会自动映射为类名（如 `--color-tech-blue` 对应 `text-tech-blue`）。

```css
@theme {
  /* 品牌色定义 */
  --color-tech-blue: #0052D9;
  
  /* 动画定义 */
  --animate-fade-in: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(4px); }
    100% { opacity: 1; transform: translateY(0); }
  }
}
```

## 3. 插件使用
插件需通过 `@plugin` 指令在 CSS 顶部引入。
- **Typography**: 用于 Markdown 渲染，提供 `prose` 相关类名。
- 注意：不再需要 `require()` 语法。

## 4. 开发建议
- **避免使用 JavaScript 配置文件**：除非有极特殊的动态计算需求，否则严禁创建 `tailwind.config.js`。
- **变量命名**：遵循 `--color-*` 或 `--animate-*` 等标准前缀，以确保 Tailwind 能够正确推导类名。
- **响应式布局**：v4 依然支持 `md:`, `lg:` 等前缀，无需特殊配置。

## 5. 示例：Markdown 样式定制
使用 `prose` 类名结合自定义颜色：
```tsx
<article className="prose prose-slate prose-h2:border-tech-blue">
  <ReactMarkdown>{content}</ReactMarkdown>
</article>
```
