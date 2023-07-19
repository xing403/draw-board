<script setup lang="ts">
const toolBar = ref()

const { style } = useDraggable(toolBar, {
  initialValue: { x: window.innerWidth / 2, y: 20 },
})
</script>

<template>
  <div
    ref="toolBar" :style="style" b="1px solid gray-400" cursor="pointer" fixed
    select-none b-rd-5px bg-white p-10px shadow="~ hover:lg"
  >
    <button i-mdi-select-drag btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'selection' }" @click="changeDrawMode('selection')" />
    <el-divider direction="vertical" />
    <button i-mdi-rectangle-outline btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'rectangle' }" @click="changeDrawMode('rectangle')" />
    <el-divider direction="vertical" />
    <button i-mdi-ellipse-outline btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'ellipse' }" @click="changeDrawMode('ellipse')" />
    <el-divider direction="vertical" />
    <button i-mdi-vector-line btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'line' }" @click="changeDrawMode('line')" />
    <el-divider direction="vertical" />
    <button i-mdi-arrow-top-right btn icon-btn b="1px solid gray-400" :class="{ active: elementType === 'arrow' }" @click="changeDrawMode('arrow')" />
  </div>
</template>

<style>
*{
  border-radius: ;
}
</style>
