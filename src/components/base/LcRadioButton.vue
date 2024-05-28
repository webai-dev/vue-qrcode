<script setup lang="ts">
import type { FieldMeta } from "vee-validate"
import { useModelWrapper } from "~/composables/useModelWrapper"

type RadioButtonSize = "sm" | "md"

interface RadioButtonProps {
  id: string
  name: string
  value: any
  modelValue?: any
  meta?: FieldMeta<unknown>
  description?: string
  disabled?: boolean
  size?: RadioButtonSize
}

const props = withDefaults(defineProps<RadioButtonProps>(), {
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
      'radiobutton',
      `radiobutton-${props.size}`,
      props.disabled && 'disabled',
      error && 'error',
    ]"
  >
    <input
      :id="props.id"
      v-model="checked"
      :value="props.value"
      :name="props.name"
      :disabled="props.disabled"
      class="radiobutton-input"
      type="radio"
      @blur="$emit('blur')"
      @input="$emit('update:modelValue', props.value)"
    />
    <label class="radiobutton-label" :for="props.id">
      <div
        :class="['radiobutton-block', error && 'radiobutton-block-error']"
      ></div>
      <slot />
      <span v-if="props.description" class="radiobutton-description">{{
        props.description
      }}</span>
    </label>
  </div>
</template>

<style lang="scss" scoped>
$size-sm: 1rem;
$size-md: 1.25rem;
$dot-size-sm: 0.4rem;
$dot-size-md: 0.5rem;
$spacing: 0.5rem;
$border-width: 1px;

.radiobutton {
  display: inline-flex;
  justify-content: center;
  top: 0.25rem;
  position: relative;

  .radiobutton-input {
    position: absolute;
    height: 0;
    width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);

    &:not(:disabled) + .radiobutton-label {
      cursor: pointer;
    }

    &:disabled + .radiobutton-label {
      cursor: not-allowed;
    }

    /* hover */
    &:not(:disabled):not(:checked)
      + .radiobutton-label:hover
      .radiobutton-block {
      border-color: var(--clr-primary-600);
      background-color: var(--clr-primary-50);
    }

    /* focus */
    &:focus + .radiobutton-label .radiobutton-block {
      background-color: var(--clr-primary-50);
      box-shadow: var(--shadow-focus-pink);
    }

    /* focus unchecked */
    &:focus:not(:checked) + .radiobutton-label .radiobutton-block {
      background-color: transparent;
      border-color: var(--clr-primary-300);
    }

    /* checked */
    &:checked + .radiobutton-label .radiobutton-block {
      border-color: var(--clr-primary-600);
      background-color: var(--clr-primary-50);

      &::after {
        background-color: var(--clr-primary-600);
      }
    }

    /* disabled */
    &:disabled + .radiobutton-label .radiobutton-block {
      border-color: var(--clr-gray-200);
      background-color: var(--clr-gray-100);
    }
    &:disabled:checked + .radiobutton-label .radiobutton-block::after {
      background-color: var(--clr-gray-200);
    }

    &:disabled + .radiobutton-label {
      color: var(--clr-gray-300);
    }

    /* error */
    &:not(:disabled)
      + .radiobutton-label
      .radiobutton-block.radiobutton-block-error {
      border-color: var(--clr-error-400);
    }
    /* error:hover */
    &:not(:disabled):hover,
    &:not(:disabled):checked {
      & + .radiobutton-label .radiobutton-block.radiobutton-block-error {
        background-color: var(--clr-error-50);
        border-color: var(--clr-error-400);
        &::after {
          background-color: var(--clr-error-400);
        }
      }
    }
    /* error:disabled */
    &:disabled + .radiobutton-label .radiobutton-block.radiobutton-block-error {
      background-color: var(--clr-error-25);
      border-color: var(--clr-error-100);
    }
    &:disabled:checked
      + .radiobutton-label
      .radiobutton-block.radiobutton-block-error::after {
      background-color: var(--clr-error-100);
    }
  }

  .radiobutton-label {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    user-select: none;
    color: var(--clr-gray-700);
    font-size: 0.875rem;
    line-height: 1.25rem;

    .radiobutton-block {
      content: "";
      position: relative;
      display: inline-block;
      width: $size-sm;
      height: $size-sm;
      flex-shrink: 0;
      flex-grow: 0;
      border: $border-width solid var(--clr-gray-300);
      border-radius: $size-sm;
      margin-right: $spacing;

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: $dot-size-sm;
        height: $dot-size-sm;
        border-radius: $dot-size-sm;
        background-color: transparent;
      }
    }

    .radiobutton-description {
      width: 100%;
      margin-left: calc($spacing + $size-sm + 2 * $border-width);
      color: var(--clr-gray-500);
    }
  }

  &.radiobutton-md {
    .radiobutton-label {
      font-size: 1rem;
      line-height: 1.5rem;
      .radiobutton-block {
        width: 1.25rem;
        height: 1.25rem;

        &::after {
          width: $dot-size-md;
          height: $dot-size-md;
          border-radius: $dot-size-md;
        }
      }
    }

    .radiobutton-description {
      margin-left: calc($spacing + $size-md + 2 * $border-width);
    }
  }
}
</style>
