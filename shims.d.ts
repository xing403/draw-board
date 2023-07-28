import { type } from 'os'
import { Point } from 'roughjs/bin/geometry'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
type ElementType = 'rectangle' | 'ellipse' | 'drag' | 'selection' | 'line' | 'arrow' | 'move' | 'freeDraw'| 'change'| 'eraser'
interface ElementGraph {
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  select: boolean
  points?: Point[]
  id: string
  area: {
    p1: Point
    p2: Point
  }
  draw: (rc: any, context: any) => void
}
type OperationType = ElementGraph[]
interface SettingType {
  topBarDirection: 'top' | 'left' | 'right' | 'bottom'
  styleType:{
    selectMargin: number,
    cursorStyle: string
  }
}
type PositionType = 'in' | 'out' | 'left-top' | 'top'| 'right-top' | 'left' | 'right' | 'left-bottom' | 'bottom' | 'right-bottom'
