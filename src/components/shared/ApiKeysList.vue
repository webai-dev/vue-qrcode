<script setup lang="ts">
import useClipboard from "vue-clipboard3"
import { useApiKeysStore } from "~/stores/api-keys"
import type { TableColumn } from "~/components/base/LcTable.vue"
import PlusIcon from "~/assets/icons/icon-plus-xl.svg?component"
import DeleteIcon from "~/assets/icons/icon-delete.svg?component"
import CircleCheck from "~/assets/icons/icon-circle-check.svg?component"
import Warning from "~/assets/icons/icon-warning.svg?component"
import { useNotificationsStore } from "~/stores/notifications.store"

import type { ApiKeyDTO } from "~/stores/api-keys"
import { useSessionStore } from "~/stores/session"
import { useCustomerStore } from "~/stores/customer"
import type { ICustomer } from "~/types/stores/ICustomer"

const { t } = useI18n()

const notificationsStore = useNotificationsStore()

interface ApiKeyRow {
  date: string
  prefix: string
  id: string
}

const props = defineProps<{
  customer?: ICustomer
}>()

const route = useRoute()

const { toClipboard } = useClipboard()
const apiKeysStore = useApiKeysStore()
const sessionStore = useSessionStore()

const customerId = computed(() =>
  route.params.customerId
    ? (route.params.customerId as string)
    : (sessionStore.getSelectedCustomerId as string),
)

const isApiCopyDialogOpen = ref<boolean>(false)
const isApiDeleteDialogOpen = ref<boolean>(false)

const apiCopyDialogValue = ref<string>("")
const apiKeyToDelete = ref<string>("")

const apiKeys = ref<ApiKeyDTO[]>([])
const columns = ref<TableColumn[]>([
  { key: "date", title: t("common.date"), wrapMobile: true },
  { key: "prefix", title: t("api_keys_list.api_key_prefix"), wrapMobile: true },
  { key: "actions", title: "" },
])

const apiKeyRows = ref<ApiKeyRow[]>([])

onMounted(() => {
  getKeysList()
})

async function getKeysList() {
  if (customerId.value) {
    try {
      apiKeys.value = await apiKeysStore.list(customerId.value)

      apiKeyRows.value = mapApiKeyRows(apiKeys.value)
    } catch (err) {
      notificationsStore.setError(
        t("api_keys_list.could_not_fetch_api_keys_list"),
        t("common.api_keys"),
      )
    }
  }
}

function mapApiKeyRows(apiKeys: ApiKeyDTO[]): ApiKeyRow[] {
  return apiKeys.map((apiKey) => ({
    date: new Date(apiKey.createdAt).toLocaleDateString("de-DE"),
    prefix: apiKey.prefix,
    id: apiKey.id,
  }))
}

async function addApiKey() {
  try {
    const createdApiKey = await apiKeysStore.add(customerId.value)

    apiCopyDialogValue.value = createdApiKey.key

    getKeysList()

    isApiCopyDialogOpen.value = true
  } catch (err) {
    notificationsStore.setError(
      t("api_keys_list.could_not_add_api_key"),
      t("common.api_keys"),
    )
  }
}

function closeApiKeyModal() {
  isApiCopyDialogOpen.value = false
  apiCopyDialogValue.value = ""
}

function copyApiKey() {
  toClipboard(apiCopyDialogValue.value)
  notificationsStore.setSuccess(
    t("api_keys_list.{value} copied to clipboard", {
      value: apiCopyDialogValue.value,
    }),
    t("api_keys_list.copied"),
  )
}

async function deleteApiKey(key: string) {
  try {
    await apiKeysStore.delete(customerId.value, key)
    notificationsStore.setSuccess(
      t("api_keys_list.api_key_was_deleted"),
      t("common.api_keys"),
    )
    apiKeys.value = apiKeys.value.filter((apiKey) => apiKey.id !== key)
    apiKeyRows.value = mapApiKeyRows(apiKeys.value)
  } catch (err) {
    notificationsStore.setError(
      t("api_keys_list.could_not_delete_an_api_key"),
      t("common.api_keys"),
    )
  }
}

function onDeleteApiKey(key: string) {
  isApiDeleteDialogOpen.value = true
  apiKeyToDelete.value = key
}

function onCloseApiKeyDelete() {
  isApiDeleteDialogOpen.value = false
  apiKeyToDelete.value = ""
}

function onConfirmApiKeyDelete() {
  deleteApiKey(apiKeyToDelete.value)
  onCloseApiKeyDelete()
}
</script>
<template>
  <div class="lc-page-subtitle">{{ $t("common.api_keys") }}</div>
  <p style="max-width: 660px">
    {{ $t("api_keys_list.description1") }}
  </p>
  <div class="api-key-company-title">
    {{ $t("api_keys_list.your_company_id") }}
  </div>
  <div v-if="!!customerId" class="api-key-company-id">
    {{ customerId }}
  </div>
  <div v-else class="api-key-company-id">
    {{ $t("api_keys_list.description2") }}
  </div>
  <LcTableCard :title="$t('API Keys')">
    <template #header>
      <LcButton
        :disabled="!customerId"
        :icon="PlusIcon"
        size="md"
        @click="addApiKey"
      >
        {{ $t("api_keys_list.generate_new_api_key") }}
      </LcButton>
    </template>
    <template #table>
      <LcTable
        v-if="apiKeys.length"
        :columns="columns"
        :data="apiKeyRows"
        :has-actions="true"
        identifier="id"
      >
        <template #actions="{ item }">
          <div class="lc-table-actions">
            <DeleteIcon
              class="lc-table-action-icon"
              @click="onDeleteApiKey(item.id)"
            />
          </div>
        </template>
      </LcTable>
    </template>
  </LcTableCard>
  <LcDialog
    :show="isApiCopyDialogOpen"
    :icon="CircleCheck"
    :headline="$t('api_keys_list.copy_dialog.headline')"
    :description="$t('api_keys_list.copy_dialog.description')"
    :cancel-label="$t('common.close')"
    :confirm-label="$t('api_keys_list.copy_api_key')"
    @close="closeApiKeyModal"
    @confirm="copyApiKey"
  >
    <LcFormItem name="api-key" :label="$t('common.api_key')">
      <LcInput :disabled="true" :model-value="apiCopyDialogValue"></LcInput>
    </LcFormItem>
  </LcDialog>
  <LcDialog
    :show="isApiDeleteDialogOpen"
    :icon="Warning"
    :headline="$t('api_keys_list.delete_dialog.headline')"
    :destructive="true"
    :confirm-label="$t('api_keys_list.delete_api.key')"
    @close="onCloseApiKeyDelete"
    @confirm="onConfirmApiKeyDelete"
  >
    <p>{{ $t("api_keys_list.delete_dialog.description") }}</p>
  </LcDialog>
</template>

<style lang="scss">
.api-key-company {
  &-title {
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-2);
  }

  &-id {
    color: var(--clr-gray-500);
    margin-bottom: var(--space-10);
  }
}
</style>
