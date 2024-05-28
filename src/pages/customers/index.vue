<script setup lang="ts">
import { storeToRefs } from "pinia"
import type { ToRefs } from "vue"
import { useCustomerStore } from "~/stores/customer"
import type { TableColumn } from "~/components/base/LcTable.vue"
import { humanDate } from "~/helpers/date"
import { IUser } from "~/types/types"
import { ICustomer } from "~/types/stores/ICustomer"
import UserPlus from "~/assets/icons/icon-user-plus.svg?component"
import PlusXl from "~/assets/icons/icon-plus-xl.svg?component"
import Left from "~/assets/icons/icon-left.svg?component"
import Dot from "~/assets/icons/icon-dot.svg?component"
import { i18n } from "~/modules/i18n"

// VARIABLES
const { t } = useI18n()
const router = useRouter()

// Store data
const customerStore = useCustomerStore()
const { customers, isLoading }: ToRefs<any> = storeToRefs(customerStore)
const customerId = ref("")

// pagination
const page = computed(() => customers.value.page)
const perPage = computed(() => customers.value.perPage)
const lastPage = computed(() => customers.value.lastPage)

const total = computed(() => customers.value.totalCount)
// table config

const columns = ref<TableColumn[]>([
  { key: "name", title: i18n.global.t("common.name"), wrapMobile: true },
  {
    key: "createdAt",
    title: i18n.global.t("common.date_created"),
    wrapMobile: true,
  },
  {
    key: "deleted",
    title: i18n.global.t("common.status"),
    customHeaderClass: "customers-table__xs",
    customCellClass: "lc-no-ellipsis",
  },
  {
    key: "actions",
    title: "",
    customHeaderClass: "customers-table__md",
    customCellClass: "lc-no-ellipsis",
  },
])

//  modals
const showAddCustomer = ref(false)

// METHODS
const fetchCustomerList = (page?: number) => {
  customerStore.getCustomers(undefined, undefined, page)
}

//  modals
const toggleAddCustomer = () => {
  showAddCustomer.value = !showAddCustomer.value
}

const onSubmit = () => {
  toggleAddCustomer()
  fetchCustomerList(page.value)
}

// pagination
const onPageChange = (nextPage: number) => fetchCustomerList(nextPage)

onBeforeMount(() => {
  fetchCustomerList()
})
</script>

<template>
  <LcPageTitle :title="$t('common.customers')" />
  <LcTableCard :title="$t('common.customers')" paginated>
    <template #header>
      <LcButton
        data-cy="customer-add"
        size="md"
        :icon="PlusXl"
        @click="toggleAddCustomer"
        >{{ $t("common.add_customer") }}</LcButton
      >
    </template>
    <template #table>
      <LcTable
        :columns="columns"
        :data="customers.data || []"
        identifier="id"
        :is-loading="isLoading"
      >
        <template #name="{ item }">
          <div class="company-name">
            <LcAvatar size="sm" />
            <span class="company-name__text">{{ item.name }}</span>
          </div>
        </template>
        <template #createdAt="{ item }">
          <span class="company-created-date">{{
            humanDate(item.createdAt)
          }}</span>
        </template>
        <template #deleted="{ item }">
          <span>
            <LcBadge
              :color="!item.deleted ? 'success' : ''"
              :icon="Dot"
              :text="item.deleted ? 'Disabled' : 'Active'"
            />
          </span>
        </template>
        <template #actions="{ item }">
          <div class="lc-table-actions">
            <LcButton
              variant="link"
              :icon="Left"
              :trailing-icon="true"
              @click="router.push(`/app/customer/${item.id}`)"
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
    :show="showAddCustomer"
    :title="$t('common.add_new_customer')"
    :icon="UserPlus"
    @close="toggleAddCustomer"
  >
    <CustomerForm @submit="onSubmit" @close="toggleAddCustomer" />
  </LcModal>
</template>

<style lang="scss" scoped></style>

<style lang="scss">
.button__add {
  display: flex;
  justify-content: start;
  padding: 0 24px 32px 0;

  @include mq("tablet") {
    justify-content: end;
  }
}
.customers-table__xs {
  width: 10%;
}

.customers-table__md {
  width: 20%;
}

.company-name {
  display: flex;
  align-items: center;

  &__text {
    white-space: nowrap;
    font-size: var(--text-md-font-size);
    color: var(--clr-gray-800);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .avatar-wrapper {
    margin-right: var(--space-4);
    flex: 0 1 auto;
  }
}
</style>
