<script lang="ts" setup>
import SuccessIcon from "~/assets/icons/icon-circle-check.svg?component"
import DownloadIcon from "~/assets/icons/icon-download.svg?component"
import LcButton from "~/components/base/LcButton.vue"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"
import { useDownloadExport } from "~/composables/useDownloadExport"

const route = useRoute()
const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

const { downloadSingleQr } = useDownloadExport()

const handleDownload = () => {
  downloadSingleQr({
    customerId: sessionStore.getSelectedCustomerId as string,
    singleQrId: route.params.singleQrId as string,
  })
}

onBeforeMount(() => {
  if (!generatorStore.isSingleQrFetched) {
    generatorStore.getSingleQrTag({
      customerId: sessionStore.getSelectedCustomerId as string,
      singleQrId: route.params.singleQrId as string,
    })
  }
})
</script>
<template>
  <LcWholePageOverlay
    :icon="SuccessIcon"
    success
    :page-title="$t('generator.qr_code_has_been_generated')"
    close-route-path="/app/generator"
    :project-name="generatorStore.getSingleProject?.name"
  >
    <div class="generator-single-qr__success">
      <img :src="generatorStore.getSingleQr?.svg?.downloadUrl" />
      <LcButton :icon="DownloadIcon" @click="handleDownload">
        {{ $t("generator.download_as_svg") }}
      </LcButton>
    </div>
  </LcWholePageOverlay>
</template>
<style lang="scss" scoped>
.generator-single-qr__success {
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-bottom: var(--space-10);
  }
}
</style>
