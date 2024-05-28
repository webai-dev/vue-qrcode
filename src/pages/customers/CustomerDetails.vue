<script lang="ts" setup>
import { storeToRefs } from "pinia"
import type { ToRefs } from "vue"
import { humanDate } from "~/helpers/date"
import { useCustomerStore } from "~/stores/customer"
import type { TableColumn } from "~/components/base/LcTable.vue"
import type { LcTab } from "~/components/base/LcTabs.vue"
import ArrowLeft from "~/assets/icons/icon-arrow-left.svg?component"
import { i18n } from "~/modules/i18n"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// store data
const customerStore = useCustomerStore()
const { customer, isLoading }: ToRefs<any> = storeToRefs(customerStore)

const activeTab = ref("")
const tabs: LcTab[] = [
  {
    key: "contact",
    text: i18n.global.t("customer.company_and_contact"),
    url: "app.customerDetails.contact",
  },
  {
    key: "api-keys",
    text: i18n.global.t("customer.api_keys"),
    url: "app.customerDetails.apiKeys",
  },
  {
    key: "users",
    text: i18n.global.t("customer.users"),
    url: "app.customerDetails.users",
  },
]

const changeTab = (tabKey: string) => {
  const tab = tabs.find(({ key }) => key === tabKey)

  if (tab) {
    activeTab.value = tab.key
    router.push({ name: tab.url })
  }
}

// hooks
onBeforeMount(() => {
  customerStore.getSingleCustomer(route.params.customerId as string)
  if (route.name === "app.customerDetails") {
    router.push({ name: "app.customerDetails.contact" })
  }
})

onMounted(() => {
  const currentRoute = router.currentRoute.value.name
  const tab = tabs.find(({ url }) => url === currentRoute)
  activeTab.value = tab?.key || "contact"
})
</script>
<template>
  <div class="customer-details">
    <LcButton
      class="btn-back"
      variant="link"
      :icon="ArrowLeft"
      @click="router.push('/app/customers')"
    >
      {{ $t("common.back") }}
    </LcButton>
    <template v-if="!isLoading">
      <LcPageTitle :title="customer.name" />
      <div class="customer-details__created-at">
        {{ `Created: ${humanDate(customer.createdAt)}` }}
      </div>
      <LcTabs :tabs="tabs" :active-tab="activeTab" @tab-change="changeTab" />
      <router-view :customer="customer" />
    </template>
    <div v-if="isLoading" class="load-wrapper">
      <LcLoader size="lg" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.btn-back {
  margin-left: -0.5rem;
}
.title {
  padding-top: var(--space-1);
  padding-bottom: var(--space-1);
}

.customer-details {
  &__created-at {
    margin-bottom: var(--space-8);
    color: var(--clr-gray-500);
    font-size: var(--text-sm-font-size);
  }
}
.load-wrapper {
  display: flex;
  padding: var(--space-10);
  align-items: center;
  justify-content: center;
}
</style>
