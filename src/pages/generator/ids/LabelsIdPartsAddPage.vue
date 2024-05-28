<script setup lang="ts">
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { Form } from "vee-validate"
import { useIdPartsStore } from "~/stores/id-parts.store"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"
import ArrowLeftIcon from "~/assets/icons/icon-arrow-left.svg?component"
import { defaultIdPartsItems } from "~/constants/generators"
import LcIdPartsFormExportItems from "~/components/shared/generators/ids/LcIdPartsFormExportItems.vue"
import type { IIdPartSettingsDto } from "~/types/stores/GeneratorStore"

const router = useRouter()
const sessionStore = useSessionStore()
const generatorStore = useGeneratorStore()
const idPartsStore = useIdPartsStore()
const { t } = useI18n()

const parts = storeToRefs(idPartsStore).getParts
// ref<Partial<IIdPartSettingsDto>[]>([])
const amount = ref("100000")
const perExport = ref("100000")
const projectName = ref(t("generator.default_project_name"))

const initialValues = {
  amount: "100000",
  "per-exported": "100000",
  "project-name": t("generator.default_project_name"),
}

// **** METHODS **** //
const handleCreate = async () => {
  if (projectName.value) {
    const customerId = sessionStore.getSelectedCustomerId!
    await generatorStore.createProject({ customerId, name: projectName.value })
    await idPartsStore.saveIdParts(generatorStore.getProjectId!)
    await router.push("/app/labels/in-process")
  }
}

const handleAmountChanged = (value: string) => {
  amount.value = value
}
const handlePerExportChanged = (value: string) => {
  perExport.value = value
}
const handleProjectNameChanged = (value: string) => {
  projectName.value = value
}

const handleCancel = () => {
  router.push("/app/generator")
}

onBeforeMount(() => {
  idPartsStore.emptyParts()
  if (!parts.value.length) {
    parts.value.push(defaultIdPartsItems.RANDOM)
  }
})
</script>

<template>
  <LcButton variant="link" :icon="ArrowLeftIcon" @click="router.back()">
    Back
  </LcButton>
  <div class="title-container">
    <LcPageTitle :title="$t('generator.create_serial_number_title')" />
  </div>
  <Form :initial-values="initialValues" @submit="handleCreate">
    <LcIdPartsFormItems :id-parts="parts as IIdPartSettingsDto[]" />
    <LcLabelsSettingsPreview>
      <LcLabelsPreviewItems :id-parts="parts as IIdPartSettingsDto[]" />
    </LcLabelsSettingsPreview>
    <div class="title-container">
      <LcPageTitle title="Export" />
    </div>
    <LcIdPartsFormExportItems
      :amount-label="$t('generator.overview.total_amount_of_links')"
      :amount="amount as string"
      :per-exported="perExport as string"
      :project-name="projectName as string"
      @update:amount="handleAmountChanged"
      @update:per-exported="handlePerExportChanged"
      @update:project-name="handleProjectNameChanged"
    />
    <div class="btn-container">
      <LcButton class="cancel-btn" variant="link" @click="handleCancel"
        >Cancel
      </LcButton>
      <LcButton type="submit">Create</LcButton>
    </div>
  </Form>
</template>

<style scoped lang="scss">
.title-container {
  padding-left: 0.5rem;

  & .custom-title {
    padding: 0;
  }
}

.btn-container {
  padding-bottom: 0.5rem;

  @include mq("mobile") {
    padding-bottom: 2rem;
  }
}

.btn {
  justify-content: left;
  width: fit-content;

  & .button-icon {
    width: 0.75rem;
    height: 0.75rem;
  }
}
</style>
