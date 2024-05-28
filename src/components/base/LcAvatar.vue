<script setup lang="ts">
import Placeholder from "~/assets/icons/icon-user.svg?component"
import Dot from "~/assets/icons/icon-dot.svg?component"
import Company from "~/assets/icons/icon-company.svg?component"

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
export type Icon = "dot" | "company"

interface AvatarProps {
  size?: AvatarSize
  icon?: Icon
  active?: boolean
  logo?: string
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: "md",
})

const statusIcon = ref<any>()

if (props.icon) {
  statusIcon.value = props.icon === "dot" ? Dot : Company
}

const iconClasses = computed(() => {
  const active =
    props.icon === "dot" && props.active === true
      ? "avatar-active"
      : "avatar-inactive"
  const name = `icon-${props.icon}`
  return [active, name]
})
</script>

<template lang="">
  <span class="avatar-wrapper" :class="[`avatar-${props.size}`]">
    <img v-if="props.logo" :src="props.logo" alt="" class="avatar-image" />
    <span v-else class="placeholder-wrapper"
      ><Placeholder class="avatar-placeholder"
    /></span>

    <component
      :is="statusIcon"
      :class="['avatar-icon', iconClasses]"
    ></component>
  </span>
</template>

<style lang="scss">
.avatar-wrapper {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-around;

  .avatar-image,
  .placeholder-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .placeholder-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: var(--clr-primary-50);
  }

  .avatar-placeholder {
    path {
      stroke: var(--clr-primary-600);
    }
  }

  .avatar-active {
    circle {
      fill: green;
    }
  }

  .avatar-icon {
    position: absolute;
    border-radius: 50%;
    background: white;
    bottom: 0;
    right: 0;
  }

  &.avatar-xs {
    width: 1.5rem;
    height: 1.5rem;

    .icon-dot {
      width: 0.375rem;
      height: 0.375rem;
    }
    .icon-company {
      width: 0.5rem;
      height: 0.5rem;
    }
    .avatar-placeholder {
      width: 0.85rem;
      height: 0.85rem;
    }
  }
  &.avatar-sm {
    width: 2rem;
    height: 2rem;

    .icon-dot {
      width: 0.5rem;
      height: 0.5rem;
    }
    .icon-company {
      width: 0.625rem;
      height: 0.625rem;
    }
    .avatar-placeholder {
      width: 1.05rem;
      height: 1.05rem;
    }
  }
  &.avatar-md {
    width: 2.5rem;
    height: 2.5rem;

    .icon-dot {
      width: 0.625rem;
      height: 0.625rem;
    }
    .icon-company {
      width: 0.75rem;
      height: 0.75rem;
    }
    .avatar-placeholder {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
  &.avatar-lg {
    width: 3rem;
    height: 3rem;

    .icon-dot {
      width: 0.75rem;
      height: 0.75rem;
    }
    .icon-company {
      width: 0.875rem;
      height: 0.875rem;
    }
    .avatar-placeholder {
      width: 1.45rem;
      height: 1.45rem;
    }
  }
  &.avatar-xl {
    width: 3.5rem;
    height: 3.5rem;

    .icon-dot {
      width: 0.875rem;
      height: 0.875rem;
    }
    .icon-company {
      width: 1rem;
      height: 1rem;
    }
    .avatar-placeholder {
      width: 1.65rem;
      height: 1.65rem;
    }
  }
  &.avatar-2xl {
    width: 4rem;
    height: 4rem;

    .icon-dot {
      width: 1rem;
      height: 1rem;
    }
    .icon-company {
      width: 1.25rem;
      height: 1.25rem;
    }
    .avatar-placeholder {
      width: 1.85rem;
      height: 1.85rem;
    }
  }
}
</style>
