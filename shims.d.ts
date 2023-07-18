declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
type ElementType = 'rectangle' | 'ellipse' | 'drag'
interface ElementGraph {
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  select: boolean
  draw?: (rc: any, context: any) => void
}
interface Point {
  x: number
  y: number
}
