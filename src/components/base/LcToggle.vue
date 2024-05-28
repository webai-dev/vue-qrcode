<script setup lang="ts">
import type { FieldMeta } from "vee-validate"
import { useModelWrapper } from "~/composables/useModelWrapper"

type ToggleSize = "sm" | "md"

interface ToggleProps {
  id: string
  modelValue?: boolean
  meta?: FieldMeta<unknown>
  label?: string
  description?: string
  disabled?: boolean
  size?: ToggleSize
  checked?: boolean
}

const props = withDefaults(defineProps<ToggleProps>(), {
  disabled: false,
  size: "sm",
})

const emits = defineEmits<{
  (event: "update:modelValue", checked: boolean): void
  (event: "blur"): void
}>()

const checked = useModelWrapper(props, emits)
const error = computed(() => props.meta?.valid === false)
</script>

<template>
  <div
    :class="[
      'toggle',
      `toggle-${props.size}`,
      props.disabled && 'disabled',
      error && 'error',
    ]"
  >
    <input
      :id="props.id"
      v-model="checked"
      :disabled="props.disabled"
      :class="[
        'toggle-input',
        (props.checked || checked) && 'toggle-input-checked',
      ]"
      type="checkbox"
      :value="props.checked"
      @blur="$emit('blur')"
    />
    <label class="toggle-label" :for="props.id">
      <div :class="['toggle-block', error && 'toggle-block-error']"></div>
      <slot />
      <span v-if="props.description" class="toggle-description">{{
        props.description
      }}</span>
    </label>
  </div>
</template>

<style lang="scss" scoped>
$width-sm: 2.25rem;
$height-sm: 1.25rem;
$width-md: 2.75rem;
$height-md: 1.5rem;
$spacing: 0.5rem;
$handler-margin: 2px;
$transition-duration: 0.15s;
$handler-size-sm: calc($height-sm - $handler-margin * 2);
$handler-size-md: calc($height-md - $handler-margin * 2);

.toggle {
  display: inline-flex;
  justify-content: center;
  top: 0.25rem;
  position: relative;

  &.disabled {
    cursor: not-allowed;
  }

  .toggle-input {
    position: absolute;
    height: 0;
    width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);

    &:not(:disabled) + .toggle-label {
      cursor: pointer;
    }

    &:disabled + .toggle-label {
      cursor: not-allowed;
    }

    /* hover */
    &:not(:disabled):not(.toggle-input-checked)
      + .toggle-label:hover
      .toggle-block {
      background-color: var(--clr-gray-200);
    }

    /* focus */
    &:focus + .toggle-label .toggle-block {
      box-shadow: var(--shadow-focus-pink);
    }

    /* focus unchecked */
    &:focus:not(.toggle-input-checked) + .toggle-label .toggle-block {
      background-color: var(--clr-gray-50);
    }

    /* checked */
    &.toggle-input-checked + .toggle-label .toggle-block {
      background-color: var(--clr-primary-600);

      &::after {
        left: calc($width-sm - $handler-size-sm - $handler-margin);
      }
    }

    /* disabled */
    &:disabled + .toggle-label .toggle-block {
      background-color: var(--clr-gray-100);
    }

    &.toggle-input-checked:disabled + .toggle-label .toggle-block {
      background-color: var(--clr-gray-100);
    }

    &:disabled + .toggle-label {
      color: var(--clr-gray-300);
    }

    /* error */
    &:not(:disabled):not(.toggle-input-checked)
      + .toggle-label
      .toggle-block.toggle-block-error {
      background-color: var(--clr-error-100);
    }

    /* error:hover */
    &:not(:disabled),
    &:not(:disabled).toggle-input-checked {
      + .toggle-label .toggle-block.toggle-block-error {
        background-color: var(--clr-error-400);
      }
    }

    /* error:disabled */
    &:disabled + .toggle-label .toggle-block.toggle-block-error {
      background-color: var(--clr-error-100);

      &::after {
        background-color: var(--clr-error-50);
      }
    }
  }

  .toggle-block {
    position: relative;
    display: inline-block;
    width: $width-sm;
    height: $height-sm;
    flex-shrink: 0;
    flex-grow: 0;
    border-radius: calc($height-sm / 2);
    margin-right: $spacing;
    background-color: var(--clr-gray-100);
    transition: background-color $transition-duration;

    &::after {
      content: "";
      position: absolute;
      top: $handler-margin;
      left: $handler-margin;
      width: $handler-size-sm;
      height: $handler-size-sm;
      border-radius: calc($handler-size-sm / 2);
      background-color: var(--clr-white);
      transition: left $transition-duration;
      box-shadow: var(--shadow-sm);
    }
  }

  .toggle-label {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    user-select: none;
    color: var(--clr-gray-700);
    font-size: 0.875rem;
    line-height: 1.25rem;

    .toggle-description {
      width: 100%;
      margin-left: calc($spacing + $width-sm);
      color: var(--clr-gray-500);
    }
  }

  &.toggle-md {
    .toggle-label {
      font-size: 1rem;
      line-height: 1.5rem;

      .toggle-block {
        width: $width-md;
        height: $height-md;
        border-radius: calc($height-md / 2);

        &::after {
          width: $handler-size-md;
          height: $handler-size-md;
          border-radius: calc($handler-size-md / 2);
        }
      }
    }

    .toggle-description {
      margin-left: calc($spacing + $width-md);
    }

    /* checked */
    .toggle-input.toggle-input-checked + .toggle-label .toggle-block::after {
      left: calc($width-md - $handler-size-md - $handler-margin);
    }
  }
}
</style>
