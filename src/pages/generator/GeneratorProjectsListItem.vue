<script setup lang="ts">
import GeneratorProjectsStatistics from "~/pages/generator/statistics/index.vue"
import Plus from "~/assets/icons/icon-plus-xl.svg?component"
import Edit from "~/assets/icons/icon-edit.svg?component"
import type { IGeneratorProjectDto } from "~/types/stores/GeneratorStore"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"

const router = useRouter()
const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

const props = defineProps<{
  project: IGeneratorProjectDto
  canEdit: boolean
  showDeleteProjectDialog: Function
  closeContextMenu: ($event?: undefined) => void
  toggleContextMenu: Function
  editGenerator: Function
  showContextMenu: string
  openAddSetModal: (project: IGeneratorProjectDto) => void
}>()

const getSubtitle = ({
  settings: { longURLBase, shortURLDomain },
}: IGeneratorProjectDto) => {
  let shortUrl = shortURLDomain
  if (!shortUrl) shortUrl = generatorStore.getGlobalShortUrl
  if (longURLBase) return `${longURLBase} | ${shortUrl}`
}

onBeforeMount(async () => {
  if (!generatorStore.isGeneratorSettingsFetched) {
    generatorStore.getGeneratorSettings({
      customerId: sessionStore.getSelectedCustomerId as string,
    })
  }
})
</script>

<template>
  <LcTableCard
    :title="project.name"
    :subtitle="getSubtitle(project)"
    data-cy="project-list-item"
  >
    <template #header>
      <div
        v-if="canEdit"
        class="generator-overview-table-header-actions"
        data-cy="project-actions"
      >
        <LcButton
          class="generate-btn-desktop"
          size="md"
          :icon="Plus"
          @click="openAddSetModal(project)"
        >
          {{ $t("generator.add_set") }}
        </LcButton>
        <LcButton
          class="generate-btn"
          :icon="Plus"
          icon-only
          @click="openAddSetModal(project)"
        />
        <LcButton
          class="edit-btn"
          variant="link"
          data-cy="project-actions-edit"
          :icon="Edit"
          @click="editGenerator(project.id)"
        />
        <LcContextMenu
          :show-menu="showContextMenu === project.id.toString()"
          data-cy="project-actions-menu"
          @toggle="toggleContextMenu(project)"
          @close="closeContextMenu"
        >
          <li @click="showDeleteProjectDialog(project.id)">
            {{ $t("generator.delete_id_project") }}
          </li>
          <li class="edit-action" @click="editGenerator(project.id)">
            {{ $t("generator.edit_id_project") }}
          </li>
        </LcContextMenu>
      </div>
    </template>
    <template #info>
      <generator-projects-statistics
        :project-id="String(project.id)"
        :initial-value="project.statistics"
      />
    </template>
    <template #table>
      <slot name="table" />
    </template>
    <template #pagination>
      <slot name="pagination" />
    </template>
  </LcTableCard>
</template>
