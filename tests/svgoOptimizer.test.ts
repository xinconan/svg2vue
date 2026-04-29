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
