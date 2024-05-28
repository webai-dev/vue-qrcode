<script lang="ts" setup>
const props = defineProps<{
  size: "xl" | "lg" | "md" | "sm" | "xs"
  white?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'lc-loader',
      `lc-loader-${size || 'md'}`,
      { 'lc-loader-white': white },
    ]"
  >
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
.lc-loader {
  display: inline-block;
  position: relative;
}

.lc-loader div {
  position: absolute;
  width: 30%;
  height: 30%;
  background: #166dca;
  animation: lc-loader 1.2s linear infinite;
}

.lc-loader-white div {
  background: white;
}

.lc-loader div:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}
.lc-loader div:nth-child(2) {
  top: 10%;
  left: 40%;
  animation-delay: -0.1s;
}
.lc-loader div:nth-child(3) {
  top: 10%;
  left: 70%;
  animation-delay: -0.15s;
}
.lc-loader div:nth-child(4) {
  top: 10%;
  left: 100%;
  animation-delay: -0.2s;
}
.lc-loader div:nth-child(5) {
  top: 40%;
  left: 100%;
  animation-delay: -0.3s;
}
.lc-loader div:nth-child(6) {
  top: 70%;
  left: 70%;
  animation-delay: -0.5s;
}
.lc-loader div:nth-child(7) {
  top: 100%;
  left: 100%;
  animation-delay: -1.9s;
}
.lc-loader div:nth-child(8) {
  top: 100%;
  left: 40%;
  animation-delay: -1.8s;
}
.lc-loader div:nth-child(9) {
  top: 100%;
  left: 10%;
  animation-delay: -1.9s;
}
.lc-loader div:nth-child(10) {
  top: 70%;
  left: 10%;
  animation-delay: -2.1s;
}

.lc-loader div:nth-child(11) {
  top: 40%;
  left: 10%;
  animation-delay: -2s;
}
@keyframes lc-loader {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.05;
  }
}
</style>
