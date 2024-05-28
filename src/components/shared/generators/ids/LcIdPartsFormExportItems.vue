<script setup lang="ts">
import LcFormItem from "~/components/base/LcFormItem.vue"
import LcInput from "~/components/base/LcInput.vue"
import { localeReplacing, localeWrapper } from "~/helpers/formatters"
import { rules } from "~/modules/validationRules"

type Props = {
  amount?: string
  perExported?: string
  projectName?: string
  amountLabel?: string
}

rules()

const { t } = useI18n()

const props = defineProps<Props>()

const emits = defineEmits<{
  (event: "update:amount", value: string): void
  (event: "update:per-exported", value: string): void
  (event: "update:project-name", value: string): void
}>()
const docReady = ref(false)

const amount = ref<string>(localeWrapper(props.amount!) || "0")
const perExported = ref<string>(localeWrapper(props.perExported!) || "0")
const projectName = ref<string>(
  props.projectName || t("generator.default_project_name"),
)
const amountLabel = ref<string | undefined>(props.amountLabel)

const handleAmountUpdate = (value: string) => {
  const formatted = localeReplacing(value)
  amount.value = localeWrapper(formatted)
  emits("update:amount", formatted)
}

onMounted(() => {
  docReady.value = true
})

const isValidFormattedNumber = (value: string) => {
  if (!docReady.value) return true
  if (
    Number(localeReplacing(value ?? "")) > 0 &&
    Number(localeReplacing(value ?? "")) <= 1000000
  )
    return true
  return t("links.export.value_should_be_greater", { min: 0, max: 1000000 })
}

const handlePerExportedUpdate = (value: string) => {
  const formatted = localeReplacing(value)
  perExported.value = localeWrapper(formatted)
  emits("update:per-exported", formatted)
}
</script>
<template>
  <div class="container">
    <LcFormItem
      v-slot="{ field, meta }"
      name="amount"
      :label="amountLabel"
      :rules="isValidFormattedNumber"
      class-name="item"
    >
      <LcInput
        v-model="amount"
        v-bind="field"
        :meta="meta"
        class="input__number"
        name="amount"
        @update:model-value="handleAmountUpdate"
      />
    </LcFormItem>
    <LcFormItem
      v-slot="{ field, meta }"
      name="per-exported"
      :label="t('generator.overview.amount_per_exported')"
      :rules="isValidFormattedNumber"
      class-name="item"
    >
      <LcInput
        v-model="perExported"
        v-bind="field"
        :meta="meta"
        class="input__number"
        @update:model-value="handlePerExportedUpdate"
      />
    </LcFormItem>
    <LcFormItem
      v-slot="{ field, meta }"
      name="project-name"
      :label="t('generator.overview.label_labels_project_name')"
      class-name="item"
      rules="required"
    >
      <LcInput
        v-model="projectName"
        v-bind="field"
        :meta="meta"
        class="input__name"
        name="project-name"
        @update:model-value="(value) => emits('update:project-name', value)"
      />
    </LcFormItem>
  </div>
</template>
<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 0.75rem;
}

.item {
  display: grid;
  grid-template-areas:
    "label input"
    ". error";
  grid-template-columns: min-content 1fr;
  column-gap: var(--space-10);
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.item :deep(.label) {
  grid-area: label;
  margin-bottom: 0;
  margin-right: 18px;
  width: 12rem;
}

.item :deep(.wrapper) {
  grid-area: input;
}

.item :deep(.error) {
  grid-area: error;
}

.item :deep(.input__number) {
  width: 190px;
}

.item :deep(.input__name) {
  width: 353px;
}
.error {
  color: var(--clr-error-500);
  font-size: 12px;
}

@include mq("mobile") {
  .item :deep(.input) {
    margin-top: 6px;
  }

  .item :deep(.input__name) {
    max-width: 85%;
  }
}
</style>
