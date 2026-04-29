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
