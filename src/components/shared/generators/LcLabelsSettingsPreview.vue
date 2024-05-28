<script setup lang="ts"></script>
<template>
  <div class="container">
    <p class="title">Preview</p>
    <slot></slot>
  </div>
</template>
<style scoped lang="scss">
.container {
  width: 90%;
  background-color: var(--clr-gray-200);
  border-radius: 12px;
  margin-top: 2rem;
  margin-left: 0.275rem;
  padding: 10px 16px 0 16px;

  & .title {
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 15px;
    padding-bottom: 0;
  }
}
</style>
