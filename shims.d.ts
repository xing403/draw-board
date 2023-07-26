import { type } from 'os'
import { Point } from 'roughjs/bin/geometry'

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
  area: {
    p1: Point
    p2: Point
  }
  draw: (rc: any, context: any) => void
}
type OperationType = ElementGraph[]
interface SettingType {
  topBarDirection: 'top' | 'left' | 'right' | 'bottom'
}
