<script setup lang="ts"></script>
<template>
  <div class="btn-group">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.btn-group {
  display: flex;
  flex-direction: row;
  :slotted(.btn) {
    &:first-child:not(:last-child) {
      border-radius: 0.5rem 0 0 0.5rem;
    }
    &:last-child:not(:first-child) {
      border-radius: 0 0.5rem 0.5rem 0;
    }
    &:not(:first-child):not(:last-child) {
      border-radius: 0;
    }
    & + .btn {
      border-left: none;
      margin-left: 0;
    }
    &:focus {
      z-index: 1;
    }
  }
}
</style>
