import type { Point } from 'roughjs/bin/geometry'
import type { ElementGraph, PositionType } from 'shims'
import cloneDeep from 'clone-deep'

/** 判断点在 box 内部
 * @param element
 * @param point
 * @returns
 */
export function checkPointInBox(element: ElementGraph, point: Point) {
  const [x1, y1, x2, y2] = FormatGraphPoint(element)
  return x1 <= point[0] && y1 <= point[1] && x2 >= point[0] && y2 >= point[1]
}
/** 判断e1 在 e2 内部
 * @param e1 小的元素
 * @param e2 max box
 * @returns
 */
export function checkBoxInBox(e1: ElementGraph, e2: ElementGraph) {
  const [x1, y1, x2, y2] = FormatGraphPoint(e1) // min box
  const [x3, y3, x4, y4] = FormatGraphPoint(e2) // max box
  return x1 >= x3 && y1 >= y3 && x2 <= x4 && y2 <= y4
}
/** 校验点在 Box 的位置
 * @param element
 * @param point
 * @param offset
 * @returns
 */
export function checkPointInBoxPos(element: ElementGraph, point: Point, offset: any): PositionType {
  const [x1, y1, x2, y2] = FormatGraphPoint(element)
  if ((x1 - point[0]) ** 2 + (y1 - point[1]) ** 2 <= offset ** 2)
    return 'left-top'
  if (((x1 + x2) / 2 - point[0]) ** 2 + (y1 - point[1]) ** 2 <= offset ** 2)
    return 'top'
  if ((x2 - point[0]) ** 2 + (y1 - point[1]) ** 2 <= offset ** 2)
    return 'right-top'
  if ((x1 - point[0]) ** 2 + ((y1 + y2) / 2 - point[1]) ** 2 <= offset ** 2)
    return 'left'
  if ((x2 - point[0]) ** 2 + ((y1 + y2) / 2 - point[1]) ** 2 <= offset ** 2)
    return 'right'
  if ((x1 - point[0]) ** 2 + (y2 - point[1]) ** 2 <= offset ** 2)
    return 'left-bottom'
  if (((x1 + x2) / 2 - point[0]) ** 2 + (y2 - point[1]) ** 2 <= offset ** 2)
    return 'bottom'
  if ((x2 - point[0]) ** 2 + (y2 - point[1]) ** 2 <= offset ** 2)
    return 'right-bottom'
  if (checkPointInBox(element, point))
    return 'in'
  return 'out'
}
/** 格式化元素除freeDraw之外点信息，左上角(x1, y1),右下角(x2, y2)
 * @param element 元素
 * @returns
 */
export function FormatGraphPoint(element: ElementGraph) {
  const [x1, y1] = element.area.p1
  const [x2, y2] = element.area.p2
  return [x1, y1, x2, y2]
}
/** 是否被选择
 * @returns
 */
export function hasSelected(): [number, ElementGraph[]] {
  const arr = elements.value.filter(element => element.select)
  return [arr.length, arr]
}
/** 点(x1，y1)绕点(x2,y2)旋转 angle度后的坐标
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param angle
 * @returns
 */
export function rotate(x1: number, y1: number, x2: number, y2: number, angle: number) {
  return [
    (x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
    (x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
  ]
}
export function moveElement(element: ElementGraph) {
  const distanceX = x.value - lastX.value
  const distanceY = y.value - lastY.value
  element.x += distanceX
  element.y += distanceY
  element.area.p1[0] += distanceX
  element.area.p1[1] += distanceY
  element.area.p2[0] += distanceX
  element.area.p2[1] += distanceY
}
/** 深拷贝
 */
export function cloneCopy<T>(obj: T) {
  return cloneDeep(obj)
}
export function changePointStyle(config?: { style?: string; pos?: PositionType }) {
  if (!canvas.value)
    return
  if (config?.pos) {
    if (config.pos === 'left-bottom' || config.pos === 'right-top')
      canvas.value.style.cursor = 'nesw-resize'
    else if (config.pos === 'left-top' || config.pos === 'right-bottom')
      canvas.value.style.cursor = 'nwse-resize'
    else if (config.pos === 'top' || config.pos === 'bottom')
      canvas.value.style.cursor = 'ns-resize'
    else if (config.pos === 'left' || config.pos === 'right')
      canvas.value.style.cursor = 'ew-resize'
    else
      canvas.value.style.cursor = 'crosshair'
  }
  else if (config?.style) {
    canvas.value.style.cursor = config.style || 'crosshair'
  }
  else {
    canvas.value.style.cursor = 'crosshair'
  }
}
export function getUUID() {
  return `${new Date().getTime()}`
}
