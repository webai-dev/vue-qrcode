<script setup lang="ts">
import { Form } from "vee-validate"
import type { RouteLocationNormalizedLoaded } from "vue-router"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"
import { rules } from "~/modules/validationRules"
import LcButton from "~/components/base/LcButton.vue"
import PlusIcon from "~/assets/icons/icon-plus.svg?component"
import ArrowDownIcon from "~/assets/icons/icon-arrow-down.svg?component"
import LcDropdown from "~/components/base/LcDropdown.vue"

type dropDownOption = { value: string }

const props = withDefaults(
  defineProps<{
    nextUrl?: (
      route: RouteLocationNormalizedLoaded,
    ) => (hasSettings: boolean) => string
    autoSave?: boolean
    updateUrl?: (longUrl: string) => void
  }>(),
  {
    autoSave: true,
  },
)

const route = useRoute()
const router = useRouter()

const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

const url = ref(generatorStore.getSingleProject?.settings?.longURLBase || "")
const customShortUrl = ref("")
const showShortUrlModal = ref(false)
const showShortUrlInput = ref(false)

const toggleShortUrlModal = () => {
  showShortUrlModal.value = !showShortUrlModal.value
}

const toggleShortUrlInput = () => {
  showShortUrlInput.value = !showShortUrlInput.value
}

const updateShortUrl = () => {
  generatorStore.updateProject({
    customerId: sessionStore.getSelectedCustomerId as string,
    projectId: route.params.projectId as string,
    payload: {
      settings: {
        shortURLDomain: customShortUrl.value,
      },
    },
    callback: () => {
      toggleShortUrlModal()
      showShortUrlInput.value && toggleShortUrlInput()
      customShortUrl.value = ""
    },
  })
}

const updateLongUrl = (option: any) => {
  props.autoSave
    ? generatorStore.updateProject({
        customerId: sessionStore.getSelectedCustomerId as string,
        projectId: route.params.projectId as string,
        payload: {
          settings: {
            longURLBase: option.value,
          },
        },
        preventLoader: true,
      })
    : props.updateUrl && props.updateUrl(option)
}

const next = () =>
  props.nextUrl &&
  router.push({
    path: props.nextUrl(route)(
      Boolean(
        generatorStore.getSingleProjectSettings?.length &&
          generatorStore.getSingleProject?.setsPreview?.data?.length,
      ),
    ),
    query: {
      step: generatorStore.getSingleProjectSettings?.length ? 2 : 1,
      setId: route.query?.setId,
    },
  })

rules()

onUpdated(() => {
  if (url.value !== generatorStore.getSingleProject?.settings?.longURLBase) {
    url.value = generatorStore.getSingleProject?.settings?.longURLBase
  }
})

onBeforeMount(() => {
  if (!generatorStore.isUrlSuggestFetched) {
    generatorStore.getUrlSuggestions({
      customerId: sessionStore.getSelectedCustomerId as string,
    })
  }

  if (!generatorStore.isGeneratorSettingsFetched) {
    generatorStore.getGeneratorSettings({
      customerId: sessionStore.getSelectedCustomerId as string,
    })
  }
})
</script>
<template>
  <div class="lc-generator-short-url">
    <LcFormItem
      v-slot="{ meta, field }"
      name="url"
      :label="$t('generator.your_target_link')"
      :default-value="generatorStore.getSingleProject?.settings?.longURLBase"
    >
      <template v-if="generatorStore.getAllCustomerLongUrls?.length">
        <LcDropdown
          v-model="url"
          v-bind="field"
          :reduce="(option: dropDownOption) => option.value"
          :meta="meta"
          :options="generatorStore.getAllCustomerLongUrls"
          label="value"
          @update="updateLongUrl"
        />
      </template>
      <template v-else>
        <LcInput
          :meta="meta"
          :value="generatorStore.getSingleProject?.settings?.longURLBase"
          use-value-instead-of-model
          readonly
        />
      </template>
    </LcFormItem>
    <div class="lc-generator-short-url-title">
      {{ $t("generator.short_url") }}
    </div>
    <div class="lc-generator-short-url-box">
      <span class="lc-generator-short-url-link">
        {{
          generatorStore.getSingleProject?.settings?.shortURLDomain ||
          generatorStore.getGlobalShortUrl
        }}
      </span>
      <LcButton
        v-if="
          !Boolean(
            generatorStore.getSingleProject?.setsPreview?.data.some(
              (p) => p.exports.urls,
            ),
          )
        "
        :icon="PlusIcon"
        variant="link"
        @click="toggleShortUrlModal"
      >
        {{ $t("generator.use_custom_short_url") }}
      </LcButton>
    </div>
    <ArrowDownIcon class="lc-generator-short-url-icon" />
    <div class="lc-generator-short-url-title">
      {{ $t("generator.serialised_short_link_example") }}
    </div>
    <div class="lc-generator-short-url">qrm.sh/123</div>
    <div v-if="nextUrl" class="lc-generator-short-url-actions">
      <LcButton variant="link" @click="router.push('/app/generator')">
        {{ $t("common.cancel") }}
      </LcButton>
      <LcButton @click="next">{{ $t("common.next") }}</LcButton>
    </div>
  </div>
  <LcModal
    :show="showShortUrlModal"
    :icon="PlusIcon"
    :title="$t('generator.customize_your_short_url')"
    @close="toggleShortUrlModal"
  >
    <Form @submit="updateShortUrl">
      <LcFormItem
        v-slot="{ meta, field }"
        name="shortUrl"
        :label="
          $t(
            `${
              showShortUrlInput
                ? 'generator.add_your_new_short_url'
                : 'generator.your_short_url'
            }`,
          )
        "
        rules="required|url"
      >
        <template
          v-if="
            !generatorStore.getAllCustomerShortUrls?.length || showShortUrlInput
          "
        >
          <LcInput v-model="customShortUrl" v-bind="field" :meta="meta" />
          <span
            v-if="showShortUrlInput"
            class="lc-generator-short-url-modal-link"
          >
            <span class="lc-generator-short-url-modal-link-text">or</span>
            <LcButton variant="link" @click="toggleShortUrlInput">
              {{ $t("generator.select_saved_short_url") }}
            </LcButton>
          </span>
        </template>
        <template v-else>
          <LcDropdown
            v-model="customShortUrl"
            v-bind="field"
            :reduce="(option: dropDownOption) => option.value"
            :meta="meta"
            :options="generatorStore.getAllCustomerShortUrls"
            label="value"
          />
          <span class="lc-generator-short-url-modal-link">
            <span class="lc-generator-short-url-modal-link-text">or</span>
            <LcButton
              :icon="PlusIcon"
              variant="link"
              @click="toggleShortUrlInput"
            >
              {{ $t("generator.add_new_one") }}
            </LcButton>
          </span>
        </template>
      </LcFormItem>
      <div class="lc-generator-short-url-actions">
        <LcButton variant="link" @click="toggleShortUrlModal">
          {{ $t("common.cancel") }}
        </LcButton>
        <LcButton type="submit">{{ $t("generator.save_short_url") }}</LcButton>
      </div>
    </Form>
  </LcModal>
</template>
<style lang="scss">
.lc-generator-short-url {
  &-title {
    font-size: var(--text-sm-font-size);
    line-height: var(--text-sm--line-height);
    font-weight: var(--font-weight-medium);
    margin-top: var(--space-4);
  }

  &-box {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-4);
  }

  &-link {
    margin-right: var(--space-4);
    font-size: var(--text-sm-font-size);
  }

  &-icon {
    color: var(--clr-gray-400);
  }

  .field--wrapper {
    width: 400px;
    max-width: 100%;
    margin-top: var(--space-5);
  }

  &-actions {
    display: flex;
    justify-content: center;
    margin-top: var(--space-8);

    .btn {
      margin: 0 var(--space-2);
    }
  }

  &-modal {
    &-link {
      display: flex;
      align-items: center;
      margin-top: var(--space-2);

      &-text {
        font-size: var(--text-sm-font-size);
      }
    }
  }
}
</style>
