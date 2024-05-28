<script lang="ts" setup>
import { Form } from "vee-validate"
import { useSessionStore } from "~/stores/session"
import { rules } from "~/modules/validationRules"
import type { IIdPartSettingsDto } from "~/types/stores/GeneratorStore"
import LcGeneratorSettingOverview from "~/components/shared/generators/LcLabelsPreviewItems.vue"
import LcFormItem from "~/components/base/LcFormItem.vue"
import LcInput from "~/components/base/LcInput.vue"

interface GeneratorAmountProps {
  idParts: IIdPartSettingsDto[]
  shortUrl: string | boolean
  submitText: string
}

const props = defineProps<GeneratorAmountProps>()

const emits = defineEmits<{
  (
    e: "submit",
    customerId: string,
    projectId: string,
    amount: number,
    batch: number,
  ): void
  (e: "cancel"): void
}>()

const route = useRoute()

const sessionStore = useSessionStore()

const amount = ref<string>("")
const batch = ref<string>("")
const didSetBatchManually = ref<boolean>(false)
const lastIdPartChanged = ref<any>({})

const onAmountChange = (value: string) => {
  if (!didSetBatchManually.value) {
    batch.value = value
  }
}

const didUpdateBatch = () => {
  didSetBatchManually.value = true
}

rules()
</script>
<template>
  <div class="generator-amount">
    <LcGeneratorSettingOverview
      :id-parts="props.idParts"
      :short-url="props.shortUrl"
      :last-id-part-changed="lastIdPartChanged"
    />
    <Form
      @submit="
        $emit(
          'submit',
          sessionStore.getSelectedCustomerId as string,
          route.params.projectId as string,
          Number(amount),
          Number(batch),
        )
      "
    >
      <LcFormItem
        v-slot="{ field, meta }"
        name="Amount"
        :label="$t('common.amount')"
        rules="required|number"
      >
        <LcInput
          v-model="amount"
          v-bind="field"
          :meta="meta"
          @update:model-value="onAmountChange"
        />
      </LcFormItem>
      <LcFormItem
        v-slot="{ field, meta }"
        name="batch"
        :label="$t('generator.how_many_per_exported_field')"
        rules="number|maxVal:1000000"
      >
        <LcInput
          v-model="batch"
          v-bind="field"
          :meta="meta"
          @update:model-value="didUpdateBatch"
        />
      </LcFormItem>
      <div class="generator-id-settings-btns">
        <LcButton variant="link" @click="$emit('cancel')">
          {{ $t("common.cancel") }}
        </LcButton>
        <LcButton type="submit">{{ props.submitText }}</LcButton>
      </div>
    </Form>
  </div>
</template>
<style lang="scss">
.generator-amount {
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .field--wrapper {
    min-width: 400px;

    @media screen and (max-width: 440px) {
      width: 100%;
    }
  }
}
</style>
