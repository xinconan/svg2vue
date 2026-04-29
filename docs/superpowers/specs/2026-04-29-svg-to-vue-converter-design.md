# SVG to Vue Component Converter 设计文档

## 概述

一个将 SVG 转换为 Vue 单文件组件（SFC）的工具，支持 Vue 2 和 Vue 3，提供上传或粘贴 SVG 代码的输入方式，支持预览和下载生成的组件。

## 技术栈

- Vite 8
- Vue 3.5
- TypeScript
- SVGO（SVG 优化）

## 项目结构

```
svg-to-vue/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.ts
    ├── App.vue
    ├── components/
    │   ├── SvgInput.vue       # 输入区（上传/粘贴）
    │   ├── SvgPreview.vue     # SVG 预览
    │   └── CodeOutput.vue     # 代码展示 + 下载
    └── utils/
        ├── svgParser.ts       # SVG 解析
        ├── svgoOptimizer.ts   # SVGO 优化
        └── vueGenerator.ts    # Vue 组件生成
```

## 核心功能

### 1. 输入方式
- 文件上传（拖拽或点击）
- 粘贴 SVG 代码

### 2. 处理流程
1. 输入 → 用户上传文件或粘贴 SVG 代码
2. 解析 → 提取 SVG 内容，验证有效性
3. 优化 → 使用 SVGO 压缩优化 SVG
4. 生成 → 根据 Vue 版本生成 SFC 组件代码
5. 输出 → 预览组件 + 一键下载 .vue 文件

### 3. Vue 组件生成

#### Vue 2 输出格式（Options API）
```vue
<template>
  <svg>...</svg>
</template>

<script>
export default {
  name: 'IconName'
}
</script>
```

#### Vue 3 输出格式（Composition API + script setup）
```vue
<template>
  <svg>...</svg>
</template>

<script setup lang="ts">
defineOptions({ name: 'IconName' })
</script>
```

## 界面布局

```
┌─────────────────────────────────────────────────────┐
│  SVG to Vue Component Converter                     │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   输入区             │      预览区                  │
│   - 拖拽上传         │      - SVG 渲染预览          │
│   - 粘贴代码         │                              │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│                                                      │
│   代码输出区                                         │
│   - Vue 版本选择 (Vue2 / Vue3)                       │
│   - 组件名称输入                                     │
│   - 代码展示（带语法高亮）                            │
│   - 下载按钮                                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## 组件设计

### SvgInput.vue
- 功能：接收 SVG 输入
- 支持拖拽上传文件
- 支持粘贴 SVG 代码
- 输出：原始 SVG 字符串

### SvgPreview.vue
- 功能：预览 SVG 渲染效果
- 接收：优化后的 SVG 字符串
- 实时渲染 SVG 图形

### CodeOutput.vue
- 功能：展示生成的 Vue 组件代码
- Vue 版本切换（Vue2 / Vue3）
- 组件名称输入框
- 代码语法高亮展示
- 下载按钮（生成 .vue 文件）

## 工具函数

### svgParser.ts
- 解析 SVG 字符串
- 验证 SVG 有效性
- 提取 SVG 元素

### svgoOptimizer.ts
- 使用 SVGO 优化 SVG
- 移除无用属性
- 压缩代码体积

### vueGenerator.ts
- 根据模板生成 Vue 组件代码
- 支持 Vue 2 和 Vue 3 格式
- 自动生成组件名称（基于文件名或默认）

## 错误处理

- 无效 SVG 格式提示
- 文件类型校验（仅接受 .svg）
- 空输入提示

## 成功标准

1. 用户可通过上传或粘贴输入 SVG
2. SVG 经 SVGO 优化后正确显示预览
3. 可切换 Vue 2 / Vue 3 生成对应格式组件
4. 可自定义组件名称
5. 可下载生成的 .vue 文件
