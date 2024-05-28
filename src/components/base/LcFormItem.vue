<script lang="ts">
import { Field } from "vee-validate"
import { defineProps } from "vue"
import type { BaseSchema } from "yup"
import type { AnyObject } from "yup/lib/types"

/// <reference types="vite-svg-loader" />
export default {
  name: "LcFormItem",
  inheritAttrs: false,
  customOptions: {},
}
</script>
<script lang="ts" setup>
const props = defineProps<{
  name: string
  label?: string
  rules?: BaseSchema<unknown, AnyObject, any> | string | Object | Function | any
  className?: string
  annotation?: string
  type?: string
  defaultValue?: any
}>()
</script>

<template>
  <div :class="['field--wrapper', className ? className : '']">
    <Field
      v-slot="{ field, errorMessage, meta, value }"
      :name="name"
      :rules="rules"
      :type="type"
      :value="defaultValue"
    >
      <div v-if="Boolean(label)" class="label">
        {{ label }}
      </div>
      <slot name="default" v-bind="{ field, meta, value }"></slot>
      <div
        v-if="(!meta.valid && !!value && value !== '') || errorMessage?.length"
        class="error"
      >
        <span v-if="!$slots.customErrors">
          {{ errorMessage || "Invalid input" }}
        </span>
        <slot name="customErrors" v-bind="{ meta }" />
      </div>
      <div v-if="meta.valid && !errorMessage && annotation" class="annotation">
        {{ annotation }}
      </div>
    </Field>
  </div>
</template>

<style lang="scss" scoped>
.field {
  &--wrapper {
    margin-bottom: var(--space-2);

    @include mq("mobile") {
      flex-wrap: wrap;
    }
  }
}
.label {
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm--line-height);
  text-transform: capitalize;
  margin-bottom: 6px;
  color: var(--clr-gray-700);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.error,
.annotation {
  font-size: var(--text-xs-font-size);
  line-height: var(--text-sm-line-height);
  margin-top: 3px;
  color: var(--clr-error-500);
  min-height: var(--text-sm-line-height);
}

.annotation {
  color: var(--clr-gray-500);
}
</style>
