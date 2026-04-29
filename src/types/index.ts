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
