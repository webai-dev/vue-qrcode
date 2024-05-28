<script setup lang="ts">
import { ref, watch } from "vue"
import type { FieldMeta } from "vee-validate"
import LcInput from "~/components/base/LcInput.vue"
import { isValidUrl } from "~/helpers/formatters"
import type { URL_TYPES } from "~/types/stores/GeneratorStore"

const { t } = useI18n()

type Props = {
  url?: string
  meta?: FieldMeta<unknown>
  placeholder: string
  name: string
  type: URL_TYPES
}

const props = withDefaults(defineProps<Props>(), {
  url: "",
  placeholder: "",
  name: "",
})

const isValid = ref(true)
const validationErrorMessage = ref("")

const emits = defineEmits<{
  (
    e: "update:url",
    payload: { value: string; name: string; type: URL_TYPES },
  ): void
}>()

const url = ref(props.url)

const handleInput = (value: any) => {
  const urlValid = isValidUrl(value.target?.value)
  url.value = value.target?.value
  isValid.value = urlValid
  validationErrorMessage.value = urlValid ? "" : t("common.invalid_url_error")
}

const handleSubmit = () => {
  const urlValid = isValidUrl(url?.value)
  if (!urlValid) return
  emits(`update:url`, {
    name: props.name,
    value: url.value,
    type: props.type,
  })
}

watch(
  () => props.url,
  (newVal) => {
    url.value = newVal
  },
)
</script>

<template>
  <div class="wrapper">
    <LcInput
      v-model="url"
      :meta="meta"
      :placeholder="placeholder"
      :name="name"
      :error="validationErrorMessage"
      @input="handleInput"
      @blur="handleSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
}
</style>
