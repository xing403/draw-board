<script setup lang="ts">
const settingDialog = ref(false)
const settingOption = {
  toolBarDirection: [{
    label: 'top',
    name: '顶部',
  }, {
    label: 'left',
    name: '左侧',
  }, {
    label: 'bottom',
    name: '底部',
  }, {
    label: 'right',
    name: '右侧',
  }],
}
</script>

<template>
  <button i-mdi-cog-outline h-6 w-6 btn icon-btn @click="settingDialog = true" />
  <el-drawer v-model="settingDialog" title="设置" direction="rtl">
    <el-form :model="setting" label-width="150px" :inline="false">
      <el-form-item label="工具栏位置" prop="topBarDirection">
        <el-radio-group v-model="setting.topBarDirection">
          <el-radio
            v-for="direction, index in settingOption.toolBarDirection"
            :key="index" :label="direction.label"
          >
            {{ direction.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择框距离元素边距" prop="topBarDirection">
        <el-input-number v-model="setting.styleType.selectMargin" :min="8" :max="18" :step="2" step-strictly />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
