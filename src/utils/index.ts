/**
 * 判断点在 box 内部
 * @param element
 * @param point
 * @returns
 */
export function checkPointInBox(element: ElementGraph, point: Point) {
  const [x1, y1, x2, y2] = FormatGraphPoint(element)
  return x1 <= point.x && y1 <= point.y && x2 >= point.x && y2 >= point.y
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
 * 格式化元素点信息，左上角(x1, y1),右下角(x2, y2)
 * @param element 元素
 * @returns
 */
export function FormatGraphPoint(element: ElementGraph) {
  const x1 = Math.min(element.x, element.x + element.width)
  const y1 = Math.min(element.y, element.y + element.height)
  const x2 = Math.max(element.x, element.x + element.width)
  const y2 = Math.max(element.y, element.y + element.height)
  return [x1, y1, x2, y2]
}
export function hasSelected(): [number, ElementGraph[]] {
  const arr = elements.value.filter(element => element.select)
  return [arr.length, arr]
}
