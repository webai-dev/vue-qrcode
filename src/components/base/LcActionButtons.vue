<script setup lang="ts"></script>

<template>
  <div class="buttons">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.buttons {
  display: flex;
  width: 100%;
  gap: var(--space-3);
  justify-content: center;
}
</style>
