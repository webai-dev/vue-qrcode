<!-- Import statements and component definitions -->
<script setup lang="ts">
import type { FormContext } from "vee-validate"
import _ from "lodash"
import { storeToRefs } from "pinia"
import { ref, watch } from "vue"
import { Form } from "vee-validate"
import type { INewURLDialog } from "~/types/types"
import ArrowLeftIcon from "~/assets/icons/icon-arrow-left.svg?component"
import LinkIcon2 from "~/assets/icons/icon-link-2.svg?component"
import LinkIcon from "~/assets/icons/icon-link.svg?component"
import AddIcon from "~/assets/icons/icon-plus.svg?component"
import LcButton from "~/components/base/LcButton.vue"
import {
  LcVerticalStepperContainer,
  LcVerticalStepperStep,
} from "~/components/base/LcVerticalStepper"
import LcGeneratorSettingOverview from "~/components/shared/generators/LcGeneratorSettingOverview.vue"
import { defaultIdPartsItems } from "~/constants/generators"
import { useGeneratorStore } from "~/stores/generator"
import { useIdPartsStore } from "~/stores/id-parts.store"
import { useSessionStore } from "~/stores/session"
import type {
  IIdPartSettingsDto,
  IUpdateProjectData,
} from "~/types/stores/GeneratorStore"
import { DELIMITER, URL_TYPES } from "~/types/stores/GeneratorStore"
import { rules } from "~/modules/validationRules"
import { SHORT_LINK_OPTIONS } from "~/types/types"
import { appendUTMCodesToUrl } from "~/helpers/formatters"

rules()

const route = useRoute()
const router = useRouter()
// store
const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()
const idPartsStore = useIdPartsStore()
const { t } = useI18n()

const parts = storeToRefs(idPartsStore).getParts
const defaultShortUrl = ref("qrm.ly")
const shortUrl = ref(defaultShortUrl.value)
const targetUrl = ref("")
const amount = ref("1000000")
const perExport = ref("1000000")
const selectedShortLinkOption = ref(SHORT_LINK_OPTIONS.DEFAULT)
const projectName = ref(t("generator.default_project_name"))
const dialogConfig = ref<INewURLDialog | null>({
  visible: false,
  urlType: URL_TYPES.long,
})
const newLinkURL = ref("")
const utmCode = ref("")
const utmCodes = ref(new Array(0))

const formRef = ref<FormContext | null>(null)

const initialValues = {
  "short-link-option": SHORT_LINK_OPTIONS.DEFAULT,
  "short-link": "qrm.ly",
  "target-link": "",
  url: "",
  amount: "0",
  "per-exported": "0",
  "project-name": t("generator.default_project_name"),
}

const newUrlRules = computed(() =>
  dialogConfig.value?.visible ? "required|url" : "",
)

const shortUrlRules = computed(() =>
  selectedShortLinkOption.value === SHORT_LINK_OPTIONS.CUSTOM ? "required" : "",
)

const addUtmCodeField = () => {
  if (utmCodes.value.length > 4) return
  utmCodes.value.push("")
}

const removeUtmCodeField = (index: number) => {
  utmCodes.value.splice(index, 1)
  utmCode.value = appendUTMCodesToUrl("", utmCodes.value).replace("?", "")
}

const handleUTMCodeChanged = ({
  value,
  index,
}: {
  value: string
  index: string
}) => {
  utmCodes.value[Number(index)] = value
  utmCode.value = appendUTMCodesToUrl("", utmCodes.value).replace("?", "")
}

const handleCreate = async () => {
  if (projectName.value) {
    const customerId = sessionStore.getSelectedCustomerId!
    await generatorStore.createProject({ customerId, name: projectName.value })
    const projectId = generatorStore.getProjectId!
    // Prepare the data for updating the project
    const projectData: IUpdateProjectData = {
      projectId,
      customerId,
      payload: {
        name: projectName.value,
        settings: {
          id: {
            parts: (parts.value as IIdPartSettingsDto[]).map((part, index) => ({
              ...part,
              index: part.index || index,
            })),
            delimiter: DELIMITER["-"],
          },
          shortURLDomain: shortUrl.value,
          longURLBase: targetUrl.value,
        },
      },
    }
    if (projectData.payload.settings) {
      projectData.payload.settings.longURLBase = appendUTMCodesToUrl(
        targetUrl.value,
        utmCodes.value,
      )
    }

    // Update the project with the new data
    await generatorStore.updateProject(projectData)

    await router.push("/app/labels/in-process")
  }
}

const handleCloseNewURLModal = () => {
  dialogConfig.value = null
  newLinkURL.value = ""
}

const handleSaveNewURL = async (
  data: { url: string; type: URL_TYPES } | undefined,
) => {
  const isValid = await formRef.value?.validateField("url")
  if (!isValid?.valid) return

  if (generatorStore && generatorStore.urlSuggest) {
    const urlType: URL_TYPES | undefined =
      data?.type || dialogConfig?.value?.urlType
    const urlValue: string = data?.url || newLinkURL.value

    generatorStore.urlSuggest.push({
      type: urlType as URL_TYPES,
      value: urlValue,
    })
    const isShortUrl = urlType === URL_TYPES.short
    const linkRef = isShortUrl ? shortUrl : targetUrl
    linkRef.value = urlValue

    const currentUrlFieldName = isShortUrl ? "short-link" : "target-link"
    formRef.value?.setFieldValue(currentUrlFieldName, urlValue)
    await formRef.value?.validateField(currentUrlFieldName)

    linkRef.value = urlValue
  }

  handleCloseNewURLModal()
}

const handleAddNewLinkURL = (urlType: URL_TYPES) => {
  dialogConfig.value = {
    visible: true,
    urlType,
    placeholder: t("generator.enter_url"),
    headline:
      urlType === URL_TYPES.short
        ? t("generator.add_short_url")
        : t("generator.add_target_url"),
    confirmLabel:
      urlType === URL_TYPES.short
        ? t("generator.save_short_url")
        : t("generator.save_target_link"),
    cancelLabel: t("common.close"),
  }
}

const handleAmountChanged = (value: string) => {
  amount.value = value
}

const handlePerExportChanged = (value: string) => {
  perExport.value = value
}

const handleProjectNameChanged = (value: string) => {
  projectName.value = value
}

const urlSuggestions = computed(() => {
  return _.partition(
    generatorStore?.urlSuggest || [],
    (item) => item.type === URL_TYPES.short,
  )
})

const shortUrls = ref(urlSuggestions.value[0])
const longUrls = ref(urlSuggestions.value[1])
const lastIdPartChanged = ref<any>({})
const generatorSettingOverviewRef = ref<any>(null)

const handleIdPartChanged = (
  index: number,
  action: string,
  part: IIdPartSettingsDto,
  newIndex?: number,
) => {
  if (action === "swap") {
    generatorSettingOverviewRef.value?.swapIdPart(index, newIndex)
  }
  lastIdPartChanged.value = { index, action, part }
}

watch(urlSuggestions, (newVal) => {
  shortUrls.value = newVal[0]
  longUrls.value = newVal[1]
})

watch(selectedShortLinkOption, (linkType: string) => {
  const newValue = linkType === "default" ? defaultShortUrl.value : ""
  shortUrl.value = newValue
  formRef.value?.setFieldValue("short-link", newValue)
})

onBeforeMount(() => {
  if (!generatorStore.isProjectFetched && route.params.projectId) {
    generatorStore.getProject({
      customerId: sessionStore.getSelectedCustomerId as string,
      projectId: route.params.projectId as string,
    })
  }

  if (!generatorStore.fetched.urlSuggest) {
    generatorStore.getUrlSuggestions({
      customerId: sessionStore.getSelectedCustomerId as string,
    })
  }

  idPartsStore.emptyParts()
  if (!parts.value.length) {
    parts.value.push(defaultIdPartsItems.RANDOM)
  }
  shortUrl.value = defaultShortUrl.value
  selectedShortLinkOption.value = SHORT_LINK_OPTIONS.DEFAULT
})
</script>

<!-- Component template -->
<template>
  <div>
    <LcButton
      class="lc-button"
      variant="link"
      :icon="ArrowLeftIcon"
      @click="router.back()"
    >
      {{ $t("links.back") }}
    </LcButton>
    <LcPageTitle :title="$t('links.create_serialized_links')" />

    <Form
      ref="formRef"
      :initial-values="initialValues"
      class="lc-page-content"
      @submit="handleCreate"
    >
      <LcVerticalStepperContainer style="width: 100%">
        <LcVerticalStepperStep :active="true" :icon="LinkIcon">
          <span class="label"
            >{{ $t("links.short_link_label.part_1") }}
            <strong>{{ $t("links.short_link_label.part_2") }}</strong></span
          >
          <LcRadioGroup v-model="selectedShortLinkOption" :vertical="true">
            <template #default="{ select, selectedValue }">
              <LcRadioButton
                id="default_option"
                name="short-link-option"
                :value="SHORT_LINK_OPTIONS.DEFAULT"
                model-value="default"
                :checked="selectedValue === SHORT_LINK_OPTIONS.DEFAULT"
                @change="() => select(SHORT_LINK_OPTIONS.DEFAULT)"
              >
                {{ $t("links.use_default_short_link") }}
                <span class="mute-text">{{ defaultShortUrl }}</span>
              </LcRadioButton>
              <LcRadioButton
                id="custom_option"
                name="short-link-option"
                :value="SHORT_LINK_OPTIONS.CUSTOM"
                :checked="selectedValue === SHORT_LINK_OPTIONS.CUSTOM"
                @change="() => select(SHORT_LINK_OPTIONS.CUSTOM)"
              >
                {{ $t("links.use_custom_short_link") }}
              </LcRadioButton>
            </template>
          </LcRadioGroup>
          <div class="row ml-3">
            <LcFormItem
              v-slot="{ meta, field }"
              :rules="shortUrlRules"
              name="short-link"
              class-name="url-wrapper"
            >
              <LcDropdown
                v-if="shortUrls.length > 0"
                v-model="shortUrl"
                v-bind="field"
                :meta="meta"
                :disabled="
                  selectedShortLinkOption === SHORT_LINK_OPTIONS.DEFAULT
                "
                :placeholder="$t('links.short_link_label.placeholder')"
                :options="shortUrls.map(({ value: url }) => url)"
                name="short-link"
              />
              <LcURLInput
                v-if="shortUrls.length === 0"
                v-model="targetUrl"
                :meta="meta"
                :placeholder="$t('links.short_link_label.placeholder')"
                name="short-link"
                :type="URL_TYPES.short"
                @update:url="
                  ({ type, value }) =>
                    handleSaveNewURL({
                      url: value,
                      type,
                    })
                "
              />
            </LcFormItem>
            <LcButton
              v-if="shortUrls.length > 0"
              class="lc-button"
              variant="link"
              :disabled="selectedShortLinkOption === SHORT_LINK_OPTIONS.DEFAULT"
              :icon="AddIcon"
              @click="() => handleAddNewLinkURL(URL_TYPES.short)"
            >
              {{ $t("links.short_link_label.add") }}
            </LcButton>
          </div>
        </LcVerticalStepperStep>

        <LcVerticalStepperStep :active="true" :icon="LinkIcon">
          <span class="label"
            >{{ $t("links.target_link_label.part_1") }}
            <strong>{{ $t("links.target_link_label.part_2") }}</strong></span
          >
          <div class="row">
            <LcFormItem
              v-slot="{ meta, field }"
              name="target-link"
              rules="required"
              class-name="url-wrapper"
            >
              <LcDropdown
                v-if="longUrls.length > 0"
                v-model="targetUrl"
                v-bind="field"
                :meta="meta"
                :placeholder="$t('links.target_link_label.placeholder')"
                :options="longUrls.map(({ value: url }) => url)"
                name="target-link"
              />
              <LcURLInput
                v-if="longUrls.length === 0"
                v-model="targetUrl"
                :meta="meta"
                :placeholder="$t('links.target_link_label.placeholder')"
                name="target-link"
                :type="URL_TYPES.long"
                @update:url="
                  ({ value, type }) =>
                    handleSaveNewURL({
                      url: value,
                      type,
                    })
                "
              />
            </LcFormItem>
            <LcButton
              v-if="longUrls.length > 0"
              class="lc-button"
              variant="link"
              :icon="AddIcon"
              @click="() => handleAddNewLinkURL(URL_TYPES.long)"
            >
              {{ $t("links.target_link_label.add") }}
            </LcButton>
          </div>
        </LcVerticalStepperStep>

        <LcVerticalStepperStep :active="true" text-icon="ID">
          <span class="label with-radio"
            >{{ $t("links.attach_serial_number.part_1") }}
            <strong>{{ $t("links.attach_serial_number.part_2") }}</strong></span
          >
          <!-- ID PARTS -->
          <LcIdPartsFormItems
            :id-parts="parts as IIdPartSettingsDto[]"
            @part:update="handleIdPartChanged"
          />
        </LcVerticalStepperStep>
        <LcVerticalStepperStep :active="utmCodes.length > 0" :icon="LinkIcon2">
          <div v-for="(_utmCode, index) in utmCodes" :key="index" class="row">
            <LcFormItem v-slot="{ meta }" :name="`utm-code-${index}`">
              <LcUtmCodeInput
                :utm-code="_utmCode"
                :meta="meta"
                :placeholder="$t('links.utm_code_label.placeholder')"
                :name="`utm-code-${index}`"
                @remove="() => removeUtmCodeField(index)"
                @update:utm-code="(value: any) => handleUTMCodeChanged(value)"
              />
            </LcFormItem>
          </div>
          <LcButton
            v-if="utmCodes.length < 5"
            class="lc-button add-utm-code-button"
            :icon="AddIcon"
            variant="link"
            @click="addUtmCodeField"
          >
            {{ $t("links.utm_code_label.add_utm_code") }}
          </LcButton>
        </LcVerticalStepperStep>
      </LcVerticalStepperContainer>

      <LcGeneratorSettingOverview
        ref="generatorSettingOverviewRef"
        :utm-code="utmCode"
        :short-link="shortUrl as string"
        :target-link="targetUrl as string"
        :id-parts="parts as IIdPartSettingsDto[]"
        :last-id-part-changed="lastIdPartChanged"
      />

      <h2 class="subheader">{{ $t("links.export.title") }}</h2>
      <LcIdPartsFormExportItems
        :amount-label="
          $t('generator.overview.total_amount_of_serialized_links')
        "
        :amount="amount as string"
        :per-exported="perExport as string"
        :project-name="projectName as string"
        @update:amount="handleAmountChanged"
        @update:per-exported="handlePerExportChanged"
        @update:project-name="handleProjectNameChanged"
      />

      <LcDialog
        :show="dialogConfig?.visible ?? false"
        :headline="dialogConfig?.headline ?? ''"
        :confirm-label="dialogConfig?.confirmLabel"
        :cancel-label="dialogConfig?.cancelLabel"
        @close="handleCloseNewURLModal"
        @confirm="handleSaveNewURL"
      >
        <LcFormItem v-slot="{ meta, field }" :rules="newUrlRules" name="url">
          <LcInput
            v-bind="field"
            v-model="newLinkURL"
            :meta="meta"
            :placeholder="dialogConfig?.placeholder"
            name="url"
          />
        </LcFormItem>
      </LcDialog>

      <div class="row">
        <LcButton class="lc-button no-border" variant="secondary">
          {{ $t("common.cancel") }}
        </LcButton>
        <LcButton class="lc-button" variant="primary" type="submit">
          {{ $t("common.create") }}
        </LcButton>
      </div>
    </Form>
  </div>
</template>
<!-- Component styles -->
<style lang="scss" scoped>
.subheader {
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #1d2939;
}

span.label {
  &.with-radio {
    margin-bottom: 0.6875rem;
  }

  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  display: block;
}

span.mute-text {
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: var(--clr-gray-400);
  margin-left: 6px;
}

.lc-page-title {
  margin-bottom: 0;
}

.lc-button {
  width: fit-content;

  &.no-border {
    border: none;
  }
  &.add-utm-code-button {
    margin-top: -10px;
    margin-left: 0.3625rem;
  }

  :deep(svg) {
    color: var(--clr-primary-600);
    width: 0.5rem;
    height: 0.5rem;
  }
  :deep(.button__text) {
    font-size: 0.73rem;
  }

  &[type="submit"] :deep(.button__text) {
    color: var(--clr-white);
  }
}

.btn--primary.btn--icon-only {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  gap: 9px;
  align-items: center;

  &.ml-3 {
    margin-left: 30px;
    margin-top: 10px;
  }

  &.attach .v-select {
    max-width: 130px;
  }

  & button.btn--link {
    padding: 0;
    background-color: transparent;
    margin: -20px 0px 0px 14px;

    svg {
      width: 10px;
      height: 10px;
    }
  }

  &.add-id-part-btn-group button.btn--link.lc-button {
    margin: 0 20px 0 10px;
  }
}

.inline-select {
  margin-right: 1rem;
}

.v-select {
  width: 300px;
  height: 48px;
}

.url-wrapper {
  width: 300px;
}
</style>
