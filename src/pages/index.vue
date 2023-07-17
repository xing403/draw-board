<script setup lang="ts">
import rough from 'roughjs'
import type { RoughCanvas } from 'roughjs/bin/canvas'
import type { Drawable } from 'roughjs/bin/core'

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const elements = ref<ElementGraph[]>([] as ElementGraph[])
const { x, y } = useMouse()
const rc = ref<RoughCanvas>()
const generator = rough.generator()
const currentElement = ref<ElementGraph>()
const canvas = ref()
function initializeGraph(type: ElementType, x: number, y: number, width: number, height: number) {
  const element: ElementGraph = {
    type, x, y, width, height, select: false,
  }
  return element
}
function handleDrawCanvas() {
  rc.value = rough.canvas(canvas.value)
  if (rc.value === undefined)
    return

  const context = canvas.value.getContext('2d')
  context.clearRect(0, 0, canvas.value.width, canvas.value.height)
  elements.value.forEach((element) => {
    if (element.draw === undefined)
      return
    element.draw(rc.value, context)
    if (element.select) {
      const margin = 4
      context.setLineDash([8, 4])
      const x = Math.min(element.x, element.x + element.width)
      const y = Math.min(element.y, element.y + element.height)
      const width = Math.max(element.x, element.x + element.width) - x
      const height = Math.max(element.y, element.y + element.height) - y
      context.strokeRect(
        x - margin,
        y - margin,
        width + margin * 2,
        height + margin * 2,
      )
      context.setLineDash([])
    }
  })
  if (currentElement.value !== undefined)
    processingShape(currentElement.value)
}
function processingShape(element: ElementGraph) {
  if (rc.value == null)
    return
  let shape: Drawable
  switch (element.type) {
    case 'rectangle':
      shape = generator.rectangle(element.x, element.y, element.width, element.height)
      break
    case 'ellipse':
      shape = generator.ellipse(element.x + element.width / 2, element.y + element.height / 2, element.width, element.height)
      break
  }

  element.draw = (rc, context) => {
    rc.draw(shape)
  }
}
function handleMouseDown() {
  clearAllSelect()
  currentElement.value = initializeGraph(elementType.value, x.value, y.value, 0, 0)
  elements.value.push(currentElement.value)
  handleDrawCanvas()
}
function handleMouseMove() {
  if (currentElement.value == null)
    return
  currentElement.value.width = x.value - currentElement.value.x
  currentElement.value.height = y.value - currentElement.value.y
  handleDrawCanvas()
}
function handleMouseUp() {
  if (currentElement.value === undefined)
    return
  currentElement.value.select = true
  currentElement.value = undefined
  handleDrawCanvas()
}
function clearAllSelect() {
  elements.value.forEach((element) => {
    element.select = false
  })
}
</script>

<template>
  <div>
    <tool-bar />
    <div fixed bottom="30px" right="20px">
      <div flex="~ col" w-full>
        <button i-carbon-sun dark:i-carbon-moon btn icon-btn @click="toggleDark()" />
      </div>
    </div>
    <canvas
      ref="canvas" :width="WIDTH" :height="HEIGHT"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
    />
  </div>
</template>

<style>
</style>
