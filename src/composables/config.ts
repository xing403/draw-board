import rough from 'roughjs'
import type { RoughCanvas } from 'roughjs/bin/canvas'
import type { ElementGraph, ElementType, OperationType, PositionType, SettingType } from 'shims'

export const canvas = ref<HTMLCanvasElement>()
export const currentElement = ref<ElementGraph>()
export const history = useLocalStorage<ElementGraph[]>('draw-elements', [], { mergeDefaults: true })
export const elements = ref<ElementGraph[]>([])
export const rc = ref<RoughCanvas>()
export const { x, y } = useMouse()
export const { width, height } = useWindowSize()
export const lastX = ref(0)
export const lastY = ref(0)
export const Pos = ref<PositionType>('out')
export const generator = rough.generator()

export const isDark = useDark()
export const toggleDark = useToggle(isDark)
export const elementType = ref<ElementType>('selection')
export function changeDrawMode(type: ElementType) {
  elementType.value = type
}
export const rightClickBoxPos = ref({
  x: 0,
  y: 0,
  display: 'none',
})
export const config = ref({
  canMove: false,
  isOperation: false,
})
export const undoList = ref<OperationType[]>([])
export const redoList = ref<OperationType[]>([])
export const canUndo = computed(() => {
  return undoList.value.length > 1
})
export const canRedo = computed(() => {
  return redoList.value.length !== 0
})
watch(elements.value, (value) => {
  history.value = value
})

export const setting = useLocalStorage<SettingType>('setting', {
  topBarDirection: 'top',
  styleType: {
    selectMargin: 8,
    selectStrokeColor: '#1c86d1',
    cursorStyle: 'crosshair',
  },
}, { mergeDefaults: true })

export const style = useLocalStorage<Options>('style', {
  bowing: 0,
  curveFitting: 1,
  curveStepCount: 9,
  curveTightness: 0,
  dashGap: 3,
  dashOffset: 10,
  disableMultiStroke: false,
  disableMultiStrokeFill: false,
  fillStyle: 'hachure',
  fillWeight: 1,
  hachureAngle: -40,
  hachureGap: 6,
  maxRandomnessOffset: 2,
  preserveVertices: false,
  roughness: 0,
  seed: 0,
  stroke: '#000000',
  strokeWidth: 1,
  zigzagOffset: 4,
  strokeLineDash: [],
  fillLineDash: [],
  fill: '',
  fillLineDashOffset: 1000,
  strokeLineDashOffset: 50,
})
