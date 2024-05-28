<script lang="ts" setup>
const password = ref("")

const emits = defineEmits<{
  (event: "blur", password: string): void
  (event: "update:modelValue", password: string): void
}>()
</script>
<template>
  <LcFormItem
    name="password"
    :label="$t('password')"
    :rules="{
      required: true,
      min: 8,
      regex:
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\.\[\]\{\}\(\)?\-”!@#%&/\\,><\':;|_~\`\+=]).*$/,
    }"
  >
    <template #default="{ field, meta }">
      <LcInput
        v-model="password"
        v-bind="field"
        :meta="meta"
        type="password"
        :placeholder="$t('Enter your password')"
        @blur="emits('blur', password)"
        @update:model-value="emits('update:modelValue', password)"
      />
    </template>
    <template #customErrors="{ meta }">
      <div>The password must contain at least</div>
      <ul v-if="!meta.valid" class="form-password-error">
        <li>1 number</li>
        <li>1 uppercase letter</li>
        <li>1 lowercase letter</li>
        <li>
          {{ `1 special character of: ${".[]{}()?-\"!@#%&/\\,>\<':;|_~`+="}` }}
        </li>
        <li>8 characters in total</li>
      </ul>
    </template>
  </LcFormItem>
</template>
