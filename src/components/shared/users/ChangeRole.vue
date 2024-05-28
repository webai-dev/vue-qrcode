<script lang="ts" setup>
import { Form } from "vee-validate"
import { storeToRefs } from "pinia"
import { useUtilityStore } from "~/stores/utility"
import { useCustomerStore } from "~/stores/customer"
import LcDropdown from "~/components/base/LcDropdown.vue"
import { getRoleDisplayName, getRoleName } from "~/constants/permissions"

const props = defineProps<{
  currentRole: string
  customerId: string
  userId: string
  changeCallback: Function
}>()

const emits = defineEmits<{
  (e: "close"): void
}>()

const utilityStore = useUtilityStore()
const customerStore = useCustomerStore()
const { roles } = storeToRefs(utilityStore)

// refs
const role = ref(getRoleDisplayName(props.currentRole))
const roleNames = computed(() =>
  Object.keys(roles.value)
    .map((name) => getRoleDisplayName(name))
    .filter((rol) => rol !== String(role.value)),
)

const changeRole = () => {
  customerStore.updateCustomerUserRole(
    props.customerId,
    props.userId,
    { role: getRoleName(role.value) as string },
    props.changeCallback,
  )
  emits("close")
}

onBeforeMount(() => {
  if (!Object.keys(roles.value).length) utilityStore.getRoles()
})
</script>
<template>
  <LcFormItem v-slot="{ meta }" name="role" :label="$t('Role')">
    <LcDropdown
      v-model="role"
      :meta="meta"
      :placeholder="$t('Select role')"
      :label="$t('common.role')"
      :options="roleNames"
      name="role"
    />
  </LcFormItem>
  <LcActionButtons>
    <LcButton size="lg" variant="link" @click.prevent="emits('close')">
      {{ $t("common.cancel") }}
    </LcButton>
    <LcButton size="lg" type="submit" @click.prevent="changeRole">
      {{ $t("common.save") }}
    </LcButton>
  </LcActionButtons>
</template>
