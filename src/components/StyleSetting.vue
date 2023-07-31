<script setup lang="ts">
const styleDialog = ref(false)
const strokeLineDash = ref(0)
const fillLineDash = ref(0)
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
  DashStyle: [
    [],
    [8, 4],
    [8, 10],
  ],
}
function handleChangeStrokeLineDash(value: number) {
  style.value.strokeLineDash = style_option.DashStyle[value]
}
function handleChangeFillLineDash(value: number) {
  style.value.fillLineDash = style_option.DashStyle[value]
}
</script>

<template>
  <button
    b="1px solid gray-400" i-carbon-color-palette h-6 w-6 btn icon-btn
    @click="styleDialog = true"
  />
  <el-drawer v-model="styleDialog" size="500" title="" direction="btt" user-select="none">
    <el-form :model="style" label-width="150px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :xl="6" :offset="0">
          <el-form-item label="边框颜色" prop="stroke">
            <el-color-picker v-model="style.stroke" :show-alpha="true" />
          </el-form-item>
          <el-form-item label="边框宽度" prop="strokeWidth">
            <el-input-number v-model="style.strokeWidth" :min="1" :max="10" />
          </el-form-item>
          <el-form-item label="虚线边框风格" prop="strokeLineDash">
            <el-radio-group v-model="strokeLineDash" @change="handleChangeStrokeLineDash">
              <el-radio :label="0">
                无
              </el-radio>
              <el-radio :label="1">
                风格一
              </el-radio>
              <el-radio :label="2">
                风格二
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="边框线离散程度" prop="roughness">
            <el-input-number v-model="style.roughness" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="边框线曲度" prop="bowing">
            <el-input-number v-model="style.bowing" :min="0" :max="1" :step="0.01" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :xl="6" :offset="0">
          <el-form-item label="填充颜色" prop="fill">
            <el-color-picker v-model="style.fill" :show-alpha="true" />
          </el-form-item>
          <el-form-item label="填充斜线宽度" prop="fillWeight">
            <el-input-number v-model="style.fillWeight" :min="1" />
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
          <el-form-item v-if="false" label="虚线填充风格" prop="fillLineDash">
            <el-radio-group v-model="fillLineDash" @change="handleChangeFillLineDash">
              <el-radio label="0">
                无
              </el-radio>
              <el-radio label="1">
                风格一
              </el-radio>
              <el-radio label="2">
                风格二
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :xl="6" :offset="0">
          <el-form-item label="素描填充线斜纹度数" prop="hachureAngle">
            <el-input-number v-model="style.hachureAngle" />
          </el-form-item>
          <el-form-item label="素描填充线间距离" prop="hachureGap">
            <el-input-number v-model="style.hachureGap" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :xl="6" :offset="0">
          <el-form-item label="曲线步数" prop="curveStepCount">
            <el-input-number v-model="style.curveStepCount" :min="9" />
          </el-form-item>
          <el-form-item label="曲线拟合程度" prop="curveFitting">
            <el-input-number v-model="style.curveFitting" :min="0" :max="1" :step="0.01" />
          </el-form-item>
          <el-form-item v-if="false" label="虚线边框偏移量" prop="strokeLineDashOffset">
            <el-input-number v-model="style.strokeLineDashOffset" :min="0" />
          </el-form-item>
          <el-form-item v-if="false" label="虚线填充偏移量" prop="fillLineDashOffset">
            <el-input-number v-model="style.fillLineDashOffset" :min="0" />
          </el-form-item>
          <el-form-item label="虚线显现的线长度" prop="dashOffset">
            <el-input-number v-model="style.dashOffset" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="虚线线段间的距离" prop="dashGap">
            <el-input-number v-model="style.dashGap" :min="0" :max="10" />
          </el-form-item>
          <el-form-item label="波浪线弯曲程度" prop="zigzagOffset">
            <el-input-number v-model="style.zigzagOffset" :min="2" :max="6" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>
