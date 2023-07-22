<script setup lang="ts">
const props = defineProps<{
  canvas: HTMLCanvasElement
}>()
const helpDialog = ref(false)
const { Delete, Shift_D } = useMagicKeys()
const shortcutKey = [{
  title: '删除',
  keys: ['Shift+D', 'Delete'],
}]

watch(Shift_D, (v) => {
  if (v)
    handleDeleteElements(props.canvas)
})
watch(Delete, (v) => {
  if (v)
    handleDeleteElements(props.canvas)
})
</script>

<template>
  <button i-mdi-information h-6 w-6 btn icon-btn @click="helpDialog = true" />
  <el-dialog v-model="helpDialog" title="">
    <el-descriptions :column="1" border>
      <el-descriptions-item v-for="item, index in shortcutKey" :key="index" :label="item.title">
        <div flex="" justify="end">
          <el-tag size="small">
            Del
          </el-tag>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
