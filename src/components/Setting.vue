<script setup lang="ts">
const settingDialog = ref(false)
</script>

<template>
  <button i-mdi-cog-outline h-6 w-6 btn icon-btn @click="settingDialog = true" />
  <el-drawer v-model="settingDialog" title="设置" direction="rtl">
    <el-form-item label="工具栏位置">
      <el-radio-group v-model="setting.topBarDirection">
        <el-radio label="top">
          顶部
        </el-radio>
        <el-radio label="left">
          左侧
        </el-radio>
        <el-radio label="right">
          右侧
        </el-radio>
        <el-radio label="bottom">
          底部
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </el-drawer>
</template>
