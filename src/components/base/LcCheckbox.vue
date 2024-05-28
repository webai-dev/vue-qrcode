<script setup lang="ts">
import type { FieldMeta } from "vee-validate"
import CheckIcon from "@/assets/icons/icon-check.svg?component"
import MinusIcon from "@/assets/icons/icon-minus.svg?component"
import { useModelWrapper } from "~/composables/useModelWrapper"

type CheckboxSize = "sm" | "md"

interface CheckboxProps {
  id: string
  modelValue?: boolean | null
  meta?: FieldMeta<unknown>
  label?: string
  description?: string
  disabled?: boolean
  indeterminate?: boolean
  name?: string
  size?: CheckboxSize
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  disabled: false,
  indeterminate: false,
  size: "sm",
})

const emits = defineEmits<{
  (event: "update:modelValue", checked: boolean): void
  (event?: "blur"): void
}>()

const checked = useModelWrapper(props, emits)
const indeterminate = computed(() => !props.modelValue && props.indeterminate)
const iconSize = computed(() => (props.size === "sm" ? "1rem" : "1.25rem"))
const error = computed(() => props.meta?.valid === false && props.meta?.dirty)
</script>

<template>
  <div
    :class="[
      'checkbox',
      `checkbox-${props.size}`,
      props.disabled && 'disabled',
      error && 'error',
    ]"
  >
    <input
      :id="props.id"
      v-model="checked"
      :name="name"
      :disabled="props.disabled"
      :indeterminate.prop="indeterminate"
      class="checkbox-input"
      type="checkbox"
      @blur="emits('blur')"
    />
    <label class="checkbox-label" :for="props.id">
      <div :class="['checkbox-block', error && 'checkbox-block-error']">
        <CheckIcon
          v-if="checked"
          :width="iconSize"
          class="checkbox-icon"
          data-cy="check-icon"
        />
        <MinusIcon
          v-if="indeterminate"
          :width="iconSize"
          class="checkbox-icon"
          data-cy="minus-icon"
        />
      </div>
      <slot />
      <span v-if="props.description" class="checkbox-description">{{
        props.description
      }}</span>
    </label>
  </div>
</template>

<style lang="scss" scoped>
$size-sm: 1rem;
$size-md: 1.25rem;
$spacing: 0.5rem;
$border-width: 1px;

.checkbox {
  display: inline-flex;
  justify-content: center;
  top: 0.25rem;
  position: relative;

  .checkbox-input {
    position: absolute;
    height: 0;
    width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);

    &:not(:disabled) + .checkbox-label {
      cursor: pointer;
    }

    &:disabled + .checkbox-label {
      cursor: not-allowed;
    }

    /* hover */
    &:not(:disabled):not(:checked) + .checkbox-label:hover .checkbox-block {
      border-color: var(--clr-primary-600);
      background-color: var(--clr-primary-50);
    }

    /* focus */
    &:focus + .checkbox-label .checkbox-block {
      background-color: var(--clr-primary-50);
      box-shadow: var(--shadow-focus-pink);
    }

    /* focus unchecked */
    &:focus:not(:checked) + .checkbox-label .checkbox-block {
      background-color: transparent;
      border-color: var(--clr-primary-300);
    }

    /* checked */
    &:checked + .checkbox-label .checkbox-block {
      border-color: var(--clr-primary-600);
      background-color: var(--clr-primary-50);
    }

    /* indeterminate */
    &:indeterminate + .checkbox-label .checkbox-block {
      border-color: var(--clr-primary-600);
      background-color: var(--clr-primary-50);
    }

    /* disabled */
    &:disabled + .checkbox-label .checkbox-block {
      border-color: var(--clr-gray-200);
      background-color: var(--clr-gray-100);
    }

    &:disabled:checked + .checkbox-label .checkbox-block .checkbox-icon {
      stroke: var(--clr-gray-200);
    }

    &:disabled:indeterminate + .checkbox-label .checkbox-block .checkbox-icon {
      stroke: var(--clr-gray-200);
    }

    &:disabled + .checkbox-label {
      color: var(--clr-gray-300);
    }

    /* error */
    &:not(:disabled) + .checkbox-label .checkbox-block.checkbox-block-error {
      border-color: var(--clr-error-400);

      .checkbox-icon {
        stroke: var(--clr-error-400);
      }
    }

    /* error:hover */
    &:not(:disabled),
    &:not(:disabled):indeterminate,
    &:not(:disabled):checked {
      + .checkbox-label .checkbox-block.checkbox-block-error {
        background-color: var(--clr-error-50);
        border-color: var(--clr-error-400);
      }
    }

    /* error:disabled */
    &:disabled + .checkbox-label .checkbox-block.checkbox-block-error {
      background-color: var(--clr-error-25);
      border-color: var(--clr-error-100);

      .checkbox-icon {
        stroke: var(--clr-error-100);
      }
    }
  }

  .checkbox-label {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    user-select: none;
    color: var(--clr-gray-700);
    font-size: 0.875rem;
    line-height: 1.25rem;

    .checkbox-block {
      content: "";
      position: relative;
      display: inline-block;
      width: $size-sm;
      height: $size-sm;
      flex-shrink: 0;
      flex-grow: 0;
      border: $border-width solid var(--clr-gray-300);
      border-radius: 0.25rem;
      margin-right: $spacing;

      .checkbox-icon {
        position: absolute;
        left: 0;
        top: 0;
        stroke: var(--clr-primary-600);
      }
    }

    .checkbox-description {
      width: 100%;
      margin-left: calc($spacing + $size-sm + 2 * $border-width);
      color: var(--clr-gray-500);
    }
  }

  &.checkbox-md {
    .checkbox-label {
      font-size: 1rem;
      line-height: 1.5rem;

      .checkbox-block {
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    .checkbox-description {
      margin-left: calc($spacing + $size-md + 2 * $border-width);
    }
  }
}
</style>
