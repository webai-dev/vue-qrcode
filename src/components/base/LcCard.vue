<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: 12px;
  margin: var(--space-1);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.06),
    0px 1px 3px 0px rgba(16, 24, 40, 0.1),
    0px 1px 2px 0px rgba(16, 24, 40, 0.06);
  overflow: hidden;
}
</style>
