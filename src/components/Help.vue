<script setup lang="ts">
const helpDialog = ref(false)
</script>

<template>
  <button i-mdi-information h-6 w-6 btn icon-btn @click="helpDialog = true" />
  <el-dialog v-model="helpDialog" title="">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="删除元素">
        <div flex justify="end">
          <el-tag size="small">
            Del
          </el-tag>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
