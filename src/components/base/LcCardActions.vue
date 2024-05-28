<script setup lang="ts"></script>
<template>
  <div class="LcCardActions">
    <slot />
  </div>
</template>

<style lang="scss">
.LcCardActions {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: var(--space-4) var(--space-5);
}
</style>
