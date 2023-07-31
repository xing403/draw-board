<script setup lang="ts">
import type { ElementGraph, ElementType, OperationType } from 'shims'

const option = ref()
function handleReUndo(value: string[]) {
  if (value.length === 0)
    return
  let list: OperationType
  if (value[0] === 'undo' && canUndo.value) {
    redoList.value.push(cloneCopy(undoList.value.pop()))
    list = cloneCopy(undoList.value[undoList.value.length - 1])
  }
  else if (value[0] === 'redo' && canRedo.value) {
    list = cloneCopy(redoList.value.pop())
    undoList.value.push(list)
  }
  else {
    return
  }
  elements.value.splice(0, elements.value.length)

  list.forEach((element: ElementGraph) => {
    elements.value.push(cloneCopy(element))
  })
  clearAllSelect()
  handleDrawCanvas()
  setTimeout(() => {
    option.value = []
  }, 100)
}
const toolBar = ref<{
  icon: string
  type: ElementType
}[]>([{
  icon: 'i-mdi-cursor-move',
  type: 'move',
}, {
  icon: 'i-mdi-select-drag',
  type: 'selection',
}, {
  icon: 'i-mdi-rectangle-outline',
  type: 'rectangle',
}, {
  icon: 'i-mdi-ellipse-outline',
  type: 'ellipse',
}, {
  icon: 'i-mdi-vector-line',
  type: 'line',
}, {
  icon: 'i-mdi-arrow-top-right',
  type: 'arrow',
}, {
  icon: 'i-mdi-pencil',
  type: 'freeDraw',
}, {
  icon: 'i-mdi-eraser',
  type: 'eraser',
}])
</script>

<template>
  <div
    v-if="setting.topBarDirection === 'top'"
    b="1px solid gray-400" cursor="pointer" fixed
    left="50%" top-10px
    transform="translate-x--50%" select-none b-rd-5px
    bg-gray-200 bg-white p-10px dark:bg-gray-5 shadow="~ hover:lg"
  >
    <template v-for="item, index in toolBar" :key="index">
      <el-divider
        v-if="index"
        :direction="['top', 'bottom'].includes(setting.topBarDirection) ? 'vertical' : 'horizontal'"
      />
      <button
        btn icon-btn b="1px solid gray-400"
        :class="[{ active: elementType === item.type }, item.icon]"
        @click="changeDrawMode(item.type)"
      />
    </template>
  </div>
  <div
    v-else-if="setting.topBarDirection === 'bottom'"
    b="1px solid gray-400" cursor="pointer" fixed
    left="50%" bottom-10px
    transform="translate-x--50%" select-none b-rd-5px
    bg-gray-200 bg-white p-10px dark:bg-gray-5 shadow="~ hover:lg"
  >
    <template v-for="item, index in toolBar" :key="index">
      <el-divider
        v-if="index"
        :direction="['top', 'bottom'].includes(setting.topBarDirection) ? 'vertical' : 'horizontal'"
      />
      <button
        btn icon-btn b="1px solid gray-400"
        :class="[{ active: elementType === item.type }, item.icon]"
        @click="changeDrawMode(item.type)"
      />
    </template>
  </div>
  <div
    v-if="setting.topBarDirection === 'right'"
    b="1px solid gray-400" cursor="pointer" fixed right-10px top="50%"
    transform="translate-y--50%" select-none b-rd-5px
    bg-gray-200 bg-white p-10px dark:bg-gray-5 shadow="~ hover:lg"
  >
    <template v-for="item, index in toolBar" :key="index">
      <el-divider
        v-if="index"
        :direction="['top', 'bottom'].includes(setting.topBarDirection) ? 'vertical' : 'horizontal'"
      />
      <button
        btn icon-btn b="1px solid gray-400"
        :class="[{ active: elementType === item.type }, item.icon]"
        @click="changeDrawMode(item.type)"
      />
    </template>
  </div>
  <div
    v-if="setting.topBarDirection === 'left'"
    b="1px solid gray-400" cursor="pointer" top="50%" transform="translate-y--50%" fixed left-10px select-none b-rd-5px bg-gray-200 bg-white p-10px dark:bg-gray-5 shadow="~ hover:lg"
  >
    <template v-for="item, index in toolBar" :key="index">
      <el-divider
        v-if="index"
        :direction="['top', 'bottom'].includes(setting.topBarDirection) ? 'vertical' : 'horizontal'"
      />
      <button
        btn icon-btn b="1px solid gray-400"
        :class="[{ active: elementType === item.type }, item.icon]"
        @click="changeDrawMode(item.type)"
      />
    </template>
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

<style>

</style>
