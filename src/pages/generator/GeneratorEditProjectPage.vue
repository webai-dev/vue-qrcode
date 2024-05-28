<script lang="ts" setup>
import IconEdit from "~/assets/icons/icon-edit-square.svg?component"
import { useGeneratorStore } from "~/stores/generator"
import LcFormItem from "~/components/base/LcFormItem.vue"
import LcInput from "~/components/base/LcInput.vue"
import GeneratorShortUrl from "~/pages/generator/urls/GeneratorShortUrl.vue"
import { useSessionStore } from "~/stores/session"
import LcLoader from "~/components/base/LcLoader.vue"

const router = useRouter()
const route = useRoute()
const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

const projectName = ref("")
const longUrl = ref("")

const save = () => {
  if (generatorStore.getSingleProject?.name !== projectName.value) {
    const payload: { name?: string; settings?: { longURLBase: string } } = {
      ...(projectName.value !== "" ? { name: projectName.value } : {}),
      ...(longUrl.value !== ""
        ? { settings: { longURLBase: longUrl.value } }
        : {}),
    }

    generatorStore.updateProject({
      customerId: sessionStore.getSelectedCustomerId as string,
      projectId: route.params.projectId as string,
      payload,
      callback: () => {
        router.push("/app/generator")
      },
    })
  }
}

const updateLongUrl = (newLongUrl: string) => {
  longUrl.value = newLongUrl
}

onBeforeMount(() => {
  if (
    !generatorStore.isProjectFetched ||
    generatorStore.getProjectId !== route.params.projectId
  ) {
    generatorStore.getProject({
      customerId: sessionStore.getSelectedCustomerId as string,
      projectId: route.params.projectId as string,
      callback() {
        projectName.value = generatorStore.getSingleProject?.name
      },
    })
  } else {
    projectName.value = generatorStore.getSingleProject?.name
  }
  generatorStore.getUrlSuggestions({
    customerId: sessionStore.getSelectedCustomerId as string,
  })
})
</script>
<template>
  <LcWholePageOverlay
    :icon="IconEdit"
    :page-title="$t('generator.edit_project')"
    close-route-path="/app/generator"
    :project-name="generatorStore.getSingleProject?.name"
  >
    <LcLoader v-if="generatorStore.isProjectLoading" size="lg" />
    <div v-else class="edit-project-page">
      <div class="edit-project-page-section">
        <div class="lc-subtitle">{{ $t("common.general") }}</div>
        <LcFormItem
          v-slot="{ field, meta }"
          name="name"
          :label="$t('common.project_name')"
          :default-value="generatorStore.getSingleProject?.name"
        >
          <LcInput v-model="projectName" v-bind="field" :meta="meta" />
        </LcFormItem>
      </div>
      <div class="edit-project-page-section">
        <div class="lc-subtitle">{{ $t("generator.url_settings") }}</div>
        <GeneratorShortUrl :auto-save="false" :update-url="updateLongUrl" />
      </div>

      <div class="edit-project-page-actions">
        <LcButton variant="link" @click="router.push('/app/generator')">
          {{ $t("common.cancel") }}
        </LcButton>
        <LcButton
          :disabled="projectName === '' && longUrl === ''"
          @click="save"
        >
          {{ $t("common.save") }}
        </LcButton>
      </div>
    </div>
  </LcWholePageOverlay>
</template>
<style lang="scss">
.edit-project-page {
  &-section {
    margin-bottom: var(--space-12);

    .lc-subtitle {
      margin-bottom: var(--space-4);
    }
  }

  &-actions {
    display: flex;
    justify-content: center;
    padding-bottom: var(--space-10);

    .btn {
      margin: 0 var(--space-2);
    }
  }
}
</style>
