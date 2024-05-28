<script lang="ts" setup>
import IconSwitch from "~/assets/icons/icon-switch.svg?component"
import SwitchCustomerModal from "~/components/shared/customers/SwitchCustomerModal.vue"
import LogoSimple from "~/assets/icons/icon-logo-simple.svg?component"

const props = defineProps<{
  companyName?: string
}>()

const showCompanySwitchModal = ref(false)
const toggleCompanySwitchModal = () => {
  showCompanySwitchModal.value = !showCompanySwitchModal.value
}
</script>

<template>
  <div class="lc-company-switch">
    <span class="lc-company-switch__current">{{ companyName }}</span>
    <span class="lc-company-switch-link" @click="toggleCompanySwitchModal">
      <span class="lc-company-switch-link__text">Switch</span>
      <IconSwitch />
    </span>
  </div>
  <LcModal
    title="Switch company"
    :icon="LogoSimple"
    :show="showCompanySwitchModal as boolean"
    @close="toggleCompanySwitchModal"
  >
    <SwitchCustomerModal @close="toggleCompanySwitchModal" />
  </LcModal>
</template>

<style lang="scss" scoped>
.lc-company-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-10) var(--space-3);
  box-sizing: border-box;
  &__current {
    color: var(--clr-primary-25);
    font-size: var(--text-md-font-size);
    font-weight: var(--font-weight-regular);
    margin-right: var(--space-2);
  }

  &-link {
    color: var(--clr-primary-300);
    font-size: var(--text-xs-font-size);
    font-weight: var(--font-weight-medium);
    display: flex;
    align-items: center;
    cursor: pointer;

    &__text {
      margin-right: var(--space-2);
    }
  }
}
</style>
