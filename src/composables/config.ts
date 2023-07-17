export const isDark = useDark()
export const toggleDark = useToggle(isDark)
export const elementType = ref<ElementType>('rectangle')
export function changeDrawMode(type: ElementType) {
  elementType.value = type
}
