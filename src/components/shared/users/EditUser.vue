<script setup lang="ts">
import { Form } from "vee-validate"
import { storeToRefs } from "pinia"
import { rules } from "~/modules/validationRules"
import { useUsersStore } from "~/stores/users"
import { useSessionStore } from "~/stores/session"
import { useCustomerStore } from "~/stores/customer"
import { useNotificationsStore } from "~/stores/notifications.store"
import { useUtilityStore } from "~/stores/utility"
import { getRoleDisplayName, getRoleName } from "~/constants/permissions"
import { getSelectedCustomersUserRole } from "~/helpers/getselectedCustomersUserRole"
import type { ICustomer } from "~/types/stores/ICustomer"
const { t } = useI18n()

const notificationsStore = useNotificationsStore()

const props = defineProps<{
  userId?: string
  customerId?: string
  hideRole?: boolean
  editCallback?: Function
}>()

const emits = defineEmits<{
  (e: "close"): void
  (e: "submit"): void
}>()

// validation
rules()

// store data
const usersStore = useUsersStore()
const utilityStore = useUtilityStore()
const customerStore = useCustomerStore()
const sessionStore = useSessionStore()
const { roles } = storeToRefs(utilityStore)
const { user }: any = storeToRefs(usersStore)
const newUserData = ref(user.value)
const role = ref("")

watch(user, (newVal, oldVal) => {
  if (
    (!oldVal.id && newVal.id && !newUserData.value.id) ||
    oldVal?.id !== newVal.id
  ) {
    newUserData.value = newVal
  }
  if (newVal.customers) {
    const customer = newVal.customers.find(
      (cust: ICustomer) =>
        cust.id === (props.customerId || sessionStore.getSelectedCustomerId),
    )
    if (customer) {
      const roleName = customer.role.value
      role.value = getRoleDisplayName(roleName)
    }
  }
})

// refs
const roleNames = computed(() =>
  Object.keys(roles.value)
    .map((name) => getRoleDisplayName(name))
    .filter((r) => r !== String(role.value)),
)

// methods
const closeModal = () => {
  emits("close")
}

const edit = async () => {
  const oldRole = props.userId
    ? getSelectedCustomersUserRole(user.value)
    : sessionStore.getCurrentRole
  const newRole = getRoleName(role.value)
  const updateRole = oldRole !== newRole
  await usersStore.edit({
    id: newUserData.value.id,
    firstName: newUserData.value.firstName,
    lastName: newUserData.value.lastName,
    callback: () => {
      props.editCallback && props.editCallback()
      !props.userId && sessionStore.loadCurrentUser()
      closeModal()
    },
  })
  if (!props.hideRole && updateRole) {
    customerStore.updateCustomerUserRole(
      (props.customerId || sessionStore.getSelectedCustomerId) as string,
      newUserData.value.id,
      { role: newRole as string },
      props.editCallback,
    )
  }
}

const reset = () => {
  newUserData.value = user.value
  role.value = ""
}

// hooks
onBeforeMount(() => {
  if (props.userId) {
    usersStore.getSingleUser(props.userId, true)
  } else {
    newUserData.value = { ...sessionStore.getCurrentUser }
  }
  utilityStore.getRoles()
})

onUnmounted(() => {
  reset()
})
</script>

<template>
  <Form class="form" :initial-values="newUserData" @submit="edit">
    <LcFormItem
      v-slot="{ field, meta }"
      name="firstName"
      :label="$t('common.first_name')"
      rules="required"
    >
      <LcInput
        v-model="newUserData.firstName"
        v-bind="field"
        :meta="meta"
        :placeholder="$t('common.enter_first_name')"
      />
    </LcFormItem>

    <LcFormItem
      v-slot="{ field, meta }"
      name="lastName"
      :label="$t('common.last_name')"
      rules="required"
    >
      <LcInput
        v-model="newUserData.lastName"
        v-bind="field"
        :meta="meta"
        :placeholder="$t('common.enter_last_name')"
      />
    </LcFormItem>
    <LcFormItem
      v-slot="{ field, meta }"
      name="email"
      :label="$t('common.email')"
      rules="required"
    >
      <LcInput
        v-model="newUserData.email"
        v-bind="field"
        :meta="meta"
        disabled
        :placeholder="$t('common.enter_email')"
      />
    </LcFormItem>
    <LcFormItem
      v-if="!hideRole"
      v-slot="{ field, meta }"
      name="role"
      :label="$t('common.role')"
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
      <LcButton size="lg" type="submit">
        {{ $t("common.save_changes") }}
      </LcButton>
    </LcActionButtons>
  </Form>
</template>

<style lang="scss" scoped>
.form {
  width: 100%;
}
</style>
