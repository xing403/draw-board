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
    type, x, y, width: 0, height: 0, select: false, draw: () => { },
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
  let shape: Drawable | Drawable[]
  if (element.type === 'selection') {
    element.draw = (rc, context) => {
      const fillStyle = context.fillStyle
      context.fillStyle = 'rgba(0, 0, 255, 0.10)'
      context.fillRect(element.x, element.y, element.width, element.height)
      context.fillStyle = fillStyle
    }
  }
  else if (element.type === 'rectangle') {
    shape = generator.rectangle(0, 0, element.width, element.height)
    element.draw = (rc, context) => {
      context.translate(element.x, element.y)
      rc.draw(shape)
      context.translate(-element.x, -element.y)
    }
  }
  else if (element.type === 'ellipse') {
    shape = generator.ellipse(element.width / 2, element.height / 2, element.width, element.height)
    element.draw = (rc, context) => {
      context.translate(element.x, element.y)
      rc.draw(shape)
      context.translate(-element.x, -element.y)
    }
  }
  else if (element.type === 'line') {
    shape = generator.line(0, 0, element.width, element.height)
    element.draw = (rc, context) => {
      context.translate(element.x, element.y)
      rc.draw(shape)
      context.translate(-element.x, -element.y)
    }
  }
  else if (element.type === 'arrow') {
    const x1 = 0
    const y1 = 0
    const x2 = element.width
    const y2 = element.height

    const size = 30
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    const minSize = Math.min(size, distance / 2)
    const xs = x2 - ((x2 - x1) / distance) * minSize
    const ys = y2 - ((y2 - y1) / distance) * minSize
    const angle = 20 // degrees
    const [x3, y3] = rotate(xs, ys, x2, y2, (-angle * Math.PI) / 180)
    const [x4, y4] = rotate(xs, ys, x2, y2, (angle * Math.PI) / 180)

    shape = [
      generator.line(x3, y3, x2, y2),
      generator.line(x1, y1, x2, y2),
      generator.line(x4, y4, x2, y2),
    ]

    element.draw = (rc, context) => {
      context.translate(element.x, element.y)
      shape.forEach((s: any) => rc.draw(s))
      context.translate(-element.x, -element.y)
    }
  }
}
