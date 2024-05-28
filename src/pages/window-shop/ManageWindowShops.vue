<script setup lang="ts">
import { StreamBarcodeReader } from "vue-barcode-reader"
import { storeToRefs } from "pinia"
import type { ToRefs } from "vue"

import CreateShop from "./modals/CreateShop.vue"
import EditShop from "./EditShop.vue"
import { Role } from "~/constants/permissions"
import { useCustomerStore } from "~/stores/customer"
import { useWindowShopStore } from "~/stores/window-shop"
import Plus from "~/assets/icons/icon-plus-xl.svg?component"
import Pin from "~/assets/icons/icon-pin.svg?component"
import Edit from "~/assets/icons/icon-edit.svg?component"

import Delete from "~/assets/icons/icon-delete.svg?component"
import Left from "~/assets/icons/icon-left.svg?component"
import UserPlus from "~/assets/icons/icon-user-plus.svg?component"
import Warning from "~/assets/icons/icon-warning.svg?component"
import type { Column } from "~/types/types"
import { useNotificationsStore } from "~/stores/notifications.store"
import { useSessionStore } from "~/stores/session"

const { t } = useI18n()

const notificationsStore = useNotificationsStore()

// delete when customer switch is implemented
const customerStore = useCustomerStore()
const sessionStore = useSessionStore()

const currentShop = ref()

const router = useRouter()

const shopStore = useWindowShopStore()
const { isLoading, shops }: ToRefs<any> = storeToRefs(shopStore)
const shopList = ref([])

const hasShopRights = computed(
  () =>
    sessionStore.getCurrentRole !== Role.UserView &&
    sessionStore.getCurrentRole !== Role.Developer,
)

// pagination
const page = computed(() => shops.value.page)
const perPage = computed(() => shops.value.perPage)
const lastPage = computed(() => shops.value.lastPage)
const total = computed(() => shops.value.totalCount)

const cols = [
  { key: "name", title: t("common.name"), wrapMobile: true },
  { key: "shopId", title: t("common.id"), wrapMobile: true },
  { key: "action", title: "", customCellClass: "lc-hide-mobile" },
  { key: "actions", title: "" },
]
const columns = ref<Column[]>(cols)

const getShops = async (page?: number) => {
  try {
    if (sessionStore.getSelectedCustomerId) {
      shopList.value = await shopStore.getShops(
        {
          customerId: sessionStore.getSelectedCustomerId,
        },
        { page },
      )
    }
  } catch (error: any) {
    notificationsStore.setError(error?.response?.data?.message)
  }
}

const showAddShop = ref(false)
const toggleAddShop = () => {
  showAddShop.value = !showAddShop.value
}

const showEditShop = ref(false)
const toggleEditShop = () => {
  showEditShop.value = !showEditShop.value
}

const showDeleteShop = ref(false)
const toggleDeleteShop = () => {
  showDeleteShop.value = !showDeleteShop.value
}

const onDelete = (id: string) => {
  currentShop.value = id
  toggleDeleteShop()
}

const onEdit = (id: string) => {
  currentShop.value = id
  toggleEditShop()
}

const onSubmit = (callback?: VoidFunction) => {
  callback && callback()
  getShops()
}

const deleteShop = async () => {
  try {
    if (sessionStore.getSelectedCustomerId) {
      await shopStore.deleteShop({
        shopId: currentShop.value,
        customerId: sessionStore.getSelectedCustomerId,
      })
      getShops()
      notificationsStore.setSuccess(
        t("window_shop.location_deleted_successfully"),
      )
    }
  } catch (err) {
    notificationsStore.setError(t("window_shop.could_not_delete_this_location"))
  } finally {
    toggleDeleteShop()
  }
}

// pagination
const onPageChange = (nextPage: number) => getShops(nextPage)

onMounted(() => {
  getShops()
})
</script>

<template>
  <LcPageTitle :title="$t('common.touchpoints')" />
  <div v-if="!sessionStore.getSelectedCustomerId" class="lc-page-description">
    {{ $t("window_shop.manage.description") }}
  </div>
  <LcTableCard :title="$t('common.locations')" paginated>
    <template v-if="hasShopRights" #header>
      <LcButton
        :disabled="!sessionStore.getSelectedCustomerId"
        size="md"
        :icon="Plus"
        @click="toggleAddShop"
      >
        {{ $t("window_shop.manage.add_location") }}
      </LcButton>
    </template>
    <template #table>
      <LcTable
        :columns="columns"
        :data="shopList"
        identifier="id"
        :is-loading="isLoading"
      >
        <template v-if="hasShopRights" #action="{ item }">
          <div class="lc-table-actions">
            <Delete @click="onDelete(item.id)" />
            <Edit @click="onEdit(item.id)" />
          </div>
        </template>
        <template #actions="{ item }">
          <div class="actions">
            <LcButton
              variant="link"
              :icon="Left"
              :trailing-icon="true"
              @click="router.push(`/app/touchpoint/${item.id}`)"
            >
              {{ $t("common.details") }}
            </LcButton>
          </div>
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
  <LcModal
    :show="showAddShop"
    :title="$t('window_shop.manage.add_new_location')"
    :icon="Pin"
    @close="toggleAddShop"
  >
    <CreateShop @submit="onSubmit(toggleAddShop)" @close="toggleAddShop" />
  </LcModal>

  <LcModal
    :show="showEditShop"
    title="Edit location"
    :description="$t('window_shop.manage.change_location_details')"
    :icon="UserPlus"
    @close="toggleEditShop"
    ><EditShop
      :customer-id="sessionStore.getSelectedCustomerId"
      :shop-id="currentShop"
      @submit="onSubmit"
      @close="toggleEditShop"
    />
  </LcModal>

  <LcDialog
    :show="showDeleteShop"
    :icon="Warning"
    :headline="$t('window_shop.manage.delete_location')"
    :description="$t('window_shop.manage.delete_location_including_articles')"
    :cancel-label="$t('common.cancel')"
    :confirm-label="$t('common.delete')"
    destructive
    @close="toggleDeleteShop"
    @confirm="deleteShop"
  />
</template>

<style lang="scss" scoped>
.actions {
  cursor: pointer;
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: end;
}

.lc-table-actions svg {
  cursor: pointer;
}
</style>
