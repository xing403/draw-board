<script setup lang="ts">
const props = defineProps<{
  canvas: HTMLCanvasElement
}>()
</script>

<template>
  <div border="1px gray-500 solid" fixed w-200px select-none b-rd-5px bg-white p-1>
    <div flex="~ row items-center" justify-between>
      <el-button type="danger" plain size="small" text @click="handleDeleteElements(props.canvas)">
        删除
      </el-button>
      <el-tag size="small">
        Del
      </el-tag>
    </div>
  </div>
</template>
