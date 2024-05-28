<script lang="ts" setup>
import { storeToRefs } from "pinia"
import type { ComputedRef } from "vue"
import IconArrowRight from "~/assets/icons/icon-arrow-right.svg?component"
import { useSessionStore } from "~/stores/session"

import type {
  ICurrentUser,
  ICurrentUserCustomers,
} from "~/types/stores/Session"

const emits = defineEmits<{
  (e: "close"): void
}>()

const sessionStore = useSessionStore()

const switchCompany = async (customer: ICurrentUserCustomers) => {
  await sessionStore.switchCustomer(customer.id)
  window.location.reload()
  emits("close")
}
</script>

<template>
  <div
    v-if="sessionStore.getCurrentUserCustomers?.length"
    class="switch-customer"
  >
    <template
      v-for="customer in sessionStore.getCurrentUserCustomers"
      :key="customer.id"
    >
      <div
        v-if="customer?.id !== sessionStore.getSelectedCustomerId"
        class="switch-customer-item"
        @click="() => switchCompany(customer)"
      >
        <span>{{ customer.name }}</span>
        <span
          v-if="
            sessionStore.getSelectedCustomerId !== customer.id ||
            !sessionStore.isSwitchCustomerLoading
          "
          class="switch-customer-item__link"
        >
          <span class="switch-customer-item__link-text">{{
            $t("common.switch")
          }}</span>
          <IconArrowRight />
        </span>
        <span
          v-else-if="
            sessionStore.getSelectedCustomerId === customer.id &&
            sessionStore.isSwitchCustomerLoading
          "
          class="switch-customer-item__link"
        >
          <LcLoader size="sm" />
        </span>
      </div>
    </template>
    <LcButton variant="link" @click="emits('close')">
      {{ $t("customer.keep_current_company") }}
    </LcButton>
  </div>
</template>

<style lang="scss" scoped>
.switch-customer {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-item {
    border-radius: 0.75rem;
    padding: var(--space-4) var(--space-5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-4);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(16, 24, 40, 0.1),
      0 1px 2px rgba(16, 24, 40, 0.06);
    cursor: pointer;
    box-sizing: border-box;
    width: 100%;

    &__link {
      color: var(--clr-primary-600);
      font-size: var(--text-sm-font-size);
      display: flex;
      align-items: center;

      &-text {
        margin-right: var(--space-1);
      }
    }

    &:hover {
      background-color: var(--clr-primary-25);
    }
  }

  .btn {
    margin-top: var(--space-6);
  }
}
</style>
