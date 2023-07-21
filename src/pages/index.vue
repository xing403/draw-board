<script setup lang="ts">
const canvas = ref()
const rightClickRef = ref()
watchArray([width, height], () => {
  handleDrawCanvas(canvas.value)
})

function handleMouseDown() {
  const [selectLen, selects] = hasSelected()
  lastX.value = x.value
  lastY.value = y.value
  if (selectLen) {
    // 点击的位置在某个选中元素内部执行拖拽
    elementType.value = selects.some((element) => {
      return checkPointInBox(element, { x: x.value, y: y.value })
    })
      ? 'drag'
      : elementType.value
  }
  if (elementType.value !== 'drag' && elementType.value !== 'move') {
    clearAllSelect()
    currentElement.value = initializeGraph(elementType.value, x.value, y.value)
    elements.value.push(currentElement.value)
    handleDrawCanvas(canvas.value)
  }
  else if (elementType.value === 'move') {
    config.value.canMove = true
  }
  else {
    lastX.value = x.value
    lastY.value = y.value
  }
}
function handleMouseMove() {
  if (elementType.value === 'drag') {
    elements.value.forEach((element) => {
      if (element.select) {
        element.x = element.x + x.value - lastX.value
        element.y = element.y + y.value - lastY.value
      }
    })
    lastX.value = x.value
    lastY.value = y.value
  }
  else if (elementType.value === 'move' && config.value.canMove) {
    elements.value.forEach((element) => {
      element.x = element.x + x.value - lastX.value
      element.y = element.y + y.value - lastY.value
    })
    lastX.value = x.value
    lastY.value = y.value
  }
  else {
    if (currentElement.value == null)
      return
    if (elementType.value === 'selection') {
      elements.value.forEach((element) => {
        if (checkBoxInBox(element, currentElement.value as ElementGraph))
          element.select = true
      })
    }
    else if (elementType.value === 'freeDraw') {
      currentElement.value?.points?.push([x.value - currentElement.value.x, y.value - currentElement.value.y])
    }
    currentElement.value.width = x.value - currentElement.value.x
    currentElement.value.height = y.value - currentElement.value.y
  }
  handleDrawCanvas(canvas.value)
}
function handleMouseUp() {
  config.value.canMove = false
  if (elementType.value === 'drag' || elementType.value === 'selection') {
    if (elementType.value === 'selection')
      elements.value.pop()
    elementType.value = 'rectangle'
  }
  else {
    currentElement.value!.select = true
  }

  currentElement.value = undefined
  handleDrawCanvas(canvas.value)
}
function handleRightClick(event: { preventDefault: () => void }) {
  event.preventDefault()
  rightClickBoxPos.value.x = x.value
  rightClickBoxPos.value.y = y.value
  rightClickBoxPos.value.display = 'block'
}
onMounted(() => {
  handleDrawCanvas(canvas.value)
})
</script>

<template>
  <div overflow="hidden">
    <tool-bar />
    <div fixed bottom-30px right-20px>
      <div flex="~ col gap-1" w-full>
        <help />
        <button i-carbon-sun dark:i-carbon-moon btn icon-btn @click="toggleDark()" />
      </div>
    </div>
    <canvas
      ref="canvas" :width="width" :height="height"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @contextmenu="handleRightClick"
    />
    <right-click ref="rightClickRef" :canvas="canvas" :style="{ left: `${rightClickBoxPos.x}px`, top: `${rightClickBoxPos.y}px`, display: rightClickBoxPos.display }" />
  </div>
</template>

<style>
</style>
