export function checkInBox(element: ElementGraph, point: Point) {
  const x1 = Math.min(element.x, element.x + element.width)
  const y1 = Math.min(element.y, element.y + element.height)
  const x2 = Math.max(element.x, element.x + element.width)
  const y2 = Math.max(element.y, element.y + element.height)
  return x1 <= point.x && y1 <= point.y && x2 >= point.x && y2 >= point.y
}
export function hasSelected(): [number, ElementGraph[]] {
  const arr = elements.value.filter(element => element.select)
  return [arr.length, arr]
}
