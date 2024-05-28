<script setup lang="ts">
const props = defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <div class="container">
    <div class="header">
      <div v-if="Boolean(title)" class="header__titles">
        <span>{{ title }}</span>
        <span v-if="Boolean(subtitle)" class="header__subtitle">{{
          subtitle
        }}</span>
      </div>
      <slot name="actions"></slot>
    </div>
    <div class="info">
      <slot name="info"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: var(--space-4) var(--space-5);
  color: var(--clr-gray-800);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-lg-font-size);
  line-height: var(--text-lg-line-height);
  font-weight: var(--font-weight-semibold);

  &__titles {
    display: grid;
  }

  &__subtitle {
    font-size: var(--text-sm-font-size);
    line-height: var(--text-sm-line-height);
    color: var(--clr-gray-400);
  }
}
</style>
