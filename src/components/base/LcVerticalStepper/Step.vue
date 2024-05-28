<script setup lang="ts">
import type { Component } from "vue"
import DotIcon from "@/assets/icons/icon-dot.svg?component"

const props = defineProps<{
  icon?: Component
  textIcon?: String
  active: boolean
  sub?: boolean
}>()

const icon = props?.icon || DotIcon
</script>

<template>
  <div :class="{ container: true, sub }">
    <div class="iconContainer">
      <span :class="{ icon: true, active }">
        <template v-if="textIcon">{{ textIcon }}</template>
        <icon v-else />
      </span>
    </div>
    <div class="stepperContent">
      <div v-if="!sub" class="title"><slot name="title" /></div>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  min-height: 5rem;
  width: 100%;

  &:not(.sub):last-of-type .iconContainer:before {
    border: none;
  }

  .iconContainer {
    position: relative;

    &:before {
      content: " ";
      border-left: solid 2px var(--clr-gray-400);
      position: absolute;
      top: 1px;
      left: 50%;
      height: 100%;
      z-index: 0;
    }
  }

  .icon {
    background-color: var(--clr-gray-100);
    color: var(--clr-gray-400);
    width: 3.4375rem;
    height: 3.4375rem;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    * {
      opacity: 0.5;
    }

    &.active {
      background-color: var(--clr-gray-300);
      color: var(--clr-black);
      * {
        opacity: 1;
      }
    }
  }

  .stepperContent {
    padding: 10px 1rem;
    width: 100%;
  }

  .title {
    margin-bottom: 0.5rem;
  }

  &.sub {
    min-height: 0;
    align-items: center;
    margin: 2rem 0;

    .iconContainer {
      &:before {
        border-left: none;
        border-top: solid 2px var(--clr-gray-400);
        top: 50%;
        left: 0;
        width: 2.6rem;
        height: 0;
        transform: translate(-100%, -50%);
      }
    }

    .icon {
      width: 2.125rem;
      height: 2.125rem;
    }
  }
}
</style>
