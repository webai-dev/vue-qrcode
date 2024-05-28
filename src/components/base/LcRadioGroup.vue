<script setup lang="ts">
import { defineEmits, defineProps, withDefaults, ref, watchEffect } from "vue"

interface RadioGroupProps {
  modelValue?: string
  vertical?: boolean
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  vertical: true,
})

const emits = defineEmits<{
  (event: "update:modelValue", value: string): void
}>()

const selectedValue = ref(props.modelValue)

watchEffect(() => {
  selectedValue.value = props.modelValue
})

const select = (value: string) => {
  selectedValue.value = value
  emits("update:modelValue", value)
}
</script>

<template>
  <div
    :class="[
      'radio-group',
      props.vertical ? 'radio-group-vertical' : 'radio-group-horizontal',
    ]"
  >
    <slot :select="select" :selected-value="selectedValue" />
  </div>
</template>

<style lang="scss" scoped>
.radio-group {
  display: flex;

  &.radio-group-vertical {
    flex-direction: column;
    align-items: flex-start;

    :slotted(.radiobutton) {
      & + .radiobutton {
        margin-top: 1rem;
      }
    }
  }

  &.radio-group-horizontal {
    flex-direction: row;

    :slotted(.radiobutton) {
      & + .radiobutton {
        margin-left: 1rem;
      }
    }
  }
}
</style>
