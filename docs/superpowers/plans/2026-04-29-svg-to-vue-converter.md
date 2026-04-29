# SVG to Vue Component Converter 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个将 SVG 转换为 Vue 单文件组件的工具，支持 Vue 2 和 Vue 3，提供上传/粘贴输入、预览和下载功能。

**Architecture:** 纯前端处理，使用 SVGO 优化 SVG，根据 Vue 版本生成对应格式的 SFC 组件代码。单页面布局：左侧输入区、右侧预览区、底部代码输出区。

**Tech Stack:** Vite 8, Vue 3.5, TypeScript, SVGO, Vitest

---

## 文件结构

```
svg-to-vue/
├── index.html                    # 入口 HTML
├── package.json                  # 项目配置
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
├── src/
│   ├── main.ts                   # 应用入口
│   ├── App.vue                   # 主组件
│   ├── vite-env.d.ts             # Vite 类型声明
│   ├── components/
│   │   ├── SvgInput.vue          # SVG 输入组件
│   │   ├── SvgPreview.vue        # SVG 预览组件
│   │   └── CodeOutput.vue        # 代码输出组件
│   ├── utils/
│   │   ├── svgParser.ts          # SVG 解析工具
│   │   ├── svgoOptimizer.ts      # SVGO 优化工具
│   │   └── vueGenerator.ts       # Vue 组件生成工具
│   └── types/
│       └── index.ts              # 类型定义
└── tests/
    ├── svgParser.test.ts         # SVG 解析测试
    ├── svgoOptimizer.test.ts     # SVGO 优化测试
    └── vueGenerator.test.ts      # Vue 生成测试
```

---

### Task 1: 项目初始化和配置

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "svg-to-vue",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {
    "vue": "^3.5.0",
    "svgo": "^3.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vitest": "^3.0.0",
    "vue-tsc": "^2.2.0",
    "@types/node": "^22.0.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'node'
  }
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SVG to Vue Component Converter</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建 src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

- [ ] **Step 7: 安装依赖**

Run: `npm install`
Expected: 依赖安装成功

- [ ] **Step 8: 提交**

```bash
git add .
git commit -m "chore: 初始化项目配置

- 添加 package.json、vite.config.ts、tsconfig.json
- 配置 Vue 3.5 + Vite 8 + TypeScript
- 添加 SVGO 和 Vitest 依赖

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: 类型定义

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
/** Vue 版本 */
export type VueVersion = 'vue2' | 'vue3'

/** SVG 解析结果 */
export interface SvgParseResult {
  /** 是否有效 */
  valid: boolean
  /** SVG 内容 */
  content: string
  /** 错误信息 */
  error?: string
  /** 文件名（如果有） */
  fileName?: string
}

/** Vue 组件生成选项 */
export interface VueGenerateOptions {
  /** 组件名称 */
  componentName: string
  /** Vue 版本 */
  vueVersion: VueVersion
  /** SVG 内容 */
  svgContent: string
}

/** Vue 组件生成结果 */
export interface VueGenerateResult {
  /** 组件代码 */
  code: string
  /** 文件名 */
  fileName: string
}
```

- [ ] **Step 2: 提交**

```bash
git add src/types/index.ts
git commit -m "feat: 添加类型定义

- VueVersion, SvgParseResult, VueGenerateOptions, VueGenerateResult

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: SVG 解析工具

**Files:**
- Create: `src/utils/svgParser.ts`
- Create: `tests/svgParser.test.ts`

- [ ] **Step 1: 编写 SVG 解析测试**

```typescript
import { describe, it, expect } from 'vitest'
import { parseSvg, validateSvg, extractSvgContent } from '@/utils/svgParser'

describe('svgParser', () => {
  const validSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>'
  const invalidSvg = '<div>not a svg</div>'

  describe('validateSvg', () => {
    it('应该返回 true 对于有效的 SVG', () => {
      expect(validateSvg(validSvg)).toBe(true)
    })

    it('应该返回 false 对于无效的 SVG', () => {
      expect(validateSvg(invalidSvg)).toBe(false)
    })

    it('应该返回 false 对于空字符串', () => {
      expect(validateSvg('')).toBe(false)
    })
  })

  describe('parseSvg', () => {
    it('应该正确解析有效的 SVG', () => {
      const result = parseSvg(validSvg)
      expect(result.valid).toBe(true)
      expect(result.content).toBe(validSvg)
      expect(result.error).toBeUndefined()
    })

    it('应该返回错误对于无效的 SVG', () => {
      const result = parseSvg(invalidSvg)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('应该支持带文件名', () => {
      const result = parseSvg(validSvg, 'icon-home.svg')
      expect(result.fileName).toBe('icon-home.svg')
    })
  })

  describe('extractSvgContent', () => {
    it('应该提取 SVG 内容', () => {
      const svgWithExtra = `<?xml version="1.0" encoding="UTF-8"?>
<!-- comment -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>`
      const result = extractSvgContent(svgWithExtra)
      expect(result).toContain('<svg')
      expect(result).toContain('</svg>')
      expect(result).not.toContain('<?xml')
      expect(result).not.toContain('<!--')
    })
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- tests/svgParser.test.ts --run`
Expected: FAIL - 模块不存在

- [ ] **Step 3: 实现 SVG 解析工具**

```typescript
import type { SvgParseResult } from '@/types'

/**
 * 验证 SVG 字符串是否有效
 */
export function validateSvg(svg: string): boolean {
  if (!svg || svg.trim() === '') {
    return false
  }
  
  const parser = new DOMParser()
  const doc = parser.parseFromString(svg, 'image/svg+xml')
  const parserError = doc.querySelector('parsererror')
  
  if (parserError) {
    return false
  }
  
  const svgElement = doc.querySelector('svg')
  return svgElement !== null
}

/**
 * 解析 SVG 字符串
 */
export function parseSvg(svg: string, fileName?: string): SvgParseResult {
  const trimmed = svg.trim()
  
  if (!trimmed) {
    return {
      valid: false,
      content: '',
      error: 'SVG 内容为空'
    }
  }
  
  if (!validateSvg(trimmed)) {
    return {
      valid: false,
      content: trimmed,
      error: '无效的 SVG 格式',
      fileName
    }
  }
  
  return {
    valid: true,
    content: trimmed,
    fileName
  }
}

/**
 * 从字符串中提取纯 SVG 内容（移除 XML 声明、注释等）
 */
export function extractSvgContent(content: string): string {
  // 移除 XML 声明
  let result = content.replace(/<\?xml[^?]*\?>/g, '')
  // 移除注释
  result = result.replace(/<!--[\s\S]*?-->/g, '')
  // 提取 SVG 标签及其内容
  const svgMatch = result.match(/<svg[\s\S]*?<\/svg>/i)
  return svgMatch ? svgMatch[0].trim() : result.trim()
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- tests/svgParser.test.ts --run`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/utils/svgParser.ts tests/svgParser.test.ts
git commit -m "feat: 实现 SVG 解析工具

- validateSvg: 验证 SVG 有效性
- parseSvg: 解析 SVG 字符串
- extractSvgContent: 提取纯 SVG 内容

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: SVGO 优化工具

**Files:**
- Create: `src/utils/svgoOptimizer.ts`
- Create: `tests/svgoOptimizer.test.ts`

- [ ] **Step 1: 编写 SVGO 优化测试**

```typescript
import { describe, it, expect } from 'vitest'
import { optimizeSvg } from '@/utils/svgoOptimizer'

describe('svgoOptimizer', () => {
  it('应该优化 SVG 并减小体积', async () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <!-- 这是一个注释 -->
      <g id="unnecessary-group">
        <circle cx="12" cy="12" r="10" fill="none" stroke="black"/>
      </g>
    </svg>`
    
    const result = await optimizeSvg(svg)
    expect(result).toContain('<svg')
    expect(result).not.toContain('<!--')
    expect(result.length).toBeLessThan(svg.length)
  })

  it('应该保留 viewBox 属性', async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>'
    const result = await optimizeSvg(svg)
    expect(result).toContain('viewBox')
  })

  it('应该处理简单的 SVG', async () => {
    const svg = '<svg><circle cx="12" cy="12" r="10"/></svg>'
    const result = await optimizeSvg(svg)
    expect(result).toContain('<svg')
    expect(result).toContain('circle')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- tests/svgoOptimizer.test.ts --run`
Expected: FAIL - 模块不存在

- [ ] **Step 3: 实现 SVGO 优化工具**

```typescript
import { optimize } from 'svgo'

/**
 * 使用 SVGO 优化 SVG
 */
export async function optimizeSvg(svg: string): Promise<string> {
  const result = optimize(svg, {
    plugins: [
      'preset-default',
      'removeDimensions', // 移除 width/height，保留 viewBox
    ],
    multipass: true, // 多次优化
  })
  
  return result.data
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- tests/svgoOptimizer.test.ts --run`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/utils/svgoOptimizer.ts tests/svgoOptimizer.test.ts
git commit -m "feat: 实现 SVGO 优化工具

- 使用 SVGO 默认预设优化 SVG
- 移除尺寸属性，保留 viewBox
- 支持多次优化

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Vue 组件生成工具

**Files:**
- Create: `src/utils/vueGenerator.ts`
- Create: `tests/vueGenerator.test.ts`

- [ ] **Step 1: 编写 Vue 组件生成测试**

```typescript
import { describe, it, expect } from 'vitest'
import { generateVueComponent, generateFileName } from '@/utils/vueGenerator'
import type { VueGenerateOptions } from '@/types'

describe('vueGenerator', () => {
  const svgContent = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>'

  describe('generateVueComponent', () => {
    it('应该生成 Vue 2 组件（Options API）', () => {
      const options: VueGenerateOptions = {
        componentName: 'IconHome',
        vueVersion: 'vue2',
        svgContent
      }
      const result = generateVueComponent(options)
      
      expect(result.code).toContain('<template>')
      expect(result.code).toContain(svgContent)
      expect(result.code).toContain('</template>')
      expect(result.code).toContain('<script>')
      expect(result.code).toContain("export default {")
      expect(result.code).toContain("name: 'IconHome'")
      expect(result.code).not.toContain('<script setup')
    })

    it('应该生成 Vue 3 组件（Composition API）', () => {
      const options: VueGenerateOptions = {
        componentName: 'IconHome',
        vueVersion: 'vue3',
        svgContent
      }
      const result = generateVueComponent(options)
      
      expect(result.code).toContain('<template>')
      expect(result.code).toContain(svgContent)
      expect(result.code).toContain('</template>')
      expect(result.code).toContain('<script setup lang="ts">')
      expect(result.code).toContain("defineOptions({ name: 'IconHome' })")
    })

    it('应该生成正确的文件名', () => {
      const options: VueGenerateOptions = {
        componentName: 'IconHome',
        vueVersion: 'vue3',
        svgContent
      }
      const result = generateVueComponent(options)
      expect(result.fileName).toBe('IconHome.vue')
    })
  })

  describe('generateFileName', () => {
    it('应该从 SVG 文件名生成组件文件名', () => {
      expect(generateFileName('icon-home.svg')).toBe('IconHome.vue')
      expect(generateFileName('logo.svg')).toBe('Logo.vue')
      expect(generateFileName('my-icon.svg')).toBe('MyIcon.vue')
    })

    it('应该处理带路径的文件名', () => {
      expect(generateFileName('/path/to/icon-home.svg')).toBe('IconHome.vue')
    })

    it('应该返回默认名称对于空输入', () => {
      expect(generateFileName('')).toBe('SvgComponent.vue')
    })
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- tests/vueGenerator.test.ts --run`
Expected: FAIL - 模块不存在

- [ ] **Step 3: 实现 Vue 组件生成工具**

```typescript
import type { VueGenerateOptions, VueGenerateResult } from '@/types'

/**
 * Vue 2 组件模板
 */
function generateVue2Template(componentName: string, svgContent: string): string {
  return `<template>
  ${svgContent}
</template>

<script>
export default {
  name: '${componentName}'
}
</script>
`
}

/**
 * Vue 3 组件模板
 */
function generateVue3Template(componentName: string, svgContent: string): string {
  return `<template>
  ${svgContent}
</template>

<script setup lang="ts">
defineOptions({ name: '${componentName}' })
</script>
`
}

/**
 * 生成 Vue 组件代码
 */
export function generateVueComponent(options: VueGenerateOptions): VueGenerateResult {
  const { componentName, vueVersion, svgContent } = options
  
  const code = vueVersion === 'vue2'
    ? generateVue2Template(componentName, svgContent)
    : generateVue3Template(componentName, svgContent)
  
  return {
    code,
    fileName: `${componentName}.vue`
  }
}

/**
 * 从 SVG 文件名生成组件文件名
 * @example 'icon-home.svg' -> 'IconHome.vue'
 */
export function generateFileName(svgFileName: string): string {
  if (!svgFileName) {
    return 'SvgComponent.vue'
  }
  
  // 提取文件名（移除路径和扩展名）
  const baseName = svgFileName.split('/').pop()?.split('\\').pop() || ''
  const nameWithoutExt = baseName.replace(/\.svg$/i, '')
  
  if (!nameWithoutExt) {
    return 'SvgComponent.vue'
  }
  
  // 转换为 PascalCase
  const pascalCase = nameWithoutExt
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
  
  return `${pascalCase}.vue`
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- tests/vueGenerator.test.ts --run`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/utils/vueGenerator.ts tests/vueGenerator.test.ts
git commit -m "feat: 实现 Vue 组件生成工具

- generateVueComponent: 生成 Vue 2/3 SFC 组件
- generateFileName: 从 SVG 文件名生成组件名
- Vue 2 使用 Options API
- Vue 3 使用 Composition API + script setup

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: 应用入口和主组件

**Files:**
- Create: `src/main.ts`
- Create: `src/App.vue`

- [ ] **Step 1: 创建应用入口**

```typescript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 2: 创建主组件**

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SvgInput from './components/SvgInput.vue'
import SvgPreview from './components/SvgPreview.vue'
import CodeOutput from './components/CodeOutput.vue'
import { parseSvg, extractSvgContent } from './utils/svgParser'
import { optimizeSvg } from './utils/svgoOptimizer'
import { generateVueComponent, generateFileName } from './utils/vueGenerator'
import type { VueVersion } from './types'

// 状态
const rawSvg = ref('')
const optimizedSvg = ref('')
const componentName = ref('SvgComponent')
const vueVersion = ref<VueVersion>('vue3')
const error = ref('')
const isLoading = ref(false)

// 计算生成的组件代码
const generatedCode = computed(() => {
  if (!optimizedSvg.value) return ''
  
  const result = generateVueComponent({
    componentName: componentName.value,
    vueVersion: vueVersion.value,
    svgContent: optimizedSvg.value
  })
  return result.code
})

// 处理 SVG 输入
async function handleSvgInput(svg: string, fileName?: string) {
  error.value = ''
  isLoading.value = true
  
  try {
    // 提取纯 SVG 内容
    const extracted = extractSvgContent(svg)
    
    // 解析验证
    const parsed = parseSvg(extracted, fileName)
    if (!parsed.valid) {
      error.value = parsed.error || '无效的 SVG'
      rawSvg.value = ''
      optimizedSvg.value = ''
      return
    }
    
    rawSvg.value = extracted
    
    // 优化 SVG
    optimizedSvg.value = await optimizeSvg(extracted)
    
    // 自动生成组件名
    if (fileName) {
      componentName.value = generateFileName(fileName).replace('.vue', '')
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '处理失败'
    rawSvg.value = ''
    optimizedSvg.value = ''
  } finally {
    isLoading.value = false
  }
}

// 下载组件
function handleDownload() {
  if (!generatedCode.value) return
  
  const blob = new Blob([generatedCode.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${componentName.value}.vue`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>SVG to Vue Component Converter</h1>
    </header>
    
    <main class="main">
      <div class="top-section">
        <div class="input-section">
          <SvgInput @input="handleSvgInput" />
        </div>
        <div class="preview-section">
          <SvgPreview :svg="optimizedSvg" :loading="isLoading" />
        </div>
      </div>
      
      <div class="output-section">
        <CodeOutput
          :code="generatedCode"
          :component-name="componentName"
          :vue-version="vueVersion"
          :error="error"
          @update:component-name="componentName = $event"
          @update:vue-version="vueVersion = $event"
          @download="handleDownload"
        />
      </div>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #42b883, #35495e);
  color: white;
  padding: 1rem 2rem;
  text-align: center;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.main {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.top-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-height: 300px;
}

.input-section,
.preview-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.output-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-height: 300px;
}

@media (max-width: 768px) {
  .top-section {
    grid-template-columns: 1fr;
  }
}
</style>
```

- [ ] **Step 3: 提交**

```bash
git add src/main.ts src/App.vue
git commit -m "feat: 添加应用入口和主组件

- 集成 SVG 输入、预览、代码输出组件
- 实现完整的处理流程
- 支持组件下载

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: SvgInput 组件

**Files:**
- Create: `src/components/SvgInput.vue`

- [ ] **Step 1: 创建 SvgInput 组件**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  input: [svg: string, fileName?: string]
}>()

const isDragging = ref(false)
const textareaValue = ref('')
const fileInput = ref<HTMLInputElement>()

// 处理文件上传
async function handleFile(file: File) {
  if (!file.name.endsWith('.svg')) {
    alert('请上传 .svg 文件')
    return
  }
  
  const content = await file.text()
  emit('input', content, file.name)
}

// 处理拖拽
function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

async function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  
  const file = e.dataTransfer?.files[0]
  if (file) {
    await handleFile(file)
  }
}

// 点击上传
function handleClick() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    await handleFile(file)
  }
}

// 粘贴代码
function handlePaste() {
  if (textareaValue.value.trim()) {
    emit('input', textareaValue.value)
    textareaValue.value = ''
  }
}
</script>

<template>
  <div class="svg-input">
    <div class="title">输入 SVG</div>
    
    <div
      class="drop-zone"
      :class="{ dragging: isDragging }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="handleClick"
    >
      <div class="drop-content">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>拖拽 SVG 文件到此处</p>
        <p class="hint">或点击选择文件</p>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept=".svg"
        hidden
        @change="handleFileChange"
      />
    </div>
    
    <div class="divider">
      <span>或粘贴 SVG 代码</span>
    </div>
    
    <div class="paste-section">
      <textarea
        v-model="textareaValue"
        placeholder="<svg>...</svg>"
        rows="6"
      />
      <button class="paste-btn" @click="handlePaste">
        解析 SVG
      </button>
    </div>
  </div>
</template>

<style scoped>
.svg-input {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #35495e;
}

.drop-zone {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.drop-zone:hover,
.drop-zone.dragging {
  border-color: #42b883;
  background: rgba(66, 184, 131, 0.05);
}

.drop-content .icon {
  width: 40px;
  height: 40px;
  color: #42b883;
  margin-bottom: 0.5rem;
}

.drop-content p {
  color: #666;
  font-size: 0.9rem;
}

.drop-content .hint {
  font-size: 0.8rem;
  color: #999;
}

.divider {
  text-align: center;
  padding: 0.75rem 0;
  color: #999;
  font-size: 0.85rem;
}

.paste-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.paste-section textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  resize: none;
}

.paste-section textarea:focus {
  outline: none;
  border-color: #42b883;
}

.paste-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.paste-btn:hover {
  background: #3aa876;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/SvgInput.vue
git commit -m "feat: 添加 SvgInput 组件

- 支持拖拽上传 SVG 文件
- 支持点击选择文件
- 支持粘贴 SVG 代码

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 8: SvgPreview 组件

**Files:**
- Create: `src/components/SvgPreview.vue`

- [ ] **Step 1: 创建 SvgPreview 组件**

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  svg: string
  loading?: boolean
}>()

// 将 SVG 嵌入为 data URI
const svgDataUri = computed(() => {
  if (!props.svg) return ''
  const encoded = encodeURIComponent(props.svg)
  return `data:image/svg+xml,${encoded}`
})
</script>

<template>
  <div class="svg-preview">
    <div class="title">SVG 预览</div>
    
    <div class="preview-area">
      <div v-if="loading" class="loading">
        <div class="spinner" />
        <p>优化中...</p>
      </div>
      
      <div v-else-if="svg" class="preview-content">
        <img :src="svgDataUri" alt="SVG Preview" class="svg-image" />
      </div>
      
      <div v-else class="empty">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p>等待 SVG 输入</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.svg-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #35495e;
}

.preview-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #eee;
  min-height: 150px;
}

.preview-content {
  padding: 1rem;
}

.svg-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
}

.loading {
  text-align: center;
  color: #666;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #eee;
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty {
  text-align: center;
  color: #999;
}

.empty .icon {
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.empty p {
  font-size: 0.9rem;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/SvgPreview.vue
git commit -m "feat: 添加 SvgPreview 组件

- 实时预览 SVG 渲染效果
- 支持加载状态显示

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 9: CodeOutput 组件

**Files:**
- Create: `src/components/CodeOutput.vue`

- [ ] **Step 1: 创建 CodeOutput 组件**

```vue
<script setup lang="ts">
import type { VueVersion } from '@/types'

const props = defineProps<{
  code: string
  componentName: string
  vueVersion: VueVersion
  error?: string
}>()

const emit = defineEmits<{
  'update:componentName': [value: string]
  'update:vueVersion': [value: VueVersion]
  download: []
}>()
</script>

<template>
  <div class="code-output">
    <div class="header-row">
      <div class="title">生成的 Vue 组件</div>
      
      <div class="controls">
        <div class="control-group">
          <label>组件名称</label>
          <input
            type="text"
            :value="componentName"
            @input="emit('update:componentName', ($event.target as HTMLInputElement).value)"
            placeholder="SvgComponent"
          />
        </div>
        
        <div class="control-group">
          <label>Vue 版本</label>
          <div class="radio-group">
            <label class="radio">
              <input
                type="radio"
                value="vue2"
                :checked="vueVersion === 'vue2'"
                @change="emit('update:vueVersion', 'vue2')"
              />
              <span>Vue 2</span>
            </label>
            <label class="radio">
              <input
                type="radio"
                value="vue3"
                :checked="vueVersion === 'vue3'"
                @change="emit('update:vueVersion', 'vue3')"
              />
              <span>Vue 3</span>
            </label>
          </div>
        </div>
        
        <button
          class="download-btn"
          :disabled="!code"
          @click="emit('download')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          下载 .vue 文件
        </button>
      </div>
    </div>
    
    <div class="code-area">
      <div v-if="error" class="error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{{ error }}</span>
      </div>
      
      <pre v-else-if="code" class="code"><code>{{ code }}</code></pre>
      
      <div v-else class="empty">
        <p>生成的组件代码将显示在这里</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-output {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.title {
  font-weight: 600;
  color: #35495e;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-size: 0.85rem;
  color: #666;
}

.control-group input[type="text"] {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  width: 140px;
}

.control-group input[type="text"]:focus {
  outline: none;
  border-color: #42b883;
}

.radio-group {
  display: flex;
  gap: 0.75rem;
}

.radio {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.radio input {
  accent-color: #42b883;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.download-btn:hover:not(:disabled) {
  background: #3aa876;
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.download-btn svg {
  width: 16px;
  height: 16px;
}

.code-area {
  flex: 1;
  background: #1e1e1e;
  border-radius: 8px;
  overflow: auto;
  min-height: 200px;
}

.code {
  margin: 0;
  padding: 1rem;
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #ff6b6b;
}

.error svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 0.9rem;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/CodeOutput.vue
git commit -m "feat: 添加 CodeOutput 组件

- 显示生成的 Vue 组件代码
- 支持 Vue 2/3 版本切换
- 支持自定义组件名称
- 支持下载 .vue 文件

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 10: 集成测试和验证

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 运行所有测试**

Run: `npm test --run`
Expected: 所有测试通过

- [ ] **Step 2: 启动开发服务器验证**

Run: `npm run dev`
Expected: 服务器启动成功，可在浏览器访问

- [ ] **Step 3: 构建生产版本**

Run: `npm run build`
Expected: 构建成功

- [ ] **Step 4: 最终提交**

```bash
git add .
git commit -m "chore: 完成项目集成测试

- 所有单元测试通过
- 开发服务器正常启动
- 生产构建成功

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## 验收标准

- [ ] 用户可通过拖拽或点击上传 SVG 文件
- [ ] 用户可粘贴 SVG 代码
- [ ] SVG 经 SVGO 优化后正确显示预览
- [ ] 可切换 Vue 2 / Vue 3 生成对应格式组件
- [ ] 可自定义组件名称
- [ ] 可下载生成的 .vue 文件
- [ ] 所有测试通过
