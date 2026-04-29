import { optimize } from 'svgo'

/**
 * 使用 SVGO 优化 SVG
 */
export async function optimizeSvg(svg: string): Promise<string> {
  const result = optimize(svg, {
    plugins: [
      'preset-default',
      'removeDimensions', // 移除 width/height，保留 viewBox
    ],
    multipass: true, // 多次优化
  })

  return result.data
}
