<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { Form } from "vee-validate"
import LcModal from "~/components/base/LcModal.vue"
import { useFormattedValue } from "~/composables/useFormattedValue"

type GeneratorAddSetModalProps = {
  show: boolean
  close: () => void
  createSet: (amount: string, perExportedFile: string) => void
}

const props = defineProps<GeneratorAddSetModalProps>()

const { t } = useI18n()

const {
  formattedValue: amountFormattedValue,
  handleChange: amountHandleChange,
  value: amountValue,
} = useFormattedValue("")
const {
  formattedValue: perExportedFileFormattedValue,
  handleChange: perExportedFileHandleChange,
  value: perExportedFileValue,
} = useFormattedValue("")
</script>

<template>
  <LcModal
    class-name="add-set"
    :show="props.show"
    :title="$t('generator.add_set_modal.add_set')"
    @close="props.close"
  >
    <Form @submit="createSet(amountValue, perExportedFileValue)">
      <div class="add-set__form">
        <LcFormItem
          v-slot="{ field, meta }"
          name="amount-of-ids"
          rules="required"
          class-name="add-set__form-item"
          :label="$t('generator.add_set_modal.total_amount_of_ids')"
        >
          <LcInput
            v-model="amountFormattedValue"
            v-bind="field"
            :meta="meta"
            @update:model-value="amountHandleChange"
          />
        </LcFormItem>
        <LcFormItem
          v-slot="{ field, meta }"
          name="amount-per-file"
          rules="required"
          class-name="add-set__form-item"
          :label="$t('generator.add_set_modal.amount_per_exported_file')"
        >
          <LcInput
            v-model="perExportedFileFormattedValue"
            v-bind="field"
            :meta="meta"
            @update:model-value="perExportedFileHandleChange"
          />
        </LcFormItem>
      </div>

      <div class="add-set__actions">
        <LcButton variant="link" class="add-set__actions-button" @click="close"
          >{{ $t("common.cancel") }}
        </LcButton>
        <LcButton
          variant="primary"
          class="add-set__actions-button"
          type="submit"
          >{{ $t("common.add") }}
        </LcButton>
      </div>
    </Form>
  </LcModal>
</template>

<style scoped lang="scss">
.add-set {
  &__form {
    display: flex;
    flex-direction: column;
    row-gap: 1.375rem;
    margin-bottom: 4.875rem;
  }

  &__form-item {
    margin-bottom: 0;

    :deep(.input) {
      width: 11.875rem;
    }

    :deep(.label) {
      font-size: var(--text-md-font-size);
      line-height: var(--text-md-line-height);
      font-weight: var(--font-weight-regular);
      text-transform: initial;
      white-space: normal;
    }
  }

  &__actions {
    display: flex;
    column-gap: var(--space-4);
  }

  &__actions-button {
    padding: var(--space-3) var(--space-4);
    font-size: var(--text-sm-font-size);
    line-height: var(--text-sm-line-height);
  }
}
</style>

<style lang="scss">
.add-set {
  .modal__content {
    flex-grow: 1;

    @include mq("tablet") {
      max-width: 56.125rem;
      margin: var(--space-2);
    }
  }

  .content {
    margin: 2.125rem 2.25rem 2.75rem;
  }

  .header {
    align-items: start;
  }

  .content__title {
    font-size: var(--display-md-font-size);
    line-height: var(--display-md-line-height);
  }
}
</style>
