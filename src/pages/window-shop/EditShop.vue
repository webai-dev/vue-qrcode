<script setup lang="ts">
import { Form } from "vee-validate"
import { storeToRefs } from "pinia"
import { useWindowShopStore } from "~/stores/window-shop"
import { rules } from "@/modules/validationRules"
import { useUtilityStore } from "~/stores/utility"
import { useNotificationsStore } from "~/stores/notifications.store"
import { useSessionStore } from "~/stores/session"
import LcLoader from "~/components/base/LcLoader.vue"
const { t } = useI18n()

const notificationsStore = useNotificationsStore()

rules()

const props = defineProps<{
  shopId: string
  editCallback?: Function
}>()

const windowShop = useWindowShopStore()
const utilityStore = useUtilityStore()
const sessionStore = useSessionStore()

const { isUpdating } = storeToRefs(windowShop)

const emits = defineEmits<{
  (e: "close"): void
  (e: "submit"): void
}>()

const countryList = ref<any[]>([])
const shopDetails = ref({
  id: "",
  shopId: "",
  name: "",
  country: { code: "", name: "" },
})

const getShopDetails = async () => {
  try {
    if (sessionStore.getSelectedCustomerId) {
      const response = await windowShop.getSingleShop({
        customerId: sessionStore.getSelectedCustomerId,
        shopId: props.shopId as string,
      })
      shopDetails.value = response.data

      shopDetails.value.country = countryList.value.find(
        (el) => el.code === response.data.country,
      )
    }
  } catch {
    notificationsStore.setError(
      t("window_shop.could_not_load_location_details"),
    )
  }
}

const editShop = async () => {
  if (sessionStore.getSelectedCustomerId) {
    await windowShop.editShop({
      customerId: sessionStore.getSelectedCustomerId,
      id: shopDetails.value.id,
      shopId: shopDetails.value.shopId,
      name: shopDetails.value.name,
      country: shopDetails.value.country?.code,
      callback: () => {
        props.editCallback && props.editCallback()
        emits("close")
        emits("submit")
      },
    })
  }
}

const getCountries = async () => {
  try {
    const response = await utilityStore.getCountryList()
    countryList.value = response.data
  } catch {
    notificationsStore.setError(
      t("window-shop.could_not_load_list_of_countries"),
    )
  }
}

onBeforeMount(async () => {
  await getCountries()
  getShopDetails()
})
</script>
<template>
  <Form class="form" :initial-values="shopDetails" @submit="editShop">
    <LcFormItem
      v-slot="{ field, meta }"
      name="shopId"
      :label="$t('common.id')"
      rules="required"
    >
      <LcInput
        v-model="shopDetails.shopId"
        v-bind="field"
        :meta="meta"
        :placeholder="$t('window_shop.enter_id')"
      />
    </LcFormItem>

    <LcFormItem
      v-slot="{ field, meta }"
      name="name"
      :label="$t('common.name')"
      rules="required"
    >
      <LcInput
        v-model="shopDetails.name"
        v-bind="field"
        :meta="meta"
        :placeholder="$t('window_shop.enter_location_name')"
      />
    </LcFormItem>

    <LcFormItem
      v-slot="{ field, meta }"
      name="country"
      :label="$t('common.country')"
      rules="required"
    >
      <LcDropdown
        v-model="shopDetails.country"
        v-bind="field"
        :value="shopDetails.country"
        :meta="meta"
        :placeholder="$t('window_shop.choose_country')"
        label="name"
        :options="countryList"
      />
    </LcFormItem>

    <LcActionButtons>
      <LcButton size="lg" variant="link" @click="emits('close')">{{
        $t("common.cancel")
      }}</LcButton>
      <LcButton size="lg" type="submit">
        <div v-if="isUpdating" class="loader-wrapper">
          <LcLoader size="xs" white />
        </div>
        <template v-if="!isUpdating">{{ $t("common.save_changes") }}</template>
      </LcButton>
    </LcActionButtons>
  </Form>
</template>
<style lang="scss">
.form {
  width: 100%;
}

.loader-wrapper {
  display: flex;
  justify-content: center;
}
</style>
