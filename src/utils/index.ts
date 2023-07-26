import type { Point } from 'roughjs/bin/geometry'
import type { ElementGraph } from 'shims'
import cloneDeep from 'clone-deep'

/**
 * 判断点在 box 内部
 * @param element
 * @param point
 * @returns
 */
export function checkPointInBox(element: ElementGraph, point: Point) {
  const [x1, y1, x2, y2] = FormatGraphPoint(element)
  return x1 <= point[0] && y1 <= point[1] && x2 >= point[0] && y2 >= point[1]
}
/**
 * 判断e1 在 e2 内部
 * @param e1 小的元素
 * @param e2 max box
 * @returns
 */
export function checkBoxInBox(e1: ElementGraph, e2: ElementGraph) {
  const [x1, y1, x2, y2] = FormatGraphPoint(e1) // min box
  const [x3, y3, x4, y4] = FormatGraphPoint(e2) // max box
  return x1 >= x3 && y1 >= y3 && x2 <= x4 && y2 <= y4
}
/**
 * 格式化元素除freeDraw之外点信息，左上角(x1, y1),右下角(x2, y2)
 * @param element 元素
 * @returns
 */
export function FormatGraphPoint(element: ElementGraph) {
  let x1, y1, x2, y2
  if (element.type === 'freeDraw') {
    [x1, y1] = element.area.p1;
    [x2, y2] = element.area.p2
  }
  else {
    x1 = Math.min(element.x, element.x + element.width)
    y1 = Math.min(element.y, element.y + element.height)
    x2 = Math.max(element.x, element.x + element.width)
    y2 = Math.max(element.y, element.y + element.height)
  }
  return [x1, y1, x2, y2]
}
export function hasSelected(): [number, ElementGraph[]] {
  const arr = elements.value.filter(element => element.select)
  return [arr.length, arr]
}
/**
 * 点(x1，y1)绕点(x2,y2)旋转 angle度后的坐标
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
export function cloneCopy<T>(obj: T) {
  return cloneDeep(obj)
}
