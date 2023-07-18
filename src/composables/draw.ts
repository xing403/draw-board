import rough from 'roughjs'
import type { Drawable } from 'roughjs/bin/core'

/** 清除所有选择的元素
 */
export function clearAllSelect() {
  elements.value.forEach((element) => {
    element.select = false
  })
}
/** 画板绘制
 * @returns
 */
export function handleDrawCanvas(canvas: HTMLCanvasElement) {
  rc.value = rough.canvas(canvas)
  if (rc.value === undefined)
    return

  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  context.clearRect(0, 0, canvas.width, canvas.height)

  if (currentElement.value !== undefined)
    processingShape(currentElement.value)
  elements.value.forEach((element: ElementGraph) => {
    element.draw(rc.value, context)
    if (element.select) {
      const margin = 4
      context.setLineDash([8, 4])
      const x = Math.min(element.x, element.x + element.width)
      const y = Math.min(element.y, element.y + element.height)
      const width = Math.max(element.x, element.x + element.width) - x
      const height = Math.max(element.y, element.y + element.height) - y
      context.strokeRect(
        x - margin,
        y - margin,
        width + margin * 2,
        height + margin * 2,
      )
      context.setLineDash([])
    }
  })
}
/** 初始化一个 element
 * @param type 元素类型
 * @param x 元素x轴坐标
 * @param y 元素y轴坐标
 * @param width 元素宽度
 * @param height 元素高度
 * @returns
 */
export function initializeGraph(type: ElementType, x: number, y: number) {
  const element: ElementGraph = {
    type, x, y, width: 0, height: 0, select: false,
  }
  return element
}

/** 需要处理的元素
 * @param element
 * @returns
 */
export function processingShape(element: ElementGraph) {
  if (rc.value == null)
    return
  let shape: Drawable
  switch (element.type) {
    case 'selection':
      element.draw = (rc, context) => {
        const fillStyle = context.fillStyle
        context.fillStyle = 'rgba(0, 0, 255, 0.10)'
        context.fillRect(element.x, element.y, element.width, element.height)
        context.fillStyle = fillStyle
      }
      break
    case 'rectangle':
      shape = generator.rectangle(0, 0, element.width, element.height)
      element.draw = (rc, context) => {
        context.translate(element.x, element.y)
        rc.draw(shape)
        context.translate(-element.x, -element.y)
      }
      break
    case 'ellipse':
      shape = generator.ellipse(element.width / 2, element.height / 2, element.width, element.height)
      element.draw = (rc, context) => {
        context.translate(element.x, element.y)
        rc.draw(shape)
        context.translate(-element.x, -element.y)
      }
      break
  }
}
