<script setup lang="ts">
import type { VueVersion } from '@/types'

defineProps<{
  code: string
  componentName: string
  vueVersion: VueVersion
  error?: string
}>()

const emit = defineEmits<{
  'update:componentName': [value: string]
  'update:vueVersion': [value: VueVersion]
  download: []
  clear: []
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

        <button
          class="clear-btn"
          @click="emit('clear')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          清空
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

.clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #e05252;
  border: 1.5px solid #e05252;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #e05252;
  color: white;
}

.clear-btn svg {
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
