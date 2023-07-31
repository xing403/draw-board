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
  if (!['drag', 'move', 'change', 'eraser'].includes(elementType.value)) {
    clearAllSelect()
    currentElement.value = initializeGraph(elementType.value, x.value, y.value, style.value)
    if (elementType.value !== 'freeDraw') {
      currentElement.value.points.push([x.value, y.value])
      currentElement.value.points.push([0, 0])
    }
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
    else if (elementType.value === 'eraser') {
      elements.value.forEach((element) => {
        if (checkPointInBox(element, [x.value, y.value]))
          element.select = true
      })
    }
    else if (currentElement.value != null) {
      if (elementType.value === 'selection') {
        elements.value.forEach((element) => {
          element.select = checkBoxInBox(element, currentElement.value as ElementGraph)
        })
      }
      if (elementType.value === 'change') {
        if (['line', 'arrow'].includes(currentElement.value.type)) {
          if (Math.sqrt((x.value - currentElement.value.x - currentElement.value.width) ** 2
          + (y.value - currentElement.value.y - currentElement.value.height) ** 2) <= 20) {
            currentElement.value.width = x.value - currentElement.value.x
            currentElement.value.height = y.value - currentElement.value.y
          }
          else if (Math.sqrt((x.value - currentElement.value.x) ** 2 + (y.value - currentElement.value.y) ** 2) <= 2 * setting.value.styleType.selectMargin) {
            const end_x = currentElement.value.x + currentElement.value.width
            const end_y = currentElement.value.y + currentElement.value.height
            currentElement.value.x = x.value
            currentElement.value.y = y.value
            currentElement.value.width = end_x - currentElement.value.x
            currentElement.value.height = end_y - currentElement.value.y
          }
        }
        else { changeSize() }
      }
      else {
        currentElement.value.width = x.value - currentElement.value.x
        currentElement.value.height = y.value - currentElement.value.y
      }

      const [x1, y1, x2, y2] = FormatGraphPoint(currentElement.value)
      if (elementType.value === 'freeDraw') {
        currentElement.value.points.push([x.value - currentElement.value.x, y.value - currentElement.value.y])
        currentElement.value.area.p1 = [Math.min(x1, x.value), Math.min(y1, y.value)]
        currentElement.value.area.p2 = [Math.max(x2, x.value), Math.max(y2, y.value)]
      }
      else {
        currentElement.value.area.p1 = [Math.min(currentElement.value.x, currentElement.value.x + currentElement.value.width),
          Math.min(currentElement.value.y, currentElement.value.y + currentElement.value.height)]
        currentElement.value.area.p2 = [Math.max(currentElement.value.x, currentElement.value.x + currentElement.value.width),
          Math.max(currentElement.value.y, currentElement.value.y + currentElement.value.height)]
        currentElement.value.points[1] = [currentElement.value.width, currentElement.value.height]
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
  if (currentElement.value && elementType.value !== 'freeDraw' && (currentElement.value.width < 0 || currentElement.value.height < 0)) {
    const correction = cloneCopy(currentElement.value) as ElementGraph
    const [x1, y1, x2, y2] = FormatGraphPoint(correction)

    currentElement.value = initializeGraph(currentElement.value.type, x1, y1, style.value) as ElementGraph
    if (['line', 'arrow'].includes(currentElement.value.type)) {
      if (correction.height < 0)
        currentElement.value.y = y2
      if (correction.width < 0)
        currentElement.value.x = x2
      currentElement.value.width = correction.width
      currentElement.value.height = correction.height
    }
    else {
      currentElement.value.width = x2 - x1
      currentElement.value.height = y2 - y1
    }
    currentElement.value.area.p1 = correction.area.p1
    currentElement.value.area.p2 = correction.area.p2
    currentElement.value.points[1] = correction.points[1]
    currentElement.value.select = true
    processingShape(currentElement.value)
    elements.value.pop()
    elements.value.push(currentElement.value)
  }

  if (elementType.value === 'selection')
    elements.value.pop()
  else
    undoList.value.push(cloneCopy(elements.value))
  if (elementType.value === 'drag')
    elementType.value = 'selection'
  else if (elementType.value === 'eraser')
    handleDeleteElements()
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
  // rc.value.rectangle(400, 400, 400, 400, {
  //   // maxRandomnessOffset: 7, // 素描线最大随机偏移量
  //   // roughness: 0, // 素描线离散程度
  //   // bowing: 0, // 素描线弯曲度数
  //   // stroke: 'red', // 边框颜色
  //   // strokeWidth: 1, //边框 宽度
  //   curveFitting: 0,
  //   // curveTightness: 1,
  //   // curveStepCount: 1,
  //   // fill: '',
  //   // fillStyle: '',
  //   // fillWeight: 1,
  //   // hachureAngle: 0,
  //   // hachureGap: 0,
  //   // simplification: 0,
  //   // dashOffset: 0,
  //   // dashGap: 0,
  //   // zigzagOffset: 0,
  //   // seed: 0,
  //   // strokeLineDash: [],
  //   // strokeLineDashOffset: 0,
  //   // fillLineDash: [],
  //   // fillLineDashOffset: 0,
  //   // disableMultiStroke: false,
  //   // disableMultiStrokeFill: false,
  //   // preserveVertices: false,
  //   // fixedDecimalPlaceDigits: 0,
  // })
  // const shape = generator.ellipse(400, 400, 100, 100)
  // console.log(shape)
  // rc.value.draw(shape)
  // rc.value.ellipse(400, 400, 100, 100, {
  // maxRandomnessOffset: 7, // 素描线最大随机偏移量
  // roughness: 0, // 素描线离散程度
  // bowing: 0, // 素描线弯曲度数
  // stroke: 'red', // 边框颜色
  // strokeWidth: 1, //边框 宽度
  // curveFitting: 1,
  // curveTightness: 0, // 曲线离散程度
  // curveStepCount: 360, // 绘制完整曲线进行多少步
  // fill: 'red', // 填充颜色
  // fillStyle: 'sunburst', // 填充样式  hachure(default) 素描线, solid 完全, zigzag z字形 , cross-hatch 十字素描线, dots 点, sunburst, dashed 虚线填充,zigzag-line 波浪线填充
  // fillWeight: 3,
  // hachureAngle: 0,
  // hachureGap: 0,
  // simplification: 0,
  // dashOffset: 0,
  // dashGap: 0,
  // zigzagOffset: 0,
  // seed: 0,
  // strokeLineDash: [],
  // strokeLineDashOffset: 0,
  // fillLineDash: [],
  // fillLineDashOffset: 0,
  // disableMultiStroke: false,
  // disableMultiStrokeFill: false,
  // preserveVertices: false,
  // fixedDecimalPlaceDigits: 0,
  // })
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
  <div overflow="hidden" relative>
    <tool-bar />
    <div fixed bottom-30px right-20px flex="~ col gap-1" z-0>
      <help />
      <Setting />
      <button i-carbon-sun dark:i-carbon-moon btn icon-btn @click="toggleDark()" />
    </div>
    <canvas
      ref="canvasRef" :width="width" :height="height" bg-white dark:bg-gray-8 @mousedown="handleMouseDown"
      @mousemove="handleMouseMove" @mouseup="handleMouseUp" @contextmenu="handleRightClick" @touchstart="handleTouchDown"
      @touchmove="handleTouchMove" @touchend="handleTouchUp"
    />
    <right-click
      ref="rightClickRef"
      :style="{ left: `${rightClickBoxPos.x}px`, top: `${rightClickBoxPos.y}px`, display: rightClickBoxPos.display }"
    />
  </div>
</template>
