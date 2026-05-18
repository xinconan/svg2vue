import type { VueGenerateOptions, VueGenerateResult } from '@/types'

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

function generateVue3Template(componentName: string, svgContent: string): string {
  return `<template>
  ${svgContent}
</template>

<script setup lang="ts">
defineOptions({ name: '${componentName}' })
</script>
`
}

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

export function generateFileName(svgFileName: string): string {
  if (!svgFileName) {
    return 'SvgComponent.vue'
  }

  const baseName = svgFileName.split('/').pop()?.split('\\').pop() || ''
  const nameWithoutExt = baseName.replace(/\.svg$/i, '')

  if (!nameWithoutExt) {
    return 'SvgComponent.vue'
  }

  const pascalCase = nameWithoutExt
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  return `${pascalCase}.vue`
}
