<script lang="ts" setup>
import { Form } from "vee-validate"
import type { RouteLocationNormalizedLoaded } from "vue-router"
import { rules } from "~/modules/validationRules"
import LcDropdown from "~/components/base/LcDropdown.vue"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"
import LcLoader from "~/components/base/LcLoader.vue"
import LcInput from "~/components/base/LcInput.vue"
import LcButton from "~/components/base/LcButton.vue"
import PlusIcon from "~/assets/icons/icon-plus.svg?component"

const { t } = useI18n()

type dropDownOption = { value: string }

const props = defineProps<{
  nextStep?: Function
  nextUrl: (route: RouteLocationNormalizedLoaded) => string
}>()

const route = useRoute()
const router = useRouter()

const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()
const url = ref(generatorStore.getSingleProject?.settings?.longURLBase)
const modalUrl = ref("")
const showAddUrlModal = ref(false)

const label = computed(() =>
  generatorStore.getAllCustomerLongUrls?.length
    ? t("generator.choose_your_target_link")
    : t("your_target_link"),
)

const toggleShowAddUrlModal = () => {
  showAddUrlModal.value = !showAddUrlModal.value
}

const saveLongUrlToProjectSettings = () => {
  const isModal = showAddUrlModal.value
  generatorStore.updateProject({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId: route.params.projectId as string,
    payload: {
      settings: {
        longURLBase: isModal ? modalUrl.value : url.value,
      },
    },
    callback: () => {
      isModal && toggleShowAddUrlModal()
      generatorStore.getUrlSuggestions({
        customerId: sessionStore.getSelectedCustomerId as string,
      })
      router.push({
        path: props.nextUrl(route),
        query: {
          step: route.query?.step ? 0 : undefined,
          setId: route.query?.setId,
        },
      })
    },
  })
}

rules()

onUpdated(() => {
  if (url.value !== generatorStore.getSingleProject?.settings?.longURLBase) {
    url.value = generatorStore.getSingleProject?.settings?.longURLBase
  }
})

onBeforeMount(() => {
  if (sessionStore.getSelectedCustomerId) {
    generatorStore.getUrlSuggestions({
      customerId: sessionStore.getSelectedCustomerId as string,
    })
  }
})
</script>
<template>
  <div
    v-if="generatorStore.isUrlSuggestLoading"
    class="lc-generator-loader-wrapper"
  >
    <LcLoader size="lg" />
  </div>
  <div
    v-else-if="
      generatorStore.isUrlSuggestFetched && generatorStore.isProjectFetched
    "
    class="lc-generator-choose-url"
  >
    <Form @submit="saveLongUrlToProjectSettings">
      <LcFormItem
        v-slot="{ meta, field }"
        name="url"
        :label="label"
        rules="required|url"
        :default-value="generatorStore.getSingleProject?.settings?.longURLBase"
      >
        <template v-if="generatorStore.getAllCustomerLongUrls?.length">
          <LcDropdown
            v-model="url"
            v-bind="field"
            :reduce="(option: dropDownOption) => option.value"
            :meta="meta"
            label="value"
            :options="generatorStore.getAllCustomerLongUrls"
            data-cy="long-url-dropdown"
          />
        </template>
        <template v-else>
          <LcInput v-model="url" v-bind="field" :meta="meta" />
        </template>
      </LcFormItem>
      <LcButton
        v-if="generatorStore.getAllCustomerLongUrls?.length"
        :icon="PlusIcon"
        variant="link"
        @click="toggleShowAddUrlModal"
      >
        {{ $t("generator.add_new_target_link") }}
      </LcButton>
      <div class="lc-generator-choose-url-actions">
        <LcButton variant="link" @click="router.push('/app/generator')">
          {{ $t("common.cancel") }}
        </LcButton>
        <LcButton type="submit">
          <LcLoader v-if="generatorStore.isProjectLoading" size="xs" white />
          <span v-else>{{ $t("common.next") }}</span>
        </LcButton>
      </div>
    </Form>
    <LcModal
      :show="showAddUrlModal"
      :icon="PlusIcon"
      :title="$t('generator.add_a_new_target_link')"
      @close="toggleShowAddUrlModal"
    >
      <Form @submit="saveLongUrlToProjectSettings">
        <LcFormItem
          name="url"
          :label="$t('generator.your_target_link')"
          rules="required|url"
        >
          <template #default="{ field, meta }">
            <LcInput v-model="modalUrl" v-bind="field" :meta="meta" />
          </template>

          <template #customErrors>{{
            $t("generator.please_fill_link_field")
          }}</template>
        </LcFormItem>
        <div class="lc-generator-choose-url-actions">
          <LcButton variant="link" @click="toggleShowAddUrlModal">
            {{ $t("common.cancel") }}
          </LcButton>
          <LcButton type="submit">
            <LcLoader v-if="generatorStore.isProjectLoading" size="xs" white />
            <span v-else>{{ $t("common.save_target_link") }}</span>
          </LcButton>
        </div>
      </Form>
    </LcModal>
  </div>
</template>
<style lang="scss" scoped>
.lc-generator-loader-wrapper {
  display: flex;
  justify-content: center;
}
.lc-generator-choose-url {
  form {
    display: flex;
    flex-direction: column;
    align-items: center;

    .field--wrapper {
      width: 400px;
      max-width: 100%;
    }
  }

  &-actions {
    display: flex;
    justify-content: center;
    margin-top: var(--space-8);

    .btn {
      margin: 0 var(--space-2);
    }
  }
}
</style>
