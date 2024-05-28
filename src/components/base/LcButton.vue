<script setup lang="ts">
import type { Component } from "vue"
type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondary-gray"
  | "tertiary"
  | "tertiary-gray"
  | "link"
  | "link-gray"
type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full-width"
interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  destructive?: boolean
  disabled?: boolean
  icon?: Component
  trailingIcon?: boolean
  round?: boolean
  iconOnly?: boolean
}
const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "md",
  destructive: false,
  disabled: false,
  trailingIcon: false,
  iconOnly: false,
})
const classes = computed(() => {
  const variant = `btn--${props.variant}`
  const size = `btn--${props.size}`
  const destructive: string = props.destructive ? `btn--destructive` : ""
  const round = props.round ? "btn--round" : ""
  const iconOnly = props.iconOnly ? "btn--icon-only" : ""
  return [variant, size, round, destructive, iconOnly]
})
</script>

<template>
  <button :class="['btn', classes]" :disabled="disabled" type="button">
    <component
      :is="props.icon"
      v-if="icon && !trailingIcon"
      class="button-icon"
    ></component>
    <slot name="circled-icon"></slot>
    <span class="button__text"><slot></slot></span>
    <component
      :is="props.icon"
      v-if="icon && !!trailingIcon"
      class="button-icon"
    ></component>
  </button>
</template>

<style lang="scss">
.btn {
  display: inline-flex;
  gap: 0.5rem;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  border-radius: 0.5rem;
  font-family: var(--font-jost);
  border: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
  .button-text {
    align-self: center;
  }

  .button__text {
    position: relative;
  }

  .button-icon {
    width: 1rem;
    height: 1rem;
  }
  // Button Variants (Hierarchy) //
  // --------------------------- //
  &--primary {
    &:not(.btn--destructive) {
      background-color: var(--clr-primary-600);
      color: var(--clr-white);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-primary-700);
        }
      }
      &:focus {
        &:not(:disabled) {
          outline: 4px solid var(--clr-pink-100);
        }
      }
      &:disabled {
        background-color: var(--clr-primary-200);
      }
    }
    &.btn--destructive {
      background-color: var(--clr-error-600);
      color: var(--clr-white);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-error-700);
        }
      }
      &:focus {
        &:not(:disabled) {
          outline: 4px solid var(--clr-error-100);
        }
      }
      &:disabled {
        background-color: var(--clr-error-200);
      }
    }
    &.btn--icon-only {
      gap: 0;
    }
  }
  &--secondary {
    &:not(.btn--destructive) {
      background-color: var(--clr-white);
      color: var(--clr-primary-600);
      border: 1px solid var(--clr-primary-600);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-primary-100);
        }
        color: var(--clr-primary-800);
      }
      &:focus {
        &:not(:disabled) {
          outline: 4px solid var(--clr-pink-200);
        }
      }
      &:disabled {
        background-color: var(--clr-primary-25);
        color: var(--clr-primary-300);
      }
    }
    &.btn--destructive {
      background-color: var(--clr-error-50);
      color: var(--clr-error-700);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-error-100);
        }
      }
      &:focus {
        &:not(:disabled) {
          outline: 4px solid var(--clr-error-200);
        }
      }
      &:disabled {
        color: var(--clr-error-300);
        background-color: var(--clr-error-25);
      }
    }
  }
  &--secondary-gray {
    &:not(.btn--destructive) {
      background-color: var(--clr-white);
      color: var(--clr-grey-700);
      border: 1px solid var(--clr-gray-200);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-gray-50);
          color: var(--clr-grey-800);
        }
      }
      &:focus {
        &:not(:disabled) {
          outline: 4px solid var(--clr-gray-100);
        }
      }
      &:disabled {
        color: var(--clr-gray-300);
      }
    }
    &.btn--destructive {
      background-color: var(--clr-white);
      color: var(--clr-error-700);
      border: 1px solid var(--clr-error-300);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-error-50);
        }
      }
      &:focus {
        &:not(:disabled) {
          outline: 4px solid var(--clr-error-200);
        }
      }
      &:disabled {
        color: var(--clr-error-300);
        background-color: var(--clr-error-25);
      }
    }
  }
  &--tertiary {
    &:not(.btn--destructive) {
      background-color: var(--clr-white);
      color: var(--clr-primary-700);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-primary-50);
        }
      }
      &:disabled {
        color: var(--clr-grey-300);
      }
    }
    &.btn--destructive {
      background-color: var(--clr-white);
      color: var(--clr-error-700);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-error-50);
        }
      }
      &:disabled {
        color: var(--clr-error-300);
      }
    }
  }
  &--tertiary-gray {
    &:not(.btn--destructive) {
      background-color: var(--clr-white);
      color: var(--clr-grey-500);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-grey-50);
          color: var(--clr-grey-600);
        }
      }
      &:disabled {
        color: var(--clr-grey-300);
      }
    }
    &.btn--destructive {
      background-color: var(--clr-white);
      color: var(--clr-error-700);
      &:hover {
        &:not(:disabled) {
          background-color: var(--clr-error-50);
        }
      }
      &:disabled {
        color: var(--clr-error-300);
      }
    }
  }
  &--link {
    &:not(.btn--destructive) {
      background-color: transparent;
      color: var(--clr-primary-700);
      &:hover {
        &:not(:disabled) {
          color: var(--clr-primary-800);
        }
      }
      &:disabled {
        color: var(--clr-gray-300);

        & > svg {
          color: var(--clr-gray-300);
        }
      }
    }
    &.btn--destructive {
      background-color: var(--clr-white);
      color: var(--clr-error-700);
      &:hover {
        &:not(:disabled) {
          color: var(--clr-error-800);
        }
      }
      &:disabled {
        color: var(--clr-error-300);
      }
    }
  }
  &--link-gray {
    &:not(.btn--destructive) {
      background-color: var(--clr-white);
      color: var(--clr-grey-500);
      &:hover {
        &:not(:disabled) {
          color: var(--clr-grey-600);
        }
      }
      &:disabled {
        color: var(--clr-grey-300);
      }
    }
    &.btn--destructive {
      background-color: var(--clr-white);
      color: var(--clr-error-700);
      &:hover {
        &:not(:disabled) {
          color: var(--clr-error-800);
        }
      }
      &:disabled {
        color: var(--clr-error-300);
      }
    }
  }

  &--icon-only {
    gap: 0;
  }

  // --------------------------- //
  //         VARIANTS END        //
  // --------------------------- //
  //         BUTTON SIZES        //
  // --------------------------- //
  &--sm {
    font-size: 0.875rem;
    padding: 0.5rem 0.875rem;
  }
  &--md {
    font-size: var(--text-xs-font-size);
    min-width: 36px;
    min-height: 36px;
    padding: 9px 12px;
  }
  &--lg {
    font-size: 1rem;
    min-width: 7.75rem;
    min-height: 2.75rem;
    padding: 0.625rem 1.125rem;
  }
  &--xl {
    font-size: 1rem;
    min-width: 8rem;
    min-height: 3rem;
    padding: 0.75rem 1.25rem;
  }
  &--2xl {
    font-size: 1.5rem;
    min-width: 9.6875rem;
    min-height: 3.75rem;
    padding: 1rem 1.75rem;
    .button-icon {
      width: 1.5rem;
      min-height: 1.5rem;
    }
  }

  &--round {
    border-radius: 50%;
    padding: 0;
  }

  &--full-width {
    font-size: 0.875rem;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.625rem 1rem;
  }
}
</style>
