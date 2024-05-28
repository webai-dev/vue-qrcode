<script setup lang="ts">
import { useCustomerStore } from "~/stores/customer"

const customerStore = useCustomerStore()

onBeforeMount(() => {
  customerStore.getCustomers()
})
</script>
<template>
  <div>
    <LcCardContainer class="dashboard-card-container">
      <AddCustomersCard
        v-if="customerStore.customers.totalCount === 0"
        class="dashboard-card"
      />
      <YourCustomersCard v-else class="dashboard-card" />
      <InviteUsersCard class="dashboard-card" />
    </LcCardContainer>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-card-container {
  min-height: 200px;
}

.dashboard-card {
  flex: 1;
  flex-basis: 330px;
  min-height: 235px;
  @media screen and (min-width: 1085px) {
    max-width: 50%;
  }
}
</style>
