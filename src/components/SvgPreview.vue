<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  svg: string
  loading?: boolean
}>()

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
  width: 200px;
  height: 200px;
  max-width: 100%;
  max-height: 100%;
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
