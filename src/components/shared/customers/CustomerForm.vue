<script setup lang="ts">
import { Form } from "vee-validate"
import type { ToRefs } from "vue"
import { storeToRefs } from "pinia"
import { rules } from "~/modules/validationRules"
import { useCustomerStore } from "~/stores/customer"
import { useNotificationsStore } from "~/stores/notifications.store"
import LcDropdown from "~/components/base/LcDropdown.vue"
import { useUtilityStore } from "~/stores/utility"
import { useSessionStore } from "~/stores/session"
import "vue-select/dist/vue-select.css"
import type { Customer } from "~/types/types"
import LcFormItem from "~/components/base/LcFormItem.vue"
import { Role } from "~/constants/permissions"

const { t } = useI18n()
const notificationsStore = useNotificationsStore()

const props = defineProps<{
  customerId?: string
  hideEmailField?: boolean
  currentMail?: string
  callback?: Function
}>()

const emits = defineEmits<{
  (e: "close"): void
  (e: "submit"): void
}>()

// validation
rules()

// variables
const customerStore = useCustomerStore()
const sessionStore = useSessionStore()
const { customer }: ToRefs<any> = storeToRefs(customerStore)
const name = ref(props.customerId ? customer.value.name : "")
const address = ref(props.customerId ? customer.value.address : "")
const city = ref(props.customerId ? customer.value.city : "")
const postCode = ref(props.customerId ? customer.value.postCode : "")
const country = ref(props.customerId ? customer.value.country : "DE")
const contactPhone = ref(props.customerId ? customer.value.contactPhone : "")
const contactMail = ref(
  (props.customerId && customer.value.contactMail) || props.currentMail || "",
)
const adminFirstname = ref("")
const adminLastname = ref("")

// methods
const add = async () => {
  const payload = {
    name: name.value,
    address: address.value,
    postCode: postCode.value,
    city: city.value,
    state: "none",
    country: country.value,
    contactPhone: contactPhone.value,
    contactMail: contactMail.value,
    logo: "none.jpg",
  }
  if (props.customerId) {
    customerStore.edit(props.customerId, payload, () =>
      customerStore.getSingleCustomer(props.customerId as string),
    )
  } else {
    customerStore.add(payload, (data: Customer) => {
      if (adminFirstname.value && adminLastname.value && contactMail.value) {
        customerStore.invite(data.id as string, {
          email: contactMail.value,
          firstName: adminFirstname.value,
          lastName: adminLastname.value,
          role: Role.CustomerAdmin,
        })
      }
    })
  }
  emits("submit")
  props.callback && props.callback()
}
const utility = useUtilityStore()
const countries = ref()
const getCountries = async () => {
  try {
    const response = await utility.getCountryList()
    countries.value = response.data.map(
      (country: { code: string }) => country.code,
    )
  } catch {
    notificationsStore.setError(
      t("window_shop.could_not_load_list_of_countries"),
    )
  }
}

onBeforeMount(() => {
  getCountries()
  if (props.customerId) customerStore.getSingleCustomer(props.customerId, true)
})
</script>

<template>
  <Form
    class="form"
    :initial-values="props.customerId && customer"
    @submit="add"
  >
    <LcFormItem
      v-slot="{ field, meta }"
      name="name"
      :label="$t('common.name')"
      rules="required"
    >
      <LcInput v-model="name" v-bind="field" :meta="meta" />
    </LcFormItem>
    <div class="label">{{ $t("common.address") }}</div>
    <LcFormItem
      v-slot="{ field, meta }"
      name="address"
      :label="$t('customer.street_and_number')"
      rules="required"
    >
      <LcInput v-model="address" v-bind="field" :meta="meta" />
    </LcFormItem>
    <div class="form-row">
      <LcFormItem
        v-slot="{ field, meta }"
        name="city"
        :label="$t('common.city')"
        rules="required"
        class-name="form-row__city"
      >
        <LcInput v-model="city" v-bind="field" :meta="meta" />
      </LcFormItem>
      <LcFormItem
        v-slot="{ field, meta }"
        name="postCode"
        :label="$t('common.zip_code')"
        rules="required"
        class-name="form-row__zip"
      >
        <LcInput v-model="postCode" v-bind="field" :meta="meta" />
      </LcFormItem>
    </div>
    <div class="form-row">
      <LcFormItem v-slot="{ field, meta }" name="country" :label="$t('')">
        <LcDropdown
          v-model="country"
          v-bind="field"
          :meta="meta"
          :label="$t('common.country')"
          value="code"
          :options="countries"
          add-on="before"
        />
      </LcFormItem>
      <LcFormItem
        v-slot="{ field, meta }"
        name="contactPhone"
        :label="$t('common.phone_number')"
        rules="required|number"
        class-name="form-row__phone"
      >
        <LcInput
          v-model="contactPhone"
          v-bind="field"
          :meta="meta"
          addon-before
        />
      </LcFormItem>
    </div>
    <div v-if="!customerId && sessionStore.isAdmin" class="form-row">
      <LcFormItem
        v-slot="{ field, meta }"
        name="firstname"
        class-name="form-row__admin-name"
        :label="$t('customer.admin_firstname')"
        rules="required"
      >
        <LcInput v-model="adminFirstname" v-bind="field" :meta="meta" />
      </LcFormItem>
      <LcFormItem
        v-slot="{ field, meta }"
        name="lastname"
        class-name="form-row__admin-name"
        :label="$t('customer.admin_lastname')"
        rules="required"
      >
        <LcInput v-model="adminLastname" v-bind="field" :meta="meta" />
      </LcFormItem>
    </div>
    <LcFormItem
      v-if="!Boolean(props.hideEmailField) || !sessionStore.isAdmin"
      v-slot="{ field, meta }"
      name="contactMail"
      :label="$t('customer.admin_email_address')"
      rules="required|email"
      :annotation="$t('customer.invitation_is_sent_automatically')"
      :default-value="props.currentMail"
    >
      <LcInput v-model="contactMail" v-bind="field" :meta="meta" />
    </LcFormItem>

    <LcActionButtons>
      <LcButton size="lg" variant="link" @click.prevent="emits('close')">{{
        $t("common.cancel")
      }}</LcButton>
      <LcButton size="lg" type="submit">{{ $t("common.save") }}</LcButton>
    </LcActionButtons>
  </Form>
</template>

<style lang="scss">
.form {
  width: 100%;
  margin-bottom: var(--space-6);

  &-row {
    display: flex;
    width: 100%;

    &__city {
      margin-right: var(--space-3);
      width: 45%;
    }

    &__zip {
      width: 25%;
    }

    &__phone {
      width: calc(100% - 5rem);

      .label {
        margin-left: -5rem;
      }
    }

    &__admin-name {
      width: 40%;
      margin-right: var(--space-3);
    }
  }
}

.buttons {
  margin-top: var(--space-12);
}

.label {
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm--line-height);
  text-transform: capitalize;
  margin-bottom: var(--space-4);
  color: var(--clr-gray-700);
  font-weight: var(--font-weight-medium);
}
</style>
