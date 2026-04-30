<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SvgInput from './components/SvgInput.vue'
import SvgPreview from './components/SvgPreview.vue'
import CodeOutput from './components/CodeOutput.vue'
import { parseSvg, extractSvgContent } from './utils/svgParser'
import { optimizeSvg } from './utils/svgoOptimizer'
import { generateVueComponent, generateFileName } from './utils/vueGenerator'
import type { VueVersion } from './types'

const rawSvg = ref('')
const optimizedSvg = ref('')
const componentName = ref('SvgComponent')
const vueVersion = ref<VueVersion>('vue3')
const error = ref('')
const isLoading = ref(false)

const generatedCode = computed(() => {
  if (!optimizedSvg.value) return ''

  const result = generateVueComponent({
    componentName: componentName.value,
    vueVersion: vueVersion.value,
    svgContent: optimizedSvg.value
  })
  return result.code
})

async function handleSvgInput(svg: string, fileName?: string) {
  error.value = ''
  isLoading.value = true

  try {
    const extracted = extractSvgContent(svg)
    const parsed = parseSvg(extracted, fileName)
    if (!parsed.valid) {
      error.value = parsed.error || '无效的 SVG'
      rawSvg.value = ''
      optimizedSvg.value = ''
      return
    }

    rawSvg.value = extracted
    optimizedSvg.value = await optimizeSvg(extracted)

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

// 全局粘贴监听
function handleGlobalPaste(e: ClipboardEvent) {
  const clipboardData = e.clipboardData
  if (!clipboardData) return

  // 获取粘贴的文本
  const text = clipboardData.getData('text')
  if (!text || !text.trim()) return

  // 检测是否是 SVG 代码
  if (text.includes('<svg') && text.includes('</svg>')) {
    e.preventDefault()
    handleSvgInput(text)
  }
}

onMounted(() => {
  document.addEventListener('paste', handleGlobalPaste)
})

onUnmounted(() => {
  document.removeEventListener('paste', handleGlobalPaste)
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>SVG 转 Vue 组件</h1>
      <p class="hint">🔒 所有处理均在本地完成，不会上传任何数据</p>
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

.header .hint {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 0.5rem;
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
