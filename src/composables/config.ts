import rough from 'roughjs'
import type { RoughCanvas } from 'roughjs/bin/canvas'
import type { ElementGraph, ElementType, OperationType, SettingType } from 'shims'

export const canvas = ref<HTMLCanvasElement>()
export const currentElement = ref<ElementGraph>()
export const history = useLocalStorage<ElementGraph[]>('draw-elements', [], { mergeDefaults: true })
export const elements = ref<ElementGraph[]>([])
export const rc = ref<RoughCanvas>()
export const { x, y } = useMouse()
export const { width, height } = useWindowSize()
export const lastX = ref(0)
export const lastY = ref(0)
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
  },
}, { mergeDefaults: true })
