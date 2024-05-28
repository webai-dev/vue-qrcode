<script setup lang="ts">
const props = defineProps<{
  paginated?: boolean
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <LcCard>
    <LcCardHeader :title="title" :subtitle="subtitle">
      <template #actions>
        <slot name="header"></slot>
      </template>
      <template #info>
        <slot name="info"></slot>
      </template>
    </LcCardHeader>
    <slot name="table"></slot>
    <div v-if="paginated" class="pagination">
      <slot name="pagination"></slot>
    </div>
  </LcCard>
</template>

<style lang="scss" scoped>
.pagination {
  border-top: 1px solid var(--clr-gray-200);
  padding: var(--space-2) var(--space-4);
}
</style>
