# SVG to Vue Component Converter

一个将 SVG 文件/代码转换为 Vue 组件的在线工具。

## 功能特性

- 📁 **拖拽上传** - 支持拖拽 SVG 文件到页面进行转换
- 📋 **粘贴识别** - 全局粘贴自动识别 SVG 代码，无需手动操作
- 👁️ **实时预览** - 转换前后实时预览 SVG 效果
- ⚡ **SVGO 优化** - 使用 SVGO 自动优化 SVG 代码
- 🎯 **双版本支持** - 支持 Vue 2 和 Vue 3 组件生成
- 💾 **一键下载** - 生成的组件可直接下载为 .vue 文件

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm run test
```

## 使用方法

### 方式一：拖拽上传

将 SVG 文件拖拽到左侧输入区域，工具会自动解析并生成 Vue 组件代码。

### 方式二：粘贴 SVG 代码

直接在任意位置粘贴 SVG 代码（`<svg>...</svg>`），工具会自动识别并转换。

### 方式三：手动输入

在左侧文本框中直接输入或粘贴 SVG 代码。

## 生成的组件示例

### Vue 3 组件

```vue
<template>
  <svg width="24" height="24" viewBox="0 0 24 24">
    <!-- SVG content -->
  </svg>
</template>

<script setup lang="ts">
defineOptions({ name: 'IconName' })
</script>
```

### Vue 2 组件

```vue
<template>
  <svg width="24" height="24" viewBox="0 0 24 24">
    <!-- SVG content -->
  </svg>
</template>

<script>
export default {
  name: 'IconName'
}
</script>
```

## 技术栈

- **[Vue 3](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[Vite 8](https://vite.dev/)** - 下一代前端构建工具
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript 的类型超集
- **[SVGO](https://github.com/svg/svgo)** - SVG 优化工具
- **[Vitest](https://vitest.dev/)** - Vite 原生测试框架

## 项目结构

```
svg-to-vue/
├── src/
│   ├── components/
│   │   ├── SvgInput.vue      # SVG 输入组件
│   │   ├── SvgPreview.vue    # SVG 预览组件
│   │   └── CodeOutput.vue    # 代码输出组件
│   ├── utils/
│   │   ├── svgParser.ts      # SVG 解析工具
│   │   ├── svgoOptimizer.ts  # SVGO 优化工具
│   │   └── vueGenerator.ts   # Vue 组件生成工具
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   ├── App.vue               # 主应用组件
│   └── main.ts               # 应用入口
├── tests/                    # 测试文件
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## License

MIT
