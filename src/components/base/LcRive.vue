<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { Rive } from "@rive-app/canvas"
const props = defineProps<{
  src: string
}>()
const canvas = ref<HTMLCanvasElement | OffscreenCanvas | null>(null)

onMounted(() => {
  const rive = new Rive({
    canvas: canvas.value!,
    src: props.src,
    autoplay: true,
  })
})
</script>
<style lang="scss" scoped></style>
