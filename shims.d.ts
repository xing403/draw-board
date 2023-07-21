declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
type ElementType = 'rectangle' | 'ellipse' | 'drag' | 'selection' | 'line' | 'arrow' | 'move' | 'freeDraw'
interface ElementGraph {
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  select: boolean
  points?: Point[]
  draw: (rc: any, context: any) => void
}
