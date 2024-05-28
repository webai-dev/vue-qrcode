<script lang="ts" setup>
import type { Component } from "vue"

const props = defineProps<{
  icon?: Component
  text?: string
  color?: string
  size?: string
  avatar?: boolean
}>()
</script>

<template>
  <div
    :class="[
      `badge badge--${size ? size : 'sm'} badge--${color ? color : 'gray'}`,
      { 'badge--avatar': Boolean(avatar) },
    ]"
  >
    <component
      :is="props.icon"
      v-if="icon"
      :class="['prefix', { avatar: Boolean(avatar) }]"
    ></component>
    <span v-if="text" class="badge-text">{{ text }}</span>
  </div>
</template>

<style lang="scss" scoped>
.badge {
  display: flex;
  border-radius: 16px;
  width: fit-content;
  box-sizing: border-box;
  text-align: center;
  gap: 6px;
  font-weight: var(--font-weight-medium);
  align-items: center;
  text-transform: capitalize;

  &-text {
    white-space: nowrap;
  }

  &--sm {
    padding: 2px 8px;
    font-size: var(--text-xs-font-size);
    line-height: var(--text-xs-line-height);
  }

  &--gray {
    color: var(--clr-gray-700);
    background-color: var(--clr-gray-100);
  }

  &--success {
    color: var(--clr-success-700);
    background-color: var(--clr-success-50);
  }

  &--error {
    color: var(--clr-pink-900);
    background-color: var(--clr-pink-50);
  }

  &--purple {
    color: var(--clr-purple-900);
    background-color: var(--clr-purple-50);
  }

  &--primary {
    color: var(--clr-primary-800);
    background-color: var(--clr-primary-50);
  }

  &--avatar {
    padding-left: 3px;
  }
}

.prefix svg {
  max-width: 16px;
  max-height: 16px;
}
</style>
