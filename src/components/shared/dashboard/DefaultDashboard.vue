<script setup lang="ts">
import { useWindowShopStore } from "~/stores/window-shop"
import { useSessionStore } from "~/stores/session"
import InviteUsersCard from "~/components/shared/dashboard/cards/InviteUsersCard.vue"
import {
  Role,
  generatorAllowedRoles,
  shopAllowedRoles,
} from "~/constants/permissions"

const sessionStore = useSessionStore()
const windowShopStore = useWindowShopStore()

const isViewer = ref(false)
const isCustomerAdmin = ref(false)

const shopAllowed = computed(() =>
  shopAllowedRoles.includes(sessionStore.getCurrentRole as Role),
)

const updateRolesRefs = () => {
  isViewer.value = sessionStore.getCurrentRole === Role.UserView
  isCustomerAdmin.value = sessionStore.getCurrentRole === Role.CustomerAdmin
}

const updateShopsData = (customerId: string) =>
  shopAllowed.value && windowShopStore.getShops({ customerId }, { page: 1 })

onMounted(() => {
  if (sessionStore.getSelectedCustomerId) {
    updateRolesRefs()
    updateShopsData(sessionStore.getSelectedCustomerId)
  }
})

watch(
  () => sessionStore.getSelectedCustomerId,
  (selectedCustomerId) => {
    if (selectedCustomerId) {
      updateRolesRefs()
      updateShopsData(selectedCustomerId)
    }
  },
)
</script>
<template>
  <LcCardContainer>
    <template v-if="shopAllowed">
      <NothingHereYet
        v-if="isViewer && windowShopStore.shops.data.length === 0"
        class="dashboard-card"
      />
      <AddCompanyCard
        v-else-if="
          sessionStore.getCurrentUserCustomers &&
          sessionStore.getCurrentUserCustomers.length === 0
        "
        class="dashboard-card"
      />
      <SetUpYourShopCard
        v-else-if="windowShopStore.shops.data.length === 0"
        class="dashboard-card"
      />
      <ManageYourWindowShop v-else class="dashboard-card" />
    </template>
    <InviteUsersCard
      v-if="isCustomerAdmin && sessionStore.getCurrentUserCustomers.length > 0"
      :customer-id="sessionStore.getSelectedCustomerId"
      class="dashboard-card"
    />
    <GeneratorCard
      v-if="generatorAllowedRoles.includes(sessionStore.getCurrentRole as Role)"
      class="dashboard-card"
    />
  </LcCardContainer>
</template>

<style lang="scss" scoped>
.dashboard-card {
  flex: 1;
  flex-basis: 330px;
  min-height: 235px;
  @media screen and (min-width: 1085px) {
    max-width: 50%;
  }
}
</style>
