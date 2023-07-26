<script setup lang="ts">
import type { ElementGraph, OperationType } from 'shims'

const toolBar = ref()
const option = ref()
const { style } = useDraggable(toolBar, {
  initialValue: { x: window.innerWidth / 2, y: 20 },
})
function handleReUndo(value: string[]) {
  if (value.length === 0)
    return
  let list: OperationType
  if (value[0] === 'undo' && canUndo.value) {
    redoList.value.push([...undoList.value.pop() as OperationType])
    list = [...undoList.value[undoList.value.length - 1]]
  }
  else if (value[0] === 'redo' && canRedo.value) {
    list = [...redoList.value.pop() as OperationType]
    undoList.value.push(list)
  }
  else {
    return
  }
  elements.value.splice(0, elements.value.length)
  list.forEach((element: ElementGraph) => {
    elements.value.push(element)
  })
  handleDrawCanvas()
  setTimeout(() => {
    option.value = []
  }, 100)
}
</script>

<template>
  <div
    ref="toolBar" :style="style" b="1px solid gray-400" cursor="pointer" fixed select-none b-rd-5px bg-gray-200
    bg-white p-10px dark:bg-gray-5 shadow="~ hover:lg"
  >
    <button
      i-mdi-cursor-move btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'move' }"
      @click="changeDrawMode('move')"
    />
    <el-divider direction="vertical" />

    <button
      i-mdi-select-drag btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'selection' }"
      @click="changeDrawMode('selection')"
    />
    <el-divider direction="vertical" />
    <button
      i-mdi-rectangle-outline btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'rectangle' }"
      @click="changeDrawMode('rectangle')"
    />
    <el-divider direction="vertical" />
    <button
      i-mdi-ellipse-outline btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'ellipse' }"
      @click="changeDrawMode('ellipse')"
    />
    <el-divider direction="vertical" />
    <button
      i-mdi-vector-line btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'line' }"
      @click="changeDrawMode('line')"
    />
    <el-divider direction="vertical" />
    <button
      i-mdi-arrow-top-right btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'arrow' }"
      @click="changeDrawMode('arrow')"
    />
    <el-divider direction="vertical" />
    <button
      i-mdi-pencil btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'freeDraw' }"
      @click="changeDrawMode('freeDraw')"
    />
  </div>
  <div fixed bottom-20px left-30px>
    <el-checkbox-group v-model="option" size="small" @change="handleReUndo">
      <el-checkbox-button key="undo" label="undo" :disabled="!canUndo">
        <div btn-icon i-mdi-undo-variant h-5 w-5 />
      </el-checkbox-button>
      <el-checkbox-button key="redo" label="redo" :disabled="!canRedo">
        <div btn-icon i-mdi-redo-variant h-5 w-5 />
      </el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>
