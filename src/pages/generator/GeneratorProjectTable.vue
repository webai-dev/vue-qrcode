<script lang="ts" setup>
import { computed, ref } from "vue"
import type { TableColumn } from "~/components/base/LcTable.vue"
import Plus from "~/assets/icons/icon-plus-xl.svg?component"
import DeleteIcon from "~/assets/icons/icon-delete.svg?component"
import { humanDate } from "~/helpers/date"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"
import type {
  IGeneratorFileDto,
  IGeneratorProjectDto,
  IGeneratorProjectSetDto,
  IMAGE_FORMATS as IMAGE_FORMATS_TYPE,
  STRING_FORMATS as STRING_FORMATS_TYPE,
} from "~/types/stores/GeneratorStore"
import {
  SET_EXPORT_STATUS,
  IMAGE_FORMATS,
  STRING_FORMATS,
} from "~/types/stores/GeneratorStore"
import { Role } from "~/constants/permissions"
import { useNotificationsStore } from "~/stores/notifications.store"

const { t } = useI18n()

const columns = ref<TableColumn[]>([
  {
    key: "name",
    title: t("generator.project_table.start_and_end_value"),
    customHeaderClass: "generators-table-col__lg",
    customCellClass: "wrap-mobile generator-start-value",
  },
  {
    key: "amount",
    title: t("common.amount"),
    customCellClass: "wrap-mobile generator-amount",
  },
  {
    key: "createdAt",
    title: t("common.created"),
    customCellClass: "wrap-mobile generator-created",
  },
  {
    key: "ids",
    title: t("common.ids"),
    customCellClass: "wrap-mobile generator-ids",
  },
  {
    key: "urls",
    title: t("common.links"),
    customCellClass: "wrap-mobile lc-no-ellipsis generator-urls",
  },
  {
    key: "qrs",
    title: t("common.qr_codes"),
    customCellClass: "wrap-mobile lc-no-ellipsis generator-qrs",
  },
  {
    key: "actions",
    title: "",
    customHeaderClass: "generators-table-col__xs",
    customCellClass: "lc-no-ellipsis",
  },
])

type GeneratorProjectTableProps = {
  project: IGeneratorProjectDto
  currentProject: IGeneratorProjectDto
  currentSet: IGeneratorProjectSetDto
  setCurrentProject: (project: IGeneratorProjectDto) => void
  setCurrentSet: (set: IGeneratorProjectSetDto) => void
  updateSetUrl: (
    reset?: boolean,
    currProjectId?: string,
    currSetId?: string,
  ) => void
  showDeleteSetDialog: (projectId: string, setId: string) => void
  toggleEditSetUrlModal: (
    project: IGeneratorProjectDto,
    set: IGeneratorProjectSetDto,
  ) => void
  setGenerateType: (type: string) => void
  toggleShowGenerateModal: () => void
}
const props = defineProps<GeneratorProjectTableProps>()

const notificationsStore = useNotificationsStore()

// Store data
const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

// refs
const router = useRouter()
const showSetContextMenu = ref("")

// computed
const canEdit = computed(
  () =>
    sessionStore.getCurrentRole !== Role.UserView &&
    sessionStore.getCurrentRole !== Role.Developer,
)

// methods
const generateUrlsForExistingSet = (
  project: IGeneratorProjectDto,
  set: IGeneratorProjectSetDto,
) => {
  if (project?.settings?.longURLBase) {
    props.setGenerateType("url")
    props.setCurrentProject(project)
    props.setCurrentSet(set)
    props.toggleShowGenerateModal()
  } else {
    router.push({
      name: "app.generator.create.urls.index",
      params: { projectId: project?.id },
      query: { setId: set.id },
    })
  }
}

const generateQrsForExistingSet = (
  project: IGeneratorProjectDto,
  set: IGeneratorProjectSetDto,
) => {
  if (project?.settings?.longURLBase) {
    props.setGenerateType("qr")
    props.setCurrentProject(project)
    props.setCurrentSet(set)
    props.toggleShowGenerateModal()
  } else {
    router.push(
      `/app/generator/create/${project.id}/qrs/multiple?step=0&setId=${set.id}`,
    )
  }
}

const downloadFromSet = (
  set: IGeneratorProjectSetDto,
  type: string,
  format?: STRING_FORMATS_TYPE | IMAGE_FORMATS_TYPE,
) => {
  const download = set.exports[type as "ids" | "urls" | "qrs"].files.find(
    (file: IGeneratorFileDto) =>
      file.name.toUpperCase().includes(String(format)),
  )
  if (download) {
    try {
      const link = document.createElement("a")
      link.download = download.name
      link.href = `data:${download.downloadUrl}`
      link.click()
    } catch (err: any) {
      notificationsStore.setError(
        t("common.download_failed"),
        t("common.error"),
      )
    }
  }
}

const toggleSetContextMenu = (set: IGeneratorProjectSetDto) => {
  if (showSetContextMenu.value === "") showSetContextMenu.value = set.id
  else showSetContextMenu.value = ""
}

const closeSetContextMenu = () => (showSetContextMenu.value = "")
</script>
<template>
  <LcTable
    v-if="
      generatorStore.getAllSets[props.project.id]?.data.length ||
      props.project.setsPreview.data.length
    "
    :columns="columns"
    identifier="id"
    :data="
      generatorStore.getAllSets[props.project.id]?.data ||
      props.project.setsPreview.data
    "
  >
    <template #name="{ item }">
      <template
        v-if="
          !item?.preview?.lastId && item.status === SET_EXPORT_STATUS.PROCESSING
        "
      >
        <div class="export-placeholder">
          {{ $t("generator.project_table.export_in_progress") }}
        </div>
      </template>
      <template v-else>
        <div>{{ item?.preview?.firstId }}</div>
        <div>{{ item?.preview?.lastId }}</div>
      </template>
      <div
        v-if="item?.overrides?.longURLBase"
        class="generator-overview-override-link"
        @click="props.updateSetUrl(true, props.project.id, item.id)"
      >
        <DeleteIcon />
        <span>{{ item?.overrides?.longURLBase }}</span>
      </div>
    </template>
    <template #amount="{ item }">
      {{ item.amount }}
    </template>
    <template #createdAt="{ item }">
      {{ humanDate(item.createdAt) }}
    </template>
    <template #ids="{ item }">
      <div
        v-if="
          !item.options.urls &&
          !item.options.qrs &&
          item.status === SET_EXPORT_STATUS.PROCESSING
        "
        :class="['generator-overview-download-loader', 'hide-mobile']"
      >
        <LcLoader size="xs" />
      </div>
      <div v-else class="hide-mobile">
        <span
          class="generator-overview-download-link"
          @click="downloadFromSet(item, 'ids', STRING_FORMATS.TXT)"
        >
          TXT
        </span>
        <span
          class="generator-overview-download-link"
          @click="downloadFromSet(item, 'ids', STRING_FORMATS.CSV)"
        >
          CSV
        </span>
      </div>
    </template>
    <template #urls="{ item }">
      <div
        v-if="item.options.urls && item.status === SET_EXPORT_STATUS.PROCESSING"
        :class="[
          'generator-overview-download-loader',
          { 'hide-mobile': item.options.urls },
        ]"
      >
        <LcLoader size="xs" />
      </div>
      <div
        v-else-if="
          item.options.urls && item.status === SET_EXPORT_STATUS.COMPLETE
        "
        :class="{ 'hide-mobile': item.options.urls }"
      >
        <span
          class="generator-overview-download-link"
          @click="downloadFromSet(item, 'urls', STRING_FORMATS.TXT)"
        >
          {{ $t("common.txt") }}
        </span>
        <span
          class="generator-overview-download-link"
          @click="downloadFromSet(item, 'urls', STRING_FORMATS.CSV)"
        >
          {{ $t("common.csv") }}
        </span>
      </div>
      <LcButton
        v-else-if="canEdit"
        :icon="Plus"
        class="hide-mobile"
        variant="secondary"
        icon-only
        @click="generateUrlsForExistingSet(props.project, item)"
      />
      <LcButton
        v-if="!item.options.qrs && canEdit"
        class="show-mobile"
        :icon="Plus"
        variant="secondary"
        size="sm"
        @click="generateUrlsForExistingSet(props.project, item)"
      >
        {{ $t("common.links") }}
      </LcButton>
    </template>
    <template #qrs="{ item }">
      <div
        v-if="item.options.qrs && item.status === SET_EXPORT_STATUS.PROCESSING"
        :class="[
          'generator-overview-download-loader',
          { 'hide-mobile': item.options.urls },
        ]"
      >
        <LcLoader size="xs" />
      </div>
      <div
        v-else-if="
          item.options.qrs && item.status === SET_EXPORT_STATUS.COMPLETE
        "
        :class="{ 'hide-mobile': item.options.qrs }"
      >
        <span
          class="generator-overview-download-link"
          @click="downloadFromSet(item, 'qrs', IMAGE_FORMATS.SVG)"
        >
          {{ $t("common.svg") }}
        </span>
      </div>
      <LcButton
        v-else-if="canEdit"
        :icon="Plus"
        class="hide-mobile"
        variant="secondary"
        icon-only
        @click="generateQrsForExistingSet(props.project, item)"
      />
      <LcButton
        v-if="!item.options.qrs && canEdit"
        class="show-mobile"
        :icon="Plus"
        variant="secondary"
        size="sm"
        @click="generateQrsForExistingSet(props.project, item)"
      >
        {{ $t("common.qr_codes") }}
      </LcButton>
    </template>
    <template #actions="{ item }">
      <LcContextMenu
        :class="{ 'only-mobile-edit': !canEdit }"
        :show-menu="showSetContextMenu === item.id"
        data-cy="project-actions-menu"
        @toggle="toggleSetContextMenu(item)"
        @close="closeSetContextMenu"
      >
        <li
          v-if="canEdit"
          @click="props.toggleEditSetUrlModal(props.project, item)"
        >
          {{ $t("generator.project_table.edit_url_settings") }}
        </li>
        <li v-if="canEdit" class="lc-divider hide-mobile" />
        <li
          v-if="canEdit"
          @click="props.showDeleteSetDialog(props.project.id, item.id)"
        >
          {{ $t("generator.project_table.delete_set") }}
        </li>
        <li v-if="canEdit" class="lc-divider" />
        <li @click="downloadFromSet(item, 'ids', STRING_FORMATS.TXT)">
          {{ $t("generator.project_table.download_ids_as_TXT") }}
        </li>
        <li @click="downloadFromSet(item, 'ids', STRING_FORMATS.CSV)">
          {{ $t("generator.project_table.download_ids_as_CSV") }}
        </li>
        <li v-if="item.options.urls" class="lc-divider" />
        <li
          v-if="item.options.urls"
          @click="downloadFromSet(item, 'urls', STRING_FORMATS.TXT)"
        >
          {{ $t("generator.project_table.download_urls_as_TXT") }}
        </li>
        <li
          v-if="item.options.urls"
          @click="downloadFromSet(item, 'urls', STRING_FORMATS.CSV)"
        >
          {{ $t("generator.project_table.download_urls_as_CSV") }}
        </li>
        <li v-if="item.options.qrs" class="lc-divider" />
        <li
          v-if="item.options.qrs"
          @click="downloadFromSet(item, 'qrs', IMAGE_FORMATS.SVG)"
        >
          {{ $t("generator.project_table.download_qr_codes_as_SVG") }}
        </li>
      </LcContextMenu>
    </template>
  </LcTable>
</template>
<style lang="scss"></style>
