import rough from 'roughjs'
import type { RoughCanvas } from 'roughjs/bin/canvas'

export const currentElement = ref<ElementGraph>()
export const elements = ref<ElementGraph[]>([] as ElementGraph[])
export const rc = ref<RoughCanvas>()
export const { x, y } = useMouse()
export const lastX = ref(0)
export const lastY = ref(0)
export const generator = rough.generator()
