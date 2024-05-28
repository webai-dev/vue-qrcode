<script lang="ts" setup>
interface PageTitle {
  title: string
  subtitle?: string
}

const props = defineProps<PageTitle>()
</script>

<template>
  <div class="title">{{ props.title }}</div>
  <div v-if="props.subtitle" class="subtitle">{{ props.subtitle }}</div>
</template>

<style lang="scss" scoped>
.title {
  font-size: var(--display-sm-font-size);
  line-height: var(--display-sm-line-height);
  font-weight: var(--font-weight-medium);
  padding: var(--space-8) 0;
  color: var(--clr-gray-900);
  text-transform: capitalize;
}

.subtitle {
  margin-top: calc(var(--space-5) * -1);
  color: var(--clr-gray-900);
}
</style>
