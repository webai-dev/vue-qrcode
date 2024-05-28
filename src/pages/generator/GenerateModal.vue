<script lang="ts" setup>
import { computed } from "vue"
import SuccessIcon from "~/assets/icons/icon-circle-check.svg?component"
import LinkIcon from "~/assets/icons/icon-link.svg?component"
import QrIcon from "~/assets/icons/icon-qr.svg?component"
import DownloadIcon from "~/assets/icons/icon-download.svg?component"
import { useDownloadExport } from "~/composables/useDownloadExport"
import { IMAGE_FORMATS, STRING_FORMATS } from "~/types/stores/GeneratorStore"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"

const { t } = useI18n()

type GenerateModalProps = {
  showGenerateModal: boolean
  projectId: string
  setId: string
  generateType: string
  toggleShowGenerateModal: () => void
}
const props = withDefaults(defineProps<GenerateModalProps>(), {
  showGenerateModal: false,
})

const { success, processing, error, startPolling, downloadSet } =
  useDownloadExport(props.projectId, props.setId)

const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

const generateModalTitle = computed(() => {
  const type = props.generateType === "url" ? "links" : "QR codes"

  if (success?.value) {
    return t("generator.{type} have been generated", { type })
  } else if (processing?.value) {
    return t("generator.your {type} are being generated", { type })
  }
  return t("generate {type} for this set", { type })
})

const generateModalDescription = computed(() => {
  if (success?.value || processing?.value) return ""
  return t("generator.this_might_take_a_moment")
})

const startGenerating = () => {
  const qrs =
    props.generateType === "qr"
      ? { formats: [IMAGE_FORMATS.SVG, IMAGE_FORMATS.PNG] }
      : undefined
  generatorStore.updateSet({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId: props.projectId,
    setId: props.setId,
    payload: {
      options: { urls: true, qrs: props.generateType === "qr" },
      exports: {
        urls: { formats: [STRING_FORMATS.TXT, STRING_FORMATS.CSV] },
        qrs,
      },
    },
    callback: () => {
      startPolling()
    },
  })
}

const download = () => {
  downloadSet({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId: props.projectId,
    setId: props.setId,
  })
  props.toggleShowGenerateModal()
}
</script>
<template>
  <LcModal
    :show="props.showGenerateModal"
    :icon="
      success ? SuccessIcon : props.generateType === 'url' ? LinkIcon : QrIcon
    "
    :title="generateModalTitle"
    :description="generateModalDescription"
    :success="success"
    @close="props.toggleShowGenerateModal"
  >
    <div v-if="success" class="generator-modal-generate-actions">
      <LcButton variant="link" @click="props.toggleShowGenerateModal">
        {{ $t("common.close") }}
      </LcButton>
      <LcButton :icon="DownloadIcon" @click="download">{{
        $t("common.download")
      }}</LcButton>
    </div>
    <div v-else-if="processing" class="generator-modal-generate-loader">
      <LcLoader size="lg" />
    </div>
    <div v-else class="generator-modal-generate-actions">
      <LcButton variant="link" @click="props.toggleShowGenerateModal">
        {{ $t("common.cancel") }}
      </LcButton>
      <LcButton @click="startGenerating">
        {{
          $t("generator.generate {type}", {
            type: "url" === "url" ? "links" : "QR codes",
          })
        }}
      </LcButton>
    </div>
  </LcModal>
</template>
<style lang="scss">
.generator-modal {
  &-generate {
    &-loader {
      display: flex;
      justify-content: center;
      padding-bottom: var(--space-10);
    }

    &-actions {
      display: flex;
      justify-content: center;
      margin-top: var(--space-2);

      .btn {
        margin: 0 var(--space-2);
      }
    }
  }
}
</style>
