<script setup lang="ts">
import { inject } from "vue"
import { Form } from "vee-validate"
import { rules } from "~/modules/validationRules"
import { useWindowShopStore } from "~/stores/window-shop"
import { useUtilityStore } from "~/stores/utility"
import { useNotificationsStore } from "~/stores/notifications.store"
import { useSessionStore } from "~/stores/session"
import { track } from "~/modules/tracking"

const { t } = useI18n()
const notificationsStore = useNotificationsStore()

rules()
const windowShop = useWindowShopStore()
const utilityStore = useUtilityStore()
const sessionStore = useSessionStore()

const emits = defineEmits<{
  (e: "close"): void
  (e: "submit"): void
}>()

const name = ref()
const shopId = ref()
const country = ref()
const countryList = ref()

const getCountries = async () => {
  const response = await utilityStore.getCountryList()
  countryList.value = response.data
}

const createNewShop = async () => {
  try {
    if (sessionStore.getSelectedCustomerId) {
      const response = await windowShop.createShop({
        shopId: shopId.value,
        customerId: sessionStore.getSelectedCustomerId,
        name: name.value,
        country: country.value.code,
      })
      emits("submit")

      if (response && response.data) {
        track("Create shop", {
          customerId: sessionStore.getSelectedCustomerId,
          date: response.data.createdAt,
        })
      }
    }
  } catch (err) {
    notificationsStore.setError(t("window_shop.could_not_create_new_location"))
  }
}

onBeforeMount(() => {
  getCountries()
})
</script>
<template>
  <Form class="form">
    <LcFormItem
      v-slot="{ field, meta }"
      name="country"
      :label="$t('window_shop.select_country')"
      rules="required"
    >
      <LcDropdown
        v-model="country"
        v-bind="field"
        :meta="meta"
        placeholder="-"
        :label="$t('common.name')"
        value="code"
        :options="countryList"
      />
    </LcFormItem>
    <LcFormItem
      v-slot="{ field, meta }"
      name="name"
      :label="$t('window_shop.location_name')"
      rules="required"
    >
      <LcInput
        v-model="name"
        v-bind="field"
        :meta="meta"
        type="text"
        :placeholder="$t('window_shop.city_or_location')"
      />
    </LcFormItem>
    <LcFormItem
      v-slot="{ field, meta }"
      name="locationId"
      :label="$t('common.id')"
      rules="required"
    >
      <LcInput v-model="shopId" v-bind="field" :meta="meta" type="text" />
    </LcFormItem>
    <LcActionButtons>
      <LcButton size="lg" variant="link" @click="emits('close')">{{
        $t("common.cancel")
      }}</LcButton>
      <LcButton size="lg" @click="createNewShop()">{{
        $t("window_shop.manage.add_location")
      }}</LcButton>
    </LcActionButtons>
  </Form>
</template>
<style lang="scss"></style>
