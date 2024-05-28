<script setup lang="ts">
import UserPlus from "~/assets/icons/icon-user-plus.svg?component"
import Plus from "~/assets/icons/icon-plus.svg?component"
import { useSessionStore } from "~/stores/session"

const showCustomerForm = ref(false)
const sessionStore = useSessionStore()

const openCustomerForm = () => {
  showCustomerForm.value = true
}

const closeCustomerForm = () => {
  showCustomerForm.value = false
}

const customerFormCallback = () => {
  sessionStore.loadCurrentUser()
  closeCustomerForm()
}
</script>
<template>
  <LcCard class="card-spaced">
    <LcCardHeader :title="$t('dashboard.add_company.title')" />
    <LcCardContent>
      <p>
        {{ $t("dashboard.add_company.content") }}
      </p>
    </LcCardContent>
    <LcCardActions>
      <LcButton
        class="add-customer-button"
        :icon="Plus"
        @click="openCustomerForm"
        >{{ $t("common.add_company") }}</LcButton
      >
    </LcCardActions>
    <LcModal
      :show="showCustomerForm"
      :icon="UserPlus"
      :title="$t('common.add_new_customer')"
      @close="closeCustomerForm"
    >
      <CustomerForm
        :current-mail="sessionStore.getCurrentUser?.email"
        :customer-id="undefined"
        :callback="customerFormCallback"
        @close="closeCustomerForm"
      />
    </LcModal>
  </LcCard>
</template>

<style lang="scss">
.add-customer-button {
  margin-left: auto;
}

.card-spaced {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
</style>
