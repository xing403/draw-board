<script setup lang="ts">
const props = defineProps<{
  canvas: HTMLCanvasElement
}>()
function handleDeleteElements() {
  elements.value = elements.value.filter(element => !element.select)
  handleDrawCanvas(props.canvas)
  rightClickBoxPos.value.display = 'none'
}
</script>

<template>
  <div border="1px gray-500 solid" fixed w-200px select-none b-rd-5px bg-white p-1>
    <div flex="~ row items-center" justify-between>
      <el-button type="danger" plain size="small" text @click="handleDeleteElements">
        删除
      </el-button>
      <el-tag size="small">
        Del
      </el-tag>
    </div>
  </div>
</template>
