<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  input: [svg: string, fileName?: string]
}>()

const isDragging = ref(false)
const textareaValue = ref('')
const fileInput = ref<HTMLInputElement>()

async function handleFile(file: File) {
  if (!file.name.endsWith('.svg')) {
    alert('请上传 .svg 文件')
    return
  }

  const content = await file.text()
  emit('input', content, file.name)
}

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

function handleClick() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    await handleFile(file)
  }
}

function handlePaste() {
  if (textareaValue.value.trim()) {
    emit('input', textareaValue.value)
    textareaValue.value = ''
  }
}

function clear() {
  textareaValue.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

defineExpose({ clear })
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
