<script lang="ts" setup>
const prop = defineProps<{
  progress: number
}>()
</script>
<template>
  <div class="lc-progress-bar">
    <div :class="`lc-progress-meter lc-progress-meter-${progress}`" />
  </div>
</template>
<style lang="scss">
.lc-progress-bar {
  width: 100%;
  height: 6px;
  border-radius: 6px;
  background-color: darkgray;
  overflow: hidden;
  box-sizing: border-box;
}

.lc-progress-meter {
  background-color: var(--clr-primary-600);
  height: 6px;
  transition: width 1s;
  border-radius: 6px;
}

@for $i from 1 through 100 {
  .lc-progress-meter-#{$i} {
    width: #{$i} + "%";
  }
}
</style>
