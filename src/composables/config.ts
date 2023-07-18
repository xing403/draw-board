import rough from 'roughjs'
import type { RoughCanvas } from 'roughjs/bin/canvas'

export const currentElement = ref<ElementGraph>()
export const elements = ref<ElementGraph[]>([] as ElementGraph[])
export const rc = ref<RoughCanvas>()
export const { x, y } = useMouse()
export const lastX = ref(0)
export const lastY = ref(0)
export const generator = rough.generator()

export const isDark = useDark()
export const toggleDark = useToggle(isDark)
export const elementType = ref<ElementType>('rectangle')
export function changeDrawMode(type: ElementType) {
  elementType.value = type
}
export const rightClickBoxPos = ref({
  x: 0,
  y: 0,
  display: 'none',
})
