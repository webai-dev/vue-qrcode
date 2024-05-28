<script setup lang="ts">
import { Form } from "vee-validate"
import { storeToRefs } from "pinia"
import type { ToRefs } from "vue"
import { computed, ref } from "vue"
import { rules } from "~/modules/validationRules"
import Warning from "~/assets/icons/icon-warning.svg?component"
import SwitchIcon from "~/assets/icons/icon-switch.svg?component"
import CircleArrowsIcon from "~/assets/icons/icon-circle-arrows.svg?component"
import ArrowRightIcon from "~/assets/icons/icon-arrow-right.svg?component"
import LoadingPrompt from "~/assets/loader-products-qr.svg"
import { useSessionStore } from "~/stores/session"
import { useGeneratorStore } from "~/stores/generator"
import LcButton from "~/components/base/LcButton.vue"
import type { TableColumn } from "~/components/base/LcTable.vue"
import type {
  IGeneratorProjectDto,
  IGeneratorProjectSetDto,
  IGeneratorSingleQrDto,
} from "~/types/stores/GeneratorStore"
import { STRING_FORMATS } from "~/types/stores/GeneratorStore"
import type { Role } from "~/constants/permissions"
import { generatorEditAllowedRoles } from "~/constants/permissions"
import LcFormItem from "~/components/base/LcFormItem.vue"
import LcInput from "~/components/base/LcInput.vue"
import GenerateModal from "~/pages/generator/GenerateModal.vue"
import GeneratorProjectTable from "~/pages/generator/GeneratorProjectTable.vue"
import GeneratorsSingleQrsList from "~/pages/generator/GeneratorsSingleQrsList.vue"
import { useNotificationsStore } from "~/stores/notifications.store"
import { useCustomerMessagesStore } from "~/stores/customer-messages"
import GeneratorAddSetModal from "~/pages/generator/GeneratorAddSetModal.vue"

import { machineDate } from "~/helpers/date"
import GeneratorProjectsListItem from "~/pages/generator/GeneratorProjectsListItem.vue"
import { track } from "~/modules/tracking"

// Variables
const router = useRouter()
const notificationsStore = useNotificationsStore()
const showContextMenu = ref("")
const showGenerateModal = ref(false)
const generateType = ref("") // url | qr
const currentProject = ref<null | IGeneratorProjectDto>(null)
const currentSet = ref<null | IGeneratorProjectSetDto>(null)
const showSetUrlModal = ref("")
const newSetUrl = ref<string>("")
const showAddSetModal = ref(false)

// Store data
const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()
const customerMessagesStore = useCustomerMessagesStore()

const { projectsAndSingleQrTags }: ToRefs<any> = storeToRefs(generatorStore)

// lifecycle
onBeforeMount(async () => {
  await customerMessagesStore.openConnection()
})

onUnmounted(async () => {
  await customerMessagesStore.closeConnection()
})

// computed
const canEdit = computed(() =>
  generatorEditAllowedRoles.includes(sessionStore.getCurrentRole as Role),
)

// modals
const toggleContextMenu = (project: IGeneratorProjectDto) => {
  if (showContextMenu.value === "")
    showContextMenu.value = project.id.toString()
  else showContextMenu.value = ""
}

const closeContextMenu = () => (showContextMenu.value = "")

const projectToDeleteId = ref("")
const setToDeleteId = ref("")

const showDeleteProjectDialog = (id: string) => (projectToDeleteId.value = id)

const showDeleteSetDialog = (projectId: string, setId: string) => {
  projectToDeleteId.value = projectId
  setToDeleteId.value = setId
}

const hideDeleteProjectDialog = () => (projectToDeleteId.value = "")

const hideDeleteSetDialog = () => {
  projectToDeleteId.value = ""
  setToDeleteId.value = ""
}

const toggleEditSetUrlModal = (
  project?: IGeneratorProjectDto,
  set?: IGeneratorProjectSetDto,
) => {
  if (showSetUrlModal.value === "" && set && project) {
    showSetUrlModal.value = set?.id
    currentSet.value = set
    currentProject.value = project
  } else {
    showSetUrlModal.value = ""
    currentSet.value = null
    currentProject.value = null
    newSetUrl.value = ""
  }
}

const toggleShowGenerateModal = () => {
  showGenerateModal.value = !showGenerateModal.value
  if (!showGenerateModal.value) {
    currentProject.value = null
    currentSet.value = null
  }
}

const openAddSetModal = (project: IGeneratorProjectDto) => {
  currentProject.value = project
  showAddSetModal.value = true
}

const closeAddSetModal = () => {
  currentProject.value = null
  showAddSetModal.value = false
}

// pagination
const currentItemsCount = computed(
  () =>
    projectsAndSingleQrTags.value.perPage * projectsAndSingleQrTags.value.page,
)
const page = ref(projectsAndSingleQrTags.value.page)
const perPage = computed(() => projectsAndSingleQrTags.value.perPage)
const totalItems = computed(() => projectsAndSingleQrTags.value.totalCount)

const fetchGenerators = (page = 1, perPage = null) => {
  generatorStore.getProjectsAndSingleQrTagsList({
    customerId: sessionStore.getSelectedCustomerId as string,
    page,
    perPage: perPage || currentItemsCount.value,
  })
}

const onLoadMore = () => {
  page.value++
  fetchGenerators(page.value, perPage.value)
}

const onSetPageChange = (nextPage: number, projectId: string) => {
  generatorStore.getAllSetsOfProject({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId,
    page: nextPage,
  })
}

// methods
const createGenerator = () => {
  track("Create project", {
    customerId: sessionStore.getSelectedCustomerId as string,
    date: machineDate(new Date()),
    userId: sessionStore.currentUser?.id,
  })
  router.push({ name: "app.generator.create" })
}

const editGenerator = (projectId: string) => {
  generatorStore.getProject({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId,
    callback: () => router.push(`/app/generator/edit/project/${projectId}`),
  })
}

const deleteProject = () => {
  generatorStore.deleteProject({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId: projectToDeleteId.value,
    callback: () => {
      projectToDeleteId.value = ""
      fetchGenerators()
    },
  })
}

const deleteSet = () => {
  generatorStore.deleteSet({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId: projectToDeleteId.value,
    setId: setToDeleteId.value,
    callback: () => {
      projectToDeleteId.value = ""
      setToDeleteId.value = ""
    },
  })
}

const updateSetUrl = (
  reset?: boolean,
  currProjectId?: string,
  currSetId?: string,
) => {
  if (newSetUrl.value !== currentProject.value?.settings.longURLBase || reset) {
    generatorStore.updateSet({
      customerId: sessionStore.getSelectedCustomerId as string,
      projectId: currProjectId || (currentProject.value?.id as string),
      setId: currSetId || showSetUrlModal.value,
      payload: reset
        ? { overrides: { longURLBase: null } }
        : { overrides: { longURLBase: newSetUrl.value } },
      callback: () => {
        currentProject.value = null
        showSetUrlModal.value = ""
        newSetUrl.value = ""
      },
    })
  }
}

const setCurrentProject = (project: IGeneratorProjectDto) =>
  (currentProject.value = project)
const setCurrentSet = (set: IGeneratorProjectSetDto) => (currentSet.value = set)
const setGenerateType = (type: string) => (generateType.value = type)

const isProject = (entity: IGeneratorProjectDto | IGeneratorSingleQrDto[]) =>
  "setsPreview" in entity

const createSet = (amount: string, perExportedFile: string) => {
  const exports = {
    ids: {
      maxCount: Number(perExportedFile),
      formats: [STRING_FORMATS.CSV, STRING_FORMATS.TXT],
    },
  }

  generatorStore.createSet({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId: currentProject.value?.id as string,
    amount: Number(amount),
    exports,
    callback: () => {
      generatorStore.getAllSetsOfProject({
        projectId: currentProject.value?.id as string,
        customerId: sessionStore.getSelectedCustomerId as string,
        page: 1,
      })
      currentProject.value = null
      showAddSetModal.value = false
    },
  })
}

rules()

// lifecycle
onBeforeMount(() => {
  fetchGenerators()
  if (!generatorStore.isGeneratorSettingsFetched) {
    generatorStore.getGeneratorSettings({
      customerId: sessionStore.getSelectedCustomerId as string,
    })
  }
})
</script>

<template>
  <div class="generator-overview" data-cy="all-labels">
    <LcPageTitle
      v-if="
        !generatorStore.isProjectsAndSingleQrTagsFetched ||
        !!generatorStore.getAllProjectsAndSingleQrTags.length
      "
      :title="$t('common.id_projects')"
    />
    <div
      v-if="generatorStore.isProjectsAndSingleQrTagsLoading"
      class="loader-wrapper"
    >
      <LcLoader size="lg" />
    </div>
    <template v-else-if="!!generatorStore.getAllProjectsAndSingleQrTags.length">
      <template v-for="entity in generatorStore.getAllProjectsAndSingleQrTags">
        <GeneratorProjectsListItem
          v-if="isProject(entity)"
          :key="(entity as IGeneratorProjectDto).id"
          :project="(entity as IGeneratorProjectDto)"
          :show-delete-project-dialog="showDeleteProjectDialog"
          :show-delete-set-dialog="showDeleteSetDialog"
          :can-edit="canEdit"
          :close-context-menu="closeContextMenu"
          :show-context-menu="showContextMenu"
          :toggle-context-menu="toggleContextMenu"
          :edit-generator="editGenerator"
          :open-add-set-modal="openAddSetModal"
        >
          <template #table>
            <GeneratorProjectTable
              :project="entity as IGeneratorProjectDto"
              :current-project="currentProject as IGeneratorProjectDto"
              :current-set="currentSet as IGeneratorProjectSetDto"
              :set-current-project="setCurrentProject"
              :set-current-set="setCurrentSet"
              :show-delete-set-dialog="showDeleteSetDialog"
              :toggle-edit-set-url-modal="toggleEditSetUrlModal"
              :update-set-url="updateSetUrl"
              :set-generate-type="setGenerateType"
              :toggle-show-generate-modal="toggleShowGenerateModal"
            />
          </template>
          <template #pagination>
            <LcPaginator
              :page="
                generatorStore.getAllSets[(entity as IGeneratorProjectDto).id]?.page ||
                (entity as IGeneratorProjectDto).setsPreview.page
              "
              :total="
                generatorStore.getAllSets[(entity as IGeneratorProjectDto).id]?.totalCount ||
                (entity as IGeneratorProjectDto).setsPreview.totalCount
              "
              :page-size="
                generatorStore.getAllSets[(entity as IGeneratorProjectDto).id]?.perPage ||
                (entity as IGeneratorProjectDto).setsPreview.perPage
              "
              :total-pages="
                generatorStore.getAllSets[(entity as IGeneratorProjectDto).id]?.lastPage ||
                (entity as IGeneratorProjectDto).setsPreview.lastPage
              "
              @page-change="(nextPage) => onSetPageChange(nextPage, (entity as IGeneratorProjectDto).id)"
            />
          </template>
        </GeneratorProjectsListItem>
        <template v-else>
          <GeneratorsSingleQrsList
            :key="`single${(entity as IGeneratorSingleQrDto[])[0].id}`"
            :can-edit="canEdit"
          />
        </template>
      </template>
    </template>
    <template v-else>
      <div class="no-project-wrapper">
        <LoadingPrompt class="loading-prompt-img" />
        <p class="description-text">To add a Label click "Add Label"</p>
      </div>
    </template>
    <div class="load-more-button-container">
      <div
        v-if="generatorStore.isProjectsAndSingleQrTagsPartLoading"
        class="loader-wrapper"
      >
        <LcLoader size="lg" />
      </div>
      <LcButton
        v-else
        :style="{
          visibility: currentItemsCount < totalItems ? 'visible' : 'hidden',
        }"
        variant="link"
        size="xl"
        :icon="CircleArrowsIcon"
        @click="onLoadMore"
        >Load more
      </LcButton>
    </div>

    <LcDialog
      :show="Boolean(projectToDeleteId) && !Boolean(setToDeleteId)"
      :icon="Warning"
      :headline="$t('generator.overview.delete_this_project')"
      :cancel-label="$t('common.cancel')"
      :confirm-label="$t('generator.overview.delete_project')"
      :show-loader="generatorStore.isDeletingProject"
      destructive
      @close="hideDeleteProjectDialog"
      @confirm="deleteProject"
    >
      <div class="delete-text" data-cy="project-delete-dialog">
        {{ $t("generator.overview.project_delete_description") }}
      </div>
    </LcDialog>
    <LcDialog
      :show="Boolean(setToDeleteId)"
      :icon="Warning"
      :headline="$t('generator.overview.delete_this_set')"
      :cancel-label="$t('common.cancel')"
      :confirm-label="$t('generator.project_table.delete_set')"
      :show-loader="generatorStore.isDeletingSet"
      destructive
      @close="hideDeleteSetDialog"
      @confirm="deleteSet"
    >
      <div class="delete-text">
        {{ $t("generator.overview.set_delete_description") }}
      </div>
    </LcDialog>
    <LcModal
      :show="showSetUrlModal !== ''"
      :icon="SwitchIcon"
      :title="$t('generator.overview.change_long_url')"
      :description="$t('generator.overview.short_url_will_remain_same')"
      @close="toggleEditSetUrlModal"
    >
      <div class="generator-overview-set-url-modal">
        <div class="generator-overview-set-url-modal-current-urls">
          <span>{{
            generatorStore.getSingleProject?.settings?.shortURLDomain ||
            generatorStore.getGlobalShortUrl
          }}</span>
          <ArrowRightIcon />
          <span
            :class="{
              'generator-overview-set-url-modal-empty-url':
                !currentProject?.settings?.longURLBase,
            }"
          >
            {{
              currentProject?.settings?.longURLBase ||
              $t("generator.overview.no_long_url_yet")
            }}
          </span>
        </div>
        <Form @submit="updateSetUrl()">
          <LcFormItem
            v-slot="{ field, meta }"
            name="url"
            :label="$t('generator.overview.your_new_long_url')"
            rules="required|url"
          >
            <LcInput v-model="newSetUrl" v-bind="field" :meta="meta" />
          </LcFormItem>
          <LcButton
            v-if="
              currentSet?.overrides?.longURLBase &&
              currentSet?.overrides?.longURLBase !==
                currentProject?.settings?.longURLBase
            "
            variant="link"
            :icon="CircleArrowsIcon"
            @click="updateSetUrl(true)"
          >
            {{ $t("generator.overview.reset_to_project_url") }}
          </LcButton>
          <div class="generator-overview-set-url-modal-actions">
            <LcButton variant="link" @click="toggleEditSetUrlModal()">
              {{ $t("common.cancel") }}
            </LcButton>
            <LcButton type="submit">{{
              $t("generator.overview.save_new_url")
            }}</LcButton>
          </div>
        </Form>
      </div>
    </LcModal>
    <GenerateModal
      v-if="currentProject?.id && currentSet?.id"
      :show-generate-modal="showGenerateModal"
      :project-id="currentProject?.id"
      :set-id="currentSet?.id"
      :generate-type="generateType"
      :toggle-show-generate-modal="toggleShowGenerateModal"
    />
    <GeneratorAddSetModal
      v-if="currentProject?.id"
      :show="showAddSetModal"
      :close="closeAddSetModal"
      :create-set="createSet"
    />
  </div>
</template>

<style lang="scss">
.load-more-button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--space-16);
  padding-bottom: var(--space-12);
}

.generator-overview-create {
  button {
    margin-left: var(--space-8);
    margin-top: var(--space-4);
  }
}

.generator-overview {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-2);

  .show-mobile {
    display: none;

    @include mqDesktopFirst("tablet") {
      display: flex;
    }
  }

  .hide-mobile {
    @include mqDesktopFirst("tablet") {
      display: none;
    }
  }

  .lc-page-header {
    font-weight: var(--font-weight-600);
    font-size: var(--display-xs-font-size);
  }

  &-create {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--space-10);
  }

  .loader-wrapper {
    display: flex;
    justify-content: center;
  }

  .no-project-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .description-text {
      margin-top: var(--space-10);
      font-size: var(--text-lg-font-size);
    }
  }

  .card {
    margin: var(--space-8) 0;

    .header {
      margin-bottom: var(--space-4);
    }
  }

  &-table-header-actions {
    display: flex;
    align-items: center;
    justify-content: space-around;

    .edit-btn {
      margin-left: var(--space-);
    }

    .generate-btn,
    .generate-btn-desktop {
      margin-right: var(--space-4);
    }

    .edit-btn,
    .generate-btn-desktop {
      @include mqDesktopFirst("tablet") {
        display: none;
      }
    }

    .generate-btn {
      @include mq("tablet") {
        display: none;
      }
    }
  }

  .export-placeholder {
    color: var(--clr-gray-500);
  }

  &-override-link {
    display: inline;
    white-space: nowrap;
    cursor: pointer;
    font-weight: var(--font-weight-regular);
    color: var(--clr-gray-500);

    svg {
      height: 1rem;
      width: 1rem;
      margin-right: var(--space-2);
      vertical-align: text-top;
    }
  }

  &-download-loader {
    display: flex;
    align-items: center;
    margin-left: 0.8rem;
  }

  &-download-link {
    display: inline-block;
    color: var(--clr-gray-500);
    font-weight: var(--font-weight-semibold);
    padding-right: var(--space-2);
    font-size: var(--text-sm-font-size);
    cursor: pointer;
  }

  .table__row td {
    color: var(--clr-gray-800);
    font-size: var(--text-sm-font-size);
    font-weight: var(--font-weight-medium);

    &.actions {
      text-align: end;
    }
  }

  &-set-url-modal {
    &-current-urls {
      font-size: var(--text-sm-font-size);
      color: var(--clr-gray-900);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: var(--space-8);

      svg {
        margin: 0 var(--space-4);
      }
    }

    &-empty-url {
      color: var(--clr-gray-400);
    }

    &-actions {
      display: flex;
      justify-content: center;
      margin-top: var(--space-8);
    }
  }

  // mobile
  @include mqDesktopFirst("tablet") {
    .subtitle {
      display: none;
    }

    .table .table__row {
      height: auto;
      position: relative;
      padding-right: var(--space-10);

      .generator-start-value {
        width: 100%;
        justify-content: flex-start;
        display: flex;
        flex-direction: column;
        margin-bottom: var(--space-4);
      }

      .generator-amount,
      .generator-created {
        width: 50%;
      }

      .generator-urls,
      .generator-qrs {
        width: auto;

        .btn {
          margin-right: var(--space-2);
        }
      }

      .actions {
        position: absolute;
        bottom: var(--space-10);
        right: var(--space-4);
      }
    }
  }
}

.edit-action {
  @include mq("tablet") {
    display: none;
  }
}

.only-mobile-edit {
  display: none;

  @include mqDesktopFirst("tablet") {
    display: flex;
  }
}

.delete-text {
  text-align: center;
}

.generators-table-col {
  &__xs {
    width: 5%;
  }

  &__lg {
    width: 20%;
  }

  &__xl {
    width: 30%;
  }
}
</style>
