<script setup lang="ts">

</script>

<template>
  <div border="1px gray-500 solid" fixed w-200px select-none b-rd-5px bg-white p-1>
    <div flex="~ row items-center" justify-between>
      <el-button type="danger" size="small" text plain @click="handleDeleteElements()">
        删除
      </el-button>
      <el-tag size="small">
        Del
      </el-tag>
    </div>
  </div>
</template>
