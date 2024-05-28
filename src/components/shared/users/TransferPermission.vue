<script lang="ts" setup>
import { Form } from "vee-validate"
import type { ToRefs } from "vue"
import { storeToRefs } from "pinia"
import { useUsersStore } from "~/stores/users"
import type { ISuggest } from "~/components/base/LcSuggestion.vue"
import type { IUser } from "~/types/types"
import { useCustomerStore } from "~/stores/customer"

const props = defineProps<{
  customerId: string
  transferCallback?: Function
}>()

const emits = defineEmits<{
  (e: "close"): void
}>()

const userInput = ref("")
const isTyping = ref(false)
const userStore = useUsersStore()
const customerStore = useCustomerStore()
const { modalUserList, isLoading }: ToRefs<any> = storeToRefs(userStore)
const selectedUserId = ref()
const newAdminId = ref()

const userNames: any = computed(() =>
  modalUserList.value?.map((u: IUser) => ({
    name: `${u.firstName} ${u.lastName}`,
    id: u.id,
  })),
)

const onSelect = (suggest: ISuggest | null) => {
  userInput.value = suggest?.name || ""
  newAdminId.value = suggest?.id
  userStore.resetUsersOfCustomer({ modal: true })
}

let timeoutId: any = null
const onUserInput = (event: any) => {
  userInput.value = event.target.value
  clearTimeout(timeoutId)
  if (event.target.value.length < 3) {
    userStore.resetUsersOfCustomer({ modal: true })
    isTyping.value = false
  }
  if (event.target.value.length >= 3) {
    isTyping.value = true
    timeoutId = setTimeout(() => {
      userStore.getUsersOfCustomer({
        clientId: props.customerId,
        preventLoader: true,
        name: event.target.value,
        modal: true,
      })
      isTyping.value = false
    }, 500)
  }
}

const changeRole = () => {
  customerStore.updateCustomerUserRole(
    props.customerId,
    newAdminId.value,
    { role: "CustomerAdmin" },
    props.transferCallback,
  )
  emits("close")
}
</script>
<template>
  <Form class="form" @submit="changeRole">
    <LcFormItem
      v-slot="{ field, meta }"
      name="Select new admin"
      :label="$t('customer.select_new_admin')"
    >
      <LcSuggestion
        :text="userInput"
        :suggestions="userNames || []"
        :is-loading="isTyping || isLoading"
        @select="onSelect"
      >
        <LcInput
          v-model="userInput"
          v-bind="field"
          :meta="meta"
          placeholder="-"
          @input="onUserInput"
        />
      </LcSuggestion>
    </LcFormItem>
    <LcActionButtons>
      <LcButton size="lg" variant="link" @click.prevent="emits('close')">
        {{ $t("common.cancel") }}
      </LcButton>
      <LcButton size="lg" @click="changeRole">
        {{ $t("common.save") }}
      </LcButton>
    </LcActionButtons>
  </Form>
</template>
