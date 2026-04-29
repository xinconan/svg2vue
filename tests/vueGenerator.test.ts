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
