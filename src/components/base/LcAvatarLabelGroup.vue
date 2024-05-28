<script setup lang="ts">
import type { AvatarSize, Icon } from "~/components/base/LcAvatar.vue"

interface LabelGroupProps {
  size?: AvatarSize
  icon?: Icon | undefined
  active?: boolean
  logo?: string
  name: string
  email: string
}

const props = defineProps<LabelGroupProps>()
</script>

<template>
  <div :class="[`avatar-label-group`, `avatar-${props.size}`]">
    <LcAvatar
      :size="props.size"
      :icon="props.icon"
      :active="props.active"
      :logo="props.logo"
    />
    <div class="group-info">
      <span>{{ props.name }}</span>
      <span>{{ props.email }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar-label-group {
  width: max-content;
  display: flex;
  justify-content: space-between;

  .group-info {
    margin-left: 0.625rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  span:first-child {
    color: var(--clr-gray-700);
  }

  span:last-child {
    color: var(--clr-gray-500);
  }

  &.avatar-xs {
    span {
      line-height: 0.75rem;
      font-size: 0.75rem;
    }
  }
  &.avatar-sm {
    span {
      line-height: 1rem;
      font-size: 0.75rem;
    }
  }
  &.avatar-md {
    span {
      line-height: 1.25rem;
      font-size: 1rem;
    }
  }
  &.avatar-lg {
    span {
      line-height: 1.5rem;
      font-size: 1rem;
    }
  }
  &.avatar-xl {
    span {
      line-height: 1.75rem;
      font-size: 1.125rem;
    }
  }
  &.avatar-2xl {
    span {
      line-height: 2rem;
      font-size: 1.125rem;
    }
  }
}
</style>
