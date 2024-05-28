<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from "vue-router"
import LcWholePageOverlay from "~/components/base/LcWholePageOverlay.vue"
import CircleCheckIcon from "~/assets/icons/icon-circle-check.svg?component"
import CircleArrowsIcon from "~/assets/icons/icon-circle-arrows.svg?component"
import WarningIcon from "~/assets/icons/icon-warning.svg?component"
import ArrowLeftIcon from "~/assets/icons/icon-arrow-left.svg?component"
import DownloadIcon from "~/assets/icons/icon-download.svg?component"
import { useGeneratorStore } from "~/stores/generator"
import LcLoader from "~/components/base/LcLoader.vue"
import LcButton from "~/components/base/LcButton.vue"
import { useDownloadExport } from "~/composables/useDownloadExport"
import { STRING_FORMATS, IMAGE_FORMATS } from "~/types/stores/GeneratorStore"
import { useSessionStore } from "~/stores/session"
import GeneratorFinalizePageWarning from "~/pages/generator/GeneratorFinalizePageWarning.vue"

const { t } = useI18n()
const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

const router = useRouter()
type routeParams = {
  params: {
    projectId: string
    setId: string
    type: string
  }
}
const route: RouteLocationNormalizedLoaded = useRoute()

const { success, processing, error, startPolling, downloadSet } =
  useDownloadExport(
    route.params.projectId as string,
    route.params.setId as string,
  )

const icon = () => {
  if (processing.value) {
    return CircleArrowsIcon
  } else if (error.value) {
    return WarningIcon
  }
  return CircleCheckIcon
}

// pageTitle
const typeMap: { [type: string]: string } = {
  id: "IDs",
  url: "links",
  qr: "QR codes",
}
const pageTitle = computed(() => {
  if (processing.value)
    return t("generator.your {type} are being generated", {
      type: typeMap[route.params.type as string],
    })
  if (!processing.value && error.value)
    return t("verification_code.something_went_wrong")
  return `${t("common.done")}!`
})

const subTitle = computed(() => {
  if (processing.value) return t("generator.this_might_take_a_moment")
  return t("generator.download {type} anytime", {
    type: typeMap[route.params.type as string],
  })
})

const download = (format?: string, type?: string) => {
  downloadSet({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId: route.params.projectId as string,
    setId: route.params.setId as string,
    format,
    type,
  })
}

onBeforeMount(() => {
  startPolling()
})
</script>
<template>
  <LcWholePageOverlay
    :icon="icon()"
    :error="error"
    :success="success"
    :page-title="pageTitle"
    :subtitle="subTitle"
    close-route-path="/app/generator"
    :on-close="generatorStore.resetProjectCreated"
    :project-name="generatorStore.getSingleProject?.name"
  >
    <template v-if="processing"><LcLoader size="xl" /></template>
    <template v-if="!processing && error">
      <div class="error-btn">
        <LcButton
          :icon="ArrowLeftIcon"
          @click="
            router.push(
              `/app/generator/create/${route.params.projectId}/ids/amount`,
            )
          "
        >
          {{ $t("common.go_back") }}
        </LcButton>
      </div>
    </template>
    <template v-if="!processing && success">
      <div class="success-btn">
        <LcButton
          v-if="route.params.type !== 'qr'"
          :icon="DownloadIcon"
          @click="download(STRING_FORMATS.TXT, `${route.params.type}s`)"
        >
          {{ $t("generator.download_as_txt") }}
        </LcButton>
        <LcButton
          v-if="route.params.type !== 'qr'"
          :icon="DownloadIcon"
          @click="download(STRING_FORMATS.CSV, `${route.params.type}s`)"
        >
          {{ $t("generator.download_as_csv") }}
        </LcButton>
        <!-- TBD: download all -->
        <LcButton
          v-if="route.params.type === 'qr'"
          :icon="DownloadIcon"
          @click="download()"
        >
          {{ $t("generator.download_set_as_zip") }}
        </LcButton>
      </div>
      <div v-if="route.params.type !== 'id'">
        <GeneratorFinalizePageWarning link />
      </div>
    </template>
  </LcWholePageOverlay>
</template>
<style lang="scss">
.error-btn {
  margin-top: var(--space-6);
}
.success-btn {
  display: flex;
  flex-direction: column;
  margin-top: var(--space-6);

  .btn {
    margin-bottom: var(--space-3);
  }
}
</style>
