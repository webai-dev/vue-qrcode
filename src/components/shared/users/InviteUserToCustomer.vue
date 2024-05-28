<script lang="ts" setup>
import { Form } from "vee-validate"
import { storeToRefs } from "pinia"
import { rules } from "~/modules/validationRules"
import { useCustomerStore } from "~/stores/customer"
import { useUtilityStore } from "~/stores/utility"
import { useNotificationsStore } from "~/stores/notifications.store"
import { getRoleDisplayName, getRoleName } from "~/constants/permissions"
import LcDropdown from "~/components/base/LcDropdown.vue"
import LcSuggestion from "~/components/base/LcSuggestion.vue"
import type { ISuggest } from "~/components/base/LcSuggestion.vue"
import type { ICustomer } from "~/types/stores/ICustomer"
import type { IUser } from "~/types/types"

const { t } = useI18n()
const notificationsStore = useNotificationsStore()

const props = defineProps<{
  user: IUser
  inviteCallback?: Function
}>()

const emits = defineEmits<{
  (e: "close"): void
}>()

// validation
rules()

// store data
const customerStore = useCustomerStore()
const utilityStore = useUtilityStore()
const { roles } = storeToRefs(utilityStore)
const { customers, isLoading } = storeToRefs(customerStore)

const customerNames: any = computed(() =>
  customers.value?.data?.map((c: ICustomer) => ({
    name: c.name,
    id: c.id,
  })),
)

const roleNames = computed(() =>
  Object.keys(roles.value).map((name) => getRoleDisplayName(name)),
)

// refs
const customerInput = ref("")
const isTyping = ref(false)
const selectedCustomerId = ref()
const role = ref()

// methods
const onSelect = (suggest: ISuggest | null) => {
  customerInput.value = suggest?.name || ""
  selectedCustomerId.value = suggest?.id
  customerStore.resetCustomers()
}

let timeoutId: any = null
const onUserInput = (event: any) => {
  customerInput.value = event.target.value
  clearTimeout(timeoutId)
  if (event.target.value.length < 3) {
    customerStore.resetCustomers()
    isTyping.value = false
  }
  if (event.target.value.length >= 3) {
    isTyping.value = true
    timeoutId = setTimeout(() => {
      customerStore.getCustomers(event.target.value)
      isTyping.value = false
    }, 500)
  }
}
const invite = async () => {
  try {
    await customerStore.invite(
      selectedCustomerId.value,
      {
        email: props.user.email,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        role: getRoleName(role.value) || "",
      },
      props.inviteCallback,
    )
    emits("close")
    notificationsStore.setSuccess(
      t("users.invitation_sent"),
      t("common.customers"),
    )
  } catch {
    notificationsStore.setError(
      t("users.could_not_invite_user"),
      t("common.error"),
    )
  }
}

onBeforeMount(() => {
  utilityStore.getRoles()
})
</script>

<template>
  <Form class="form" @submit="invite">
    <LcFormItem
      v-slot="{ field, meta }"
      name="Customer"
      :label="$t('common.select_customer')"
      rules="required"
    >
      <LcSuggestion
        :text="customerInput"
        :suggestions="customerNames || []"
        :is-loading="isTyping || isLoading"
        @select="onSelect"
      >
        <LcInput
          v-model="customerInput"
          v-bind="field"
          :meta="meta"
          :placeholder="$t('-')"
          @input="onUserInput"
        />
      </LcSuggestion>
    </LcFormItem>

    <LcFormItem
      v-slot="{ field, meta }"
      name="role"
      :label="$t('common.role')"
      rules="required"
    >
      <LcDropdown
        v-model="role"
        v-bind="field"
        :meta="meta"
        :placeholder="$t('common.select_role')"
        label="role"
        :options="roleNames"
      />
    </LcFormItem>
    <LcActionButtons>
      <LcButton size="lg" variant="link" @click.prevent="emits('close')">
        {{ $t("common.cancel") }}
      </LcButton>
      <LcButton size="lg" type="submit">{{ $t("common.invite") }}</LcButton>
    </LcActionButtons>
  </Form>
</template>

<style lang="scss">
.form {
  width: 100%;
}
</style>
