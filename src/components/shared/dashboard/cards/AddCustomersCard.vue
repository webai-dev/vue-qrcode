<script setup lang="ts">
import UserPlus from "~/assets/icons/icon-user-plus.svg?component"
import Plus from "~/assets/icons/icon-plus.svg?component"

const showCustomerForm = ref(false)

const openCustomerForm = () => {
  showCustomerForm.value = true
}

const closeCustomerForm = () => {
  showCustomerForm.value = false
}
</script>
<template>
  <LcCard class="card-spaced">
    <LcCardHeader :title="$t('dashboard.add_first_customer')" />

    <LcCardActions>
      <LcButton
        class="add-customer-button"
        :icon="Plus"
        @click="openCustomerForm"
        >{{ $t("common.add_new_customer") }}</LcButton
      >
    </LcCardActions>
    <LcModal
      :show="showCustomerForm"
      :icon="UserPlus"
      :title="$t('common.add_new_customer')"
      @close="closeCustomerForm"
    >
      <CustomerForm @close="closeCustomerForm" />
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
