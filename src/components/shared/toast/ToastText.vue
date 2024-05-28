<script setup lang="ts">
const props = defineProps<{
  title?: string
  body: string
}>()
</script>
<template>
  <div>
    <span v-if="title" class="toast-title">{{ props.title }}</span>
    <span class="toast-body">{{ props.body }}</span>
  </div>
</template>

<style scoped>
.toast-title {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
}
</style>
