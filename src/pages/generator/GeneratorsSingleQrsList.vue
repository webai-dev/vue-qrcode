<script setup lang="ts">
import { Form } from "vee-validate"
import { storeToRefs } from "pinia"
import type { ToRefs, Ref } from "vue"
import { computed, ref } from "vue"
import { rules } from "~/modules/validationRules"
import EyeIcon from "~/assets/icons/icon-eye.svg?component"
import Plus from "~/assets/icons/icon-plus-xl.svg?component"
import DeleteIcon from "~/assets/icons/icon-delete.svg?component"
import EditIcon from "~/assets/icons/icon-edit.svg?component"
import SwitchIcon from "~/assets/icons/icon-switch.svg?component"
import ArrowRightIcon from "~/assets/icons/icon-arrow-right.svg?component"
import Warning from "~/assets/icons/icon-warning.svg?component"
import DownloadIcon from "~/assets/icons/icon-download.svg?component"
import QrIcon from "~/assets/icons/icon-qr.svg?component"
import { useSessionStore } from "~/stores/session"
import { useGeneratorStore } from "~/stores/generator"
import LcButton from "~/components/base/LcButton.vue"
import type { TableColumn } from "~/components/base/LcTable.vue"
import type { IGeneratorSingleQrDto } from "~/types/stores/GeneratorStore"
import { useNotificationsStore } from "~/stores/notifications.store"
import LcFormItem from "~/components/base/LcFormItem.vue"
import LcInput from "~/components/base/LcInput.vue"
import { humanDate } from "~/helpers/date"

const { t } = useI18n()

// props
const props = defineProps<{
  canEdit: boolean
}>()

// table config
const columns = ref<TableColumn[]>([
  {
    key: "url",
    title: t("common.url"),
    customHeaderClass: "generators-table-col__xl",
    customCellClass: "wrap-mobile lc-no-ellipsis generator-urls",
  },
  {
    key: "shortUrl",
    title: t("generator.short_url"),
    customCellClass: "wrap-mobile lc-no-ellipsis",
  },
  {
    key: "createdAt",
    title: t("common.created"),
    customCellClass: "wrap-mobile",
  },
  {
    key: "qr",
    title: t("common.qr_tag"),
    customCellClass: "wrap-mobile lc-no-ellipsis",
  },
  {
    key: "preview",
    title: t("common.preview"),
    customCellClass: "wrap-mobile generators-preview",
  },
  {
    key: "actions",
    title: "",
    customHeaderClass: "generators-table-col__xs hide-mobile",
    customCellClass: "lc-no-ellipsis",
  },
])

// Variables
const router = useRouter()
const notificationsStore = useNotificationsStore()

const currentSingleQr = ref<null | IGeneratorSingleQrDto>(null)
const newLongUrl = ref("")

// modals
const toggleDialog = (ref: Ref) => (item?: Partial<IGeneratorSingleQrDto>) => {
  if (!ref.value) ref.value = item
  else ref.value = null
}

const showItemContextMenu = ref<null | IGeneratorSingleQrDto>(null)
const toggleItemContextMenu = toggleDialog(showItemContextMenu)

const singleQrTagToDelete = ref<null | IGeneratorSingleQrDto>(null)
const toggleDeleteSingleQrTagDialog = toggleDialog(singleQrTagToDelete)

const singleQrTagToPreview = ref<null | IGeneratorSingleQrDto>(null)
const toggleSingleQrTagPreviewDialog = toggleDialog(singleQrTagToPreview)

const showContextMenu = ref(false)
const toggleContextMenu = () => (showContextMenu.value = !showContextMenu.value)

const showDeleteAllSingleQrTagsDialog = ref(false)
const toggleDeleteAllSingleQrTagsDialog = () =>
  (showDeleteAllSingleQrTagsDialog.value =
    !showDeleteAllSingleQrTagsDialog.value)

const showEditLongUrlModal = ref<boolean>(false)
const toggleShowEditLongUrlModal = (singleQr?: IGeneratorSingleQrDto) => {
  if (currentSingleQr.value) currentSingleQr.value = null
  else currentSingleQr.value = singleQr as IGeneratorSingleQrDto
  showEditLongUrlModal.value = !showEditLongUrlModal.value
}

// Store data
const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

const { singleQrTags }: ToRefs<any> = storeToRefs(generatorStore)

const fetchSingleQrTagsList = (page = 1) =>
  generatorStore.getSingleQrTagsList({
    customerId: sessionStore.getSelectedCustomerId as string,
    page,
  })

// pagination
const page = computed(() => singleQrTags.value.page)
const perPage = computed(() => singleQrTags.value.perPage)
const lastPage = computed(() => singleQrTags.value.lastPage)
const total = computed(() => singleQrTags.value.totalCount)

const onPageChange = (nextPage: number) => fetchSingleQrTagsList(nextPage)

// methods
const createSingleQrTag = () => {
  router.push({
    name: "app.generator.create.qrs.single",
  })
}

const deleteAllSingleQrTags = () => {
  generatorStore.deleteAllSingleQRTags({
    customerId: sessionStore.getSelectedCustomerId as string,
    callback: () => {
      showDeleteAllSingleQrTagsDialog.value = false
    },
  })
}

const deleteSingleQrTag = () => {
  if (!singleQrTagToDelete?.value?.id) return

  generatorStore.deleteSingleQrTag({
    customerId: sessionStore.getSelectedCustomerId as string,
    singleQrId: singleQrTagToDelete.value.id,
    callback: () => (singleQrTagToDelete.value = null),
  })
}

const downloadSingleQrSvg = (singleQrTag: IGeneratorSingleQrDto) => {
  const download = singleQrTag?.svg
  if (!download) return

  try {
    const link = document.createElement("a")
    link.download = download.name
    link.href = `data:${download.downloadUrl}`
    link.click()
  } catch (err: any) {
    notificationsStore.setError(t("common.download_failed"), t("common.error"))
  }
}

const updateSingleQrTag = () => {
  generatorStore.updateSingleQrTag({
    customerId: sessionStore.getSelectedCustomerId as string,
    singleQrId: currentSingleQr.value?.id as string,
    payload: {
      longURL: newLongUrl.value,
    },
    callback: () => {
      toggleShowEditLongUrlModal()
    },
  })
}

rules()
</script>

<template>
  <LcTableCard
    :title="$t('generator.single_qrs_list.single_qr_codes')"
    paginated
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
          @click="createSingleQrTag()"
        >
          {{ $t("generator.single_qrs_list_generate_new_single_qr_code") }}
        </LcButton>
        <LcContextMenu
          :show-menu="showContextMenu"
          @toggle="toggleContextMenu"
          @close="toggleContextMenu"
        >
          <li @click="toggleDeleteAllSingleQrTagsDialog">
            {{ $t("generator.single_qrs_list_delete_all_single_qr_codes") }}
          </li>
        </LcContextMenu>
      </div>
    </template>
    <template #table>
      <LcTable
        v-if="generatorStore.getSingleQrsList?.data.length"
        :data="generatorStore.getSingleQrsList?.data || []"
        :columns="columns"
        identifier="id"
        :is-loading="generatorStore.loading.singleQrTags"
        class="generator-single-qrs-table"
      >
        <template #url="{ item }">
          <div class="url">
            <span>{{ item.longURL }}</span>
            <EditIcon
              class="edit-long-url"
              @click="toggleShowEditLongUrlModal(item)"
            />
          </div>
        </template>
        <template #shortUrl="{ item }">
          <div class="url">
            {{ item.shortURL || generatorStore.getGlobalShortUrl }}
          </div>
        </template>
        <template #createdAt="{ item }">
          {{ humanDate(item.createdAt) }}
        </template>
        <template #preview="{ item }">
          <LcButton
            :icon="EyeIcon"
            variant="link"
            icon-only
            @click="toggleSingleQrTagPreviewDialog(item)"
          />
          <LcContextMenu
            class="show-mobile"
            :show-menu="showItemContextMenu?.id === item.id"
            @toggle="toggleItemContextMenu(item)"
            @close="toggleItemContextMenu(item)"
          >
            <li v-if="canEdit" @click="toggleDeleteSingleQrTagDialog(item)">
              {{ $t("generator.single_qrs_list.delete_single_qr_code") }}
            </li>
          </LcContextMenu>
        </template>
        <template #qr="{ item }"
          ><span
            class="generator-overview-download-link hide-mobile"
            @click="downloadSingleQrSvg(item)"
            >{{ $t("common.svg") }}</span
          ></template
        >
        <template #actions="{ item }">
          <LcButton
            class="hide-mobile"
            :icon="DeleteIcon"
            variant="link"
            icon-only
            @click="toggleDeleteSingleQrTagDialog(item)"
          />
        </template>
      </LcTable>
    </template>
    <template #pagination>
      <LcPaginator
        :page="page || 1"
        :total="total || 0"
        :page-size="perPage"
        :total-pages="lastPage || 1"
        @page-change="onPageChange"
      />
    </template>
  </LcTableCard>

  <LcDialog
    :show="Boolean(showDeleteAllSingleQrTagsDialog)"
    :icon="Warning"
    :headline="`${$t('generator.single_qrs_list.delete_all_single_qr_codes')}?`"
    :cancel-label="$t('common.cancel')"
    :confirm-label="$t('generator.single_qrs_list.delete_all_single_qr_codes')"
    destructive
    @close="toggleDeleteAllSingleQrTagsDialog"
    @confirm="deleteAllSingleQrTags"
  >
    <div class="delete-text">
      {{
        $t("generator.single_qrs_list.after_deleting_they_cannot_be_restored")
      }}
    </div>
  </LcDialog>
  <LcDialog
    :show="Boolean(singleQrTagToDelete)"
    :icon="Warning"
    :headline="$t('generator.single_qrs_list.delete_qr_codes')"
    :description="singleQrTagToDelete?.longURL"
    :cancel-label="$t('common.cancel')"
    :confirm-label="$t('generator.single_qrs_list.delete_qr_code')"
    destructive
    @close="() => (singleQrTagToDelete = null)"
    @confirm="deleteSingleQrTag"
  >
    <div class="delete-text">
      {{ $t("generator.single_qrs_list.after_deleting_it_cannot_be_restored") }}
    </div>
  </LcDialog>
  <LcDialog
    :show="Boolean(singleQrTagToPreview)"
    :icon="QrIcon"
    :headline="singleQrTagToPreview?.shortURL || ''"
    :description="singleQrTagToPreview?.longURL"
    :cancel-label="$t('common.close')"
    :confirm-label="$t('generator.download_as_svg')"
    :confirm-button-icon="DownloadIcon"
    @close="() => (singleQrTagToPreview = null)"
    @confirm="
      () => singleQrTagToPreview && downloadSingleQrSvg(singleQrTagToPreview)
    "
  >
    <div class="image-container">
      <img :src="singleQrTagToPreview?.png?.downloadUrl" />
    </div>
  </LcDialog>
  <LcModal
    :show="showEditLongUrlModal"
    :icon="SwitchIcon"
    :title="$t('generator.single_qrs_list.change_your_long_url')"
    :description="$t('generator.overview.short_url_will_remain_same')"
    @close="() => toggleShowEditLongUrlModal()"
  >
    <div class="change-long-url-current">
      {{ currentSingleQr?.shortURL || generatorStore.getGlobalShortUrl }}
      <ArrowRightIcon />
      {{ currentSingleQr?.longURL }}
    </div>
    <LcFormItem
      v-slot="{ field, meta }"
      name="Long URL"
      :label="$t('generator.overview.your_new_long_url')"
      rules="required|url"
    >
      <LcInput v-model="newLongUrl" v-bind="field" :meta="meta" />
    </LcFormItem>
    <div class="change-long-url-actions">
      <LcButton variant="link" @click="() => toggleShowEditLongUrlModal()">
        {{ $t("common.cancel") }}
      </LcButton>
      <LcButton @click="updateSingleQrTag">{{
        $t("generator.overview.save_new_url")
      }}</LcButton>
    </div>
  </LcModal>
</template>

<style scoped lang="scss">
.url {
  word-wrap: break-word;
  display: flex;

  svg {
    margin-left: var(--space-5);
  }
}

.image-container {
  display: flex;
  justify-content: center;
}

.edit-long-url {
  cursor: pointer;
}

.change-long-url {
  &-current {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-6);
    justify-content: center;

    svg {
      margin: 0 var(--space-3);
    }
  }

  &-actions {
    display: flex;
    justify-content: center;
    margin-top: var(--space-8);
  }
}
</style>
<style lang="scss">
@include mqDesktopFirst("tablet") {
  .generator-single-qrs-table {
    .table tr.table__row {
      padding-right: var(--space-20);

      td.generators-preview {
        position: absolute;
        right: var(--space-5);
        bottom: var(--space-2);
        width: var(--space-16);
        display: flex;
        align-items: baseline;
      }
    }
  }
}
</style>
