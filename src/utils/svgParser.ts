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
