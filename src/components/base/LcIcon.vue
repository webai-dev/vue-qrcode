<script lang="ts" setup>
defineProps<{
  size?: "small" | "medium" | "large"
}>()
</script>
<template>
  <span :class="['lc-icon', 'material-symbols-outlined', size]">
    <slot />
  </span>
</template>
<style lang="scss" scoped>
.lc-icon {
  font-size: 24px;
  font-variation-settings: "OPSZ" 24;

  &.small {
    font-size: 20px;
    font-variation-settings: "OPSZ" 20;
  }

  &.medium {
    font-size: 40px;
    font-variation-settings: "OPSZ" 40;
  }

  &.large {
    font-size: 48px;
    font-variation-settings: "OPSZ" 48;
  }
}
</style>
