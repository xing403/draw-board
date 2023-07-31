<script setup lang="ts">
const styleDialog = ref(false)
const style_option = {
  fillStyles: [{
    label: 'hachure',
    name: '素描线(默认)',
  }, {
    label: 'solid',
    name: '实心',
  }, {
    label: 'zigzag',
    name: 'z字形',
  }, {
    label: 'cross-hatch',
    name: '十字素描线',
  }, {
    label: 'dots',
    name: '点',
  }, {
    label: 'sunburst',
    name: '线段',
  }, {
    label: 'dashed',
    name: '虚线',
  }, {
    label: 'zigzag-line',
    name: '波浪线',
  }],
}
</script>

<template>
  <button
    b="1px solid gray-400" i-carbon-color-palette h-6 w-6 btn icon-btn
    @click="styleDialog = true"
  />
  <el-drawer v-model="styleDialog" size="500" title="" direction="btt">
    <el-form :model="style" label-width="150px">
      <el-form-item label="边框颜色" prop="stroke">
        <el-color-picker v-model="style.stroke" />
      </el-form-item>
      <!-- <el-form-item label="边框风格" prop="strokeStyle">
      <el-select v-model="style.strokeStyle">
          <el-option
            v-for="item, index in style_option.fillStyles"
            :key="index" :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="边框宽度" prop="strokeWidth">
        <el-input-number v-model="style.strokeWidth" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="填充颜色" prop="fill">
        <el-color-picker v-model="style.fill" />
      </el-form-item>
      <el-form-item label="填充风格" prop="fillStyle">
        <el-select v-model="style.fillStyle">
          <el-option
            v-for="item, index in style_option.fillStyles"
            :key="index" :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="斜纹度数" prop="hachureAngle">
        <el-input-number v-model="style.hachureAngle" />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
