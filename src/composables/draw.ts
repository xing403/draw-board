import type { Drawable } from 'roughjs/bin/core'
import type { Point } from 'roughjs/bin/geometry'
import type { ElementGraph, ElementType } from 'shims'

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
export function handleDrawCanvas() {
  if (canvas.value === undefined || rc.value === undefined)
    return

  const context = canvas.value.getContext('2d') as CanvasRenderingContext2D
  context.clearRect(0, 0, canvas.value.width, canvas.value.height)

  if (currentElement.value !== undefined)
    processingShape(currentElement.value)

  elements.value.forEach((element: ElementGraph) => {
    element.draw(rc.value, context)
    if (element.select) {
      const margin = 4
      context.setLineDash([8, 4])
      const [x, y] = element.area.p1
      const width = element.area.p2[0] - x
      const height = element.area.p2[1] - y

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
    type,
    x,
    y,
    width: 0,
    height: 0,
    select: false,
    draw: () => { },
    points: [],
    area: { p1: [x, y], p2: [x, y] },
  }
  return element
}
/** 需要处理的元素
 * @param element
 * @returns
 */
export function processingShape(element: ElementGraph) {
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
      const shapes = shape as Drawable[]
      shapes.forEach((s: any) => rc.draw(s))
      context.translate(-element.x, -element.y)
    }
  }
  else if (element.type === 'freeDraw') {
    shape = generator.linearPath(element.points as Point[])
    element.draw = (rc, context) => {
      context.translate(element.x, element.y)
      rc.draw(shape)
      context.translate(-element.x, -element.y)
    }
  }
  return element
}
/**
 * 删除元素
 */
export function handleDeleteElements() {
  for (let i = 0; i < elements.value.length; i++) {
    if (elements.value[i].select)
      elements.value.splice(i, 1)
  }
  handleDrawCanvas()
  rightClickBoxPos.value.display = 'none'
}
export function initDrawBoard() {
  history.value.forEach((element: ElementGraph) => {
    processingShape(element)
    if (element != null)
      elements.value.push(element)
  })
  clearAllSelect()
  handleDrawCanvas()
}
