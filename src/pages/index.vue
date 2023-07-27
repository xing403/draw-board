<script setup lang="ts">
import { RoughCanvas } from 'roughjs/bin/canvas'
import type { ElementGraph } from 'shims'

const canvasRef = ref()
const rightClickRef = ref()
watchArray([width, height], () => {
  handleDrawCanvas()
})

function handleMouseDown() {
  config.value.isOperation = true
  const [selectLen, selects] = hasSelected()
  lastX.value = x.value
  lastY.value = y.value
  if (selectLen) { // 点击的位置在某个选中元素内部执行拖拽
    if (selects.find(element => checkPointInBoxPos(element, [x.value, y.value], setting.value.styleType.selectMargin) === 'in')) {
      elementType.value = 'drag'
    }
    else if (selectLen === 1) {
      const pos = checkPointInBoxPos(selects[0], [x.value, y.value], 2 * setting.value.styleType.selectMargin)
      if (pos !== 'in' && pos !== 'out' && selects[0].type !== 'freeDraw') {
        elementType.value = 'change'
        currentElement.value = selects[0]
      }
    }
  }
  if (elementType.value !== 'drag' && elementType.value !== 'move' && elementType.value !== 'change') {
    clearAllSelect()
    currentElement.value = initializeGraph(elementType.value, x.value, y.value)
    elements.value.push(currentElement.value)
  }
  else if (elementType.value === 'move') {
    config.value.canMove = true
  }
  else if (elementType.value === 'change') {
    currentElement.value = selects[0]
  }
  handleDrawCanvas()
  rightClickBoxPos.value.display = 'none'
}
function handleMouseMove() {
  if (config.value.isOperation) {
    if (elementType.value === 'drag') {
      elements.value.forEach((element) => {
        if (element.select)
          moveElement(element)
      })
    }
    else if (elementType.value === 'move') {
      elements.value.forEach((element) => {
        moveElement(element)
      })
    }
    else {
      if (currentElement.value == null)
        return
      if (elementType.value === 'selection') {
        elements.value.forEach((element) => {
          element.select = checkBoxInBox(element, currentElement.value as ElementGraph)
        })
      }
      if (elementType.value === 'change') {
        changeSize()
      }
      else {
        const [x1, y1, x2, y2] = FormatGraphPoint(currentElement.value)
        if (elementType.value === 'freeDraw') {
          currentElement.value?.points?.push([x.value - currentElement.value.x, y.value - currentElement.value.y])
          currentElement.value.area.p1 = [Math.min(x1, x.value), Math.min(y1, y.value)]
          currentElement.value.area.p2 = [Math.max(x2, x.value), Math.max(y2, y.value)]
        }
        else {
          currentElement.value.area.p1 = [x1, y1]
          currentElement.value.area.p2 = [x2, y2]
        }
        currentElement.value.width = x.value - currentElement.value.x
        currentElement.value.height = y.value - currentElement.value.y
      }
    }
    lastX.value = x.value
    lastY.value = y.value
    handleDrawCanvas()
  }
  else {
    const [selectLen, selects] = hasSelected()
    if (selectLen === 1) {
      Pos.value = checkPointInBoxPos(selects[0], [x.value, y.value], 2 * setting.value.styleType.selectMargin)
      changePointStyle({ pos: Pos.value })
    }
  }
}
async function handleMouseUp() {
  config.value.canMove = false
  config.value.isOperation = false
  if (currentElement.value && elementType.value !== 'freeDraw') {
    const [x1, y1, x2, y2] = FormatGraphPoint(currentElement.value)
    if (currentElement.value.width < 0 || currentElement.value.height < 0) {
      currentElement.value = initializeGraph(currentElement.value.type, x1, y1) as ElementGraph
      currentElement.value.width = x2 - x1
      currentElement.value.height = y2 - y1
      currentElement.value.select = true
      processingShape(currentElement.value)
      if (currentElement.value) {
        elements.value.pop()
        elements.value.push(currentElement.value)
      }
    }
  }

  if (elementType.value === 'selection')
    elements.value.pop()
  else
    undoList.value.push(cloneCopy(elements.value))
  if (elementType.value === 'drag')
    elementType.value = 'selection'
  currentElement.value = undefined
  handleDrawCanvas()
  redoList.value.splice(0, redoList.value.length)
  changePointStyle()
}
function handleRightClick(event: MouseEvent) {
  event.preventDefault()
  rightClickBoxPos.value.x = x.value
  rightClickBoxPos.value.y = y.value
  rightClickBoxPos.value.display = 'block'
}
onMounted(() => {
  canvas.value = canvasRef.value as HTMLCanvasElement
  rc.value = new RoughCanvas(canvas.value)
  initDrawBoard()
  undoList.value.push(cloneCopy(elements.value))
})
function handleTouchDown(e: TouchEvent) {
  if (e.touches.length === 1) {
    x.value = e.touches[0].clientX
    y.value = e.touches[0].clientY
    handleMouseDown()
  }
}
function handleTouchMove() {
  handleMouseMove()
}
function handleTouchUp() {
  handleMouseUp()
}
</script>

<template>
  <div overflow="hidden">
    <tool-bar />
    <div fixed bottom-30px right-20px>
      <div flex="~ col gap-1" w-full>
        <help />
        <Setting />
        <button i-carbon-sun dark:i-carbon-moon btn icon-btn @click="toggleDark()" />
      </div>
    </div>
    <canvas
      ref="canvasRef" :width="width" :height="height"
      bg-white dark:bg-gray-8
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @contextmenu="handleRightClick"
      @touchstart="handleTouchDown"
      @touchmove="handleTouchMove"
      @touchend="handleTouchUp"
    />
    <right-click ref="rightClickRef" :style="{ left: `${rightClickBoxPos.x}px`, top: `${rightClickBoxPos.y}px`, display: rightClickBoxPos.display }" />
  </div>
</template>

<style>
</style>
