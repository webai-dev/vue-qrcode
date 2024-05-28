<script lang="ts">
import type { FieldMeta } from "vee-validate"
import type { WatchSource } from "vue"

export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  prefix?: string
  meta?: FieldMeta<unknown>
  type?: string
  icon?: string
  addonBefore?: boolean
  addonAfter?: boolean
  useValueInsteadOfModel?: boolean
  value?: any
  error?: string
  autofocus?: boolean
  selectAllOnFocus?: boolean
  readonly?: boolean
}>()

const textinput = ref<null | HTMLInputElement>(null)

const emits = defineEmits<{
  (event: "update:modelValue", value: string): void
  (event: "validation", valid: boolean): void
  (event?: "blur"): void
}>()

onMounted(() => {
  props.autofocus && textinput?.value?.focus()
  props.selectAllOnFocus && textinput?.value?.select()
  emits("validation", props.meta?.valid as boolean)
})

watch(props.meta as FieldMeta<unknown>, (newMeta: FieldMeta<unknown>) => {
  emits("validation", newMeta.valid)
})
</script>

<template>
  <div class="wrapper">
    <component :is="props.icon" v-if="props.icon" class="prefix"></component>
    <input
      ref="textinput"
      :value="useValueInsteadOfModel ? value : modelValue"
      v-bind="$attrs"
      :class="[
        'input',
        {
          'input--prefix': Boolean(icon),
          'input--error': !props.meta?.valid && textinput?.value !== '',
          'input-addon-before': props.addonBefore,
          'input-addon-after': props.addonAfter,
        },
      ]"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      @blur="emits('blur')"
    />
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--clr-gray-300);
  color: var(--clr-gray-900);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm-line-height);
  transition: box-shadow 0.2s ease-in-out;
  box-sizing: border-box;
  outline: transparent;

  &.input-addon-before {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &.input-addon-after {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &::placeholder {
    color: var(--clr-gray-500);
  }

  &:not(:read-only):focus {
    outline: transparent;
    box-shadow: 0px 0px 0px 4px var(--clr-pink-100);
    border-color: var(--clr-primary-300);
  }

  &--prefix {
    padding: var(--space-2) var(--space-3) var(--space-2) 36px;
  }

  &--error {
    border-color: var(--clr-error-300);

    &:focus {
      border-color: var(--clr-error-300);
      box-shadow: 0px 0px 0px 4px var(--clr-error-100);
    }
  }
}
.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
}

.prefix {
  position: absolute;
  display: flex;
  align-items: center;
  background: transparent;
  padding-left: 10px;
}
.error {
  color: var(--clr-error-500);
  font-size: 12px;
  max-width: 180px;
}
</style>
`
