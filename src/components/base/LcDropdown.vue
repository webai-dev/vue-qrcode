export default { inheritAttrs: false }
<script lang="ts" setup>
import type { FieldMeta } from "vee-validate"
import vSelect from "vue-select"
import "vue-select/dist/vue-select.css"
import { createPopper } from "@popperjs/core"

const props = defineProps<{
  modelValue?: any
  placeholder?: string
  disabled?: boolean
  label?: string
  meta?: FieldMeta<unknown>
  options?: Array<any>
  value?: any
  addOn?: "before" | "after"
  clearable?: boolean
  reduce?: Function
  popperClass?: string
}>()
const emit = defineEmits<{
  (event: "update:modelValue", value: string): void
  (event: "update", selectedOption: any): void
}>()

const placement = "bottom"
const withPopper = (
  dropdownList: any,
  component: any,
  { width }: HTMLInputElement,
) => {
  dropdownList.style.width = width
  dropdownList.className = `${dropdownList.className} ${props.popperClass}`
  const popper = createPopper(component.$refs.toggle, dropdownList, {
    placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 1],
        },
      },
      {
        name: "toggleClass",
        enabled: true,
        phase: "write",
        fn({ state }) {
          component.$el.classList.toggle("drop-up", state.placement === "top")
          component.$el.classList.toggle(
            "drop-down",
            state.placement === "bottom",
          )
        },
      },
    ],
  })
  return () => popper.destroy()
}
const isFocused = ref(false)
const toggleFocus = () => {
  isFocused.value = !isFocused.value
}
const selected = ref(props.modelValue)

// fix for known bug: option slot infers wrong type
const asAny = (option: any) => option as any

onUpdated(() => (selected.value = props.modelValue))
</script>

<template>
  <v-select
    v-model="selected"
    v-bind="$attrs"
    :clearable="clearable"
    :options="options"
    :placeholder="placeholder"
    :label="label"
    :disabled="disabled"
    :calculate-position="withPopper"
    :reduce="reduce"
    append-to-body
    :value="value"
    :class="[
      $attrs.class,
      {
        focus: isFocused,
        'select--error': !props.meta?.valid && props.meta?.validated,
        'addon-before': props.addOn === 'before',
        'addon-after': props.addOn === 'after',
      },
    ]"
    @open="toggleFocus"
    @close="toggleFocus"
    @input="$emit('update:modelValue', selected as string)"
    @change="emit('update:modelValue', selected as string)"
    @option:selected="emit('update:modelValue', selected as string)"
    @update:model-value="
      () => {
        emit('update:modelValue', selected as string)
        emit('update', selected)
      }
    "
  >
    <template v-if="$slots.default" #option="option">
      <slot :option="asAny(option)" />
    </template>
  </v-select>
</template>

<style lang="scss">
:root {
  --vs-colors--dark: var(--clr-gray-900);
  --vs-border-color: var(--clr-gray-300);
  --vs-border-radius: 8px;
  --vs-controls-color: var(--clr-gray-500);
  --vs-dropdown-option--active-bg: var(--clr-primary-50);
  --vs-dropdown-option--active-color: var(--clr-gray-900);
  --vs-font-size: var(--text-sm-font-size);
  --vs-font-height: var(--text-sm-line-heigh);
  --vs-line-height: 1.4;
  --vs-dropdown-max-height: 350px;
  --vs-search-input-placeholder-color: var(--clr-gray-500);
}

.vs__selected,
.vs__dropdown-menu {
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm-line-height);
  margin: 0;
  padding: 0;
  border-radius: 12px;
}

.vs__search,
.vs__search:focus {
  margin: 0;
  padding: 0;
}

.vs--searchable .vs__dropdown-toggle {
  padding: calc(var(--space-2) - 1px) var(--space-3);
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm-line-height);
  background-color: white;
}

.vs--open .vs__dropdown-toggle {
  border-radius: 8px;
}

.addon-before,
.addon-after {
  width: 6rem;
  margin-top: 23px;

  .vs__selected-options {
    flex-wrap: nowrap;
    overflow: hidden;

    .vs__selected {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }

  .vs__clear {
    display: none;
  }
}

.v-select:not(.vs--disabled) .vs__actions {
  cursor: pointer;
}

.addon-before {
  .vs__dropdown-toggle,
    // override for open status, css specificity >40
  &.v-select.vs--open.vs--single.vs--searchable .vs__dropdown-toggle {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }
}

.addon-after {
  .vs__dropdown-toggle,
    // override for open status, css specificity >40
  &.v-select.vs--open.vs--single.vs--searchable .vs__dropdown-toggle {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }
}

.vs__dropdown-menu {
  min-width: 5rem;
}
.focus > .vs__dropdown-toggle {
  outline: transparent;
  border-color: var(--clr-primary-300) !important;
}

.select--error > .vs__dropdown-toggle {
  border-color: var(--clr-error-300);
}

.select--error.focus .vs__dropdown-toggle {
  border-color: var(--clr-error-300) !important;
}

.vs__dropdown-option {
  word-break: normal;
  box-sizing: border-box;
  padding: var(--space-2) var(--space-4);
}
</style>
