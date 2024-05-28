<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie"
import success from "~/assets/animations/scanner-success.json"

import "vue3-lottie/dist/style.css"

defineEmits<{
  (e: "completed"): void
}>()
</script>

<template>
  <Vue3Lottie
    :animation-data="success"
    :height="200"
    :width="200"
    :loop="false"
    @on-complete="$emit('completed')"
  />
</template>

<style lang></style>
