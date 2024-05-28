<script lang="ts" setup>
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"
import type { IGeneratorProjectSetDto } from "~/types/stores/GeneratorStore"
import { IMAGE_FORMATS, STRING_FORMATS } from "~/types/stores/GeneratorStore"
import { machineDate } from "~/helpers/date"
import { track } from "~/modules/tracking"

const router = useRouter()
const route = useRoute()

const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

// TODO: implement default value for AmountForm
const amount = ref<string>("")

const startQrGeneration = (
  customerId: string,
  projectId: string,
  amount: number,
  batch: number,
) => {
  generatorStore.createSet({
    customerId,
    projectId,
    amount,
    options: { urls: true, qrs: true },
    exports: {
      ids: {
        formats: [STRING_FORMATS.TXT, STRING_FORMATS.CSV],
        maxCount: batch,
      },
      urls: {
        formats: [STRING_FORMATS.TXT, STRING_FORMATS.CSV],
        maxCount: batch,
      },
      qrs: {
        formats: [IMAGE_FORMATS.SVG, IMAGE_FORMATS.PNG],
        maxCount: batch,
      },
    },
    callback: (responseData: IGeneratorProjectSetDto) => {
      track("Set generated", {
        customerId: sessionStore.getSelectedCustomerId as string,
        projectId: route.params.projectId as string,
        date: machineDate(new Date()),
        type: "QR",
      })
      router.push(
        `/app/generator/${route.params.projectId}/${responseData.id}/qr/export`,
      )
    },
  })
}

onBeforeMount(async () => {
  const setId = route.query?.setId
  if (!setId) {
    return
  }

  if (generatorStore.getSingleSet?.id !== setId) {
    await generatorStore.getSet({
      customerId: sessionStore.getSelectedCustomerId as string,
      projectId: route.params.projectId as string,
      setId: setId as string,
    })
  }
})
</script>
<template>
  <LcLoader
    v-if="
      !generatorStore.isProjectsAndSingleQrTagsFetched &&
      generatorStore.isProjectLoading
    "
    size="lg"
  />
  <LcGeneratorAmountForm
    v-else
    :id-parts="generatorStore.getSingleProjectSettings"
    :short-url="
      generatorStore.getSingleProject?.settings?.shortURLDomain ||
      generatorStore.getGlobalShortUrl
    "
    :submit-text="$t('generator.generate_qr_codes')"
    @submit="startQrGeneration"
    @cancel="() => router.push('/app/generator')"
  />
</template>
