<script lang="ts" setup>
import { Form } from "vee-validate"
import { rules } from "~/modules/validationRules"
import { useGeneratorStore } from "~/stores/generator"
import LcFormItem from "~/components/base/LcFormItem.vue"
import LcInput from "~/components/base/LcInput.vue"
import type { IGeneratorProjectSetDto } from "~/types/stores/GeneratorStore"
import { STRING_FORMATS } from "~/types/stores/GeneratorStore"
import { useSessionStore } from "~/stores/session"
import { machineDate } from "~/helpers/date"
import { track } from "~/modules/tracking"

const router = useRouter()
const route = useRoute()

const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

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

const startUrlGeneration = (
  customerId: string,
  projectId: string,
  amount: number,
  batch: number,
) => {
  generatorStore.createSet({
    customerId,
    projectId,
    amount,
    options: { urls: true },
    exports: {
      urls: {
        formats: [STRING_FORMATS.TXT, STRING_FORMATS.CSV],
        maxCount: batch,
      },
    },
    callback: (responseData: IGeneratorProjectSetDto) => {
      track("Set generated", {
        customerId: sessionStore.getSelectedCustomerId as string,
        projectId: route.params.projectId as string,
        date: machineDate(new Date()),
        type: "URL",
      })
      router.push(
        `/app/generator/${route.params.projectId}/${responseData.id}/url/export`,
      )
    },
  })
}

rules()
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
    :submit-text="$t('generator.generate_links')"
    @submit="startUrlGeneration"
    @cancel="() => router.push('/app/generator')"
  />
</template>
<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;

  .field--wrapper {
    min-width: 400px;
  }
}

.generator-url-amount-btns {
  padding: var(--space-4);
  display: flex;
  justify-content: center;

  .btn {
    margin: 0 var(--space-1);
  }
}
</style>
