<script lang="ts" setup>
import type { ToRefs } from "vue"
import { storeToRefs } from "pinia"
import { useCustomerStore } from "~/stores/customer"
import { useUtilityStore } from "~/stores/utility"
import EditIcon from "~/assets/icons/icon-edit.svg?component"
import type { ICustomer } from "~/types/stores/ICustomer"
import EditSquare from "~/assets/icons/icon-edit-square.svg?component"
import LcLoader from "~/components/base/LcLoader.vue"
import { i18n } from "~/modules/i18n"

const props = defineProps<{
  customer?: ICustomer
}>()

const customerStore = useCustomerStore()
const utilityStore = useUtilityStore()
const { customer, isDeOrActivating }: ToRefs<any> = storeToRefs(customerStore)
const { countries }: ToRefs<any> = storeToRefs(utilityStore)
const showEditCustomer = ref(false)
const showContextMenu = ref(false)

const toggleEditCustomer = () => {
  showEditCustomer.value = !showEditCustomer.value
}

const toggleContextMenu = () => {
  showContextMenu.value = !showContextMenu.value
}

const activationActionLabel = computed(() =>
  customer.value.deleted
    ? i18n.global.t("common.activate")
    : i18n.global.t("common.deactivate"),
)

const toggleActivation = () => {
  if (customer.value.deleted) {
    customerStore.activate({
      id: customer.value.id,
      callback: () => customerStore.getSingleCustomer(customer.value.id),
    })
  } else {
    customerStore.deactivate({
      id: customer.value.id,
      callback: () => customerStore.getSingleCustomer(customer.value.id),
    })
  }
}

const customerCountry = computed(() => {
  const countryItem = countries.value.find(
    (country: any) => country.code === customer.value.country.toUpperCase(),
  )
  return countryItem?.name || customer.value.country
})

onBeforeMount(() => {
  if (!countries.value.length) utilityStore.getCountryList()
})
</script>
<template>
  <div class="customer-contact-card">
    <div class="card-head">
      <span class="card-head__title">{{
        $t("customer.customer_and_contact")
      }}</span>
      <span class="card-head__actions">
        <EditIcon class="card-head__icon" @click="toggleEditCustomer" />
        <LcContextMenu :show-menu="showContextMenu" @toggle="toggleContextMenu">
          <li @click="toggleActivation">
            <div class="loader-wrapper">
              <LcLoader v-if="isDeOrActivating" size="xs" />
            </div>
            <span v-if="!isDeOrActivating">{{ activationActionLabel }}</span>
          </li>
        </LcContextMenu>
      </span>
    </div>
    <div class="card-body">
      <div class="card-body__title">
        <div>{{ customer.name }}</div>
        <div>{{ customer.address }}</div>
        <div>{{ `${customer.postCode} ${customer.city}` }}</div>
        <div>{{ customerCountry }}</div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-body__title">{{ $t("customer.contact_email") }}</div>
      <span class="card-body__text">{{ customer.contactMail }}</span>
    </div>
    <div class="card-body">
      <div class="card-body__title">{{ $t("customer.contact_phone") }}</div>
      <span class="card-body__text">{{ customer.contactPhone }}</span>
    </div>
  </div>
  <LcModal
    :show="showEditCustomer"
    :icon="EditSquare"
    :title="$t('customer.edit_customer_data')"
    @close="toggleEditCustomer"
  >
    <CustomerForm :customer-id="customer.id" @close="toggleEditCustomer" />
  </LcModal>
</template>
<style lang="scss">
.customer-contact-card {
  border-radius: 12px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(16, 24, 40, 0.1),
    0 1px 2px 0 rgba(16, 24, 40, 0.06);
  padding: var(--space-4);
  margin-bottom: var(--space-8);
}
.card {
  &-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-8);

    &__title {
      font-weight: var(--font-weight-semibold);
      font-size: var(--text-lg-font-size);
    }

    &__actions {
      display: flex;

      .loader-wrapper {
        display: flex;
        justify-content: center;
      }
    }

    &__icon {
      cursor: pointer;
    }

    .lc-context-icon {
      margin-left: var(--space-2);
    }
  }

  &-body {
    font-size: var(--text-sm-font-size);
    margin-bottom: var(--space-6);

    &__title {
      font-weight: var(--font-weight-semibold);
    }
  }
}
</style>
