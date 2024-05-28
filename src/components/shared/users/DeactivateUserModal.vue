<script setup lang="ts">
import UserPlusXl from "~/assets/icons/icon-user-plus-xl.svg?component"
import { useUsersStore } from "~/stores/users"

const props = defineProps<{
  show: boolean
  customerId: string
}>()

const emits = defineEmits<{
  (e: "close"): void
  (e: "deactivate"): void
}>()

// variables
const users = useUsersStore()

// methods
const closeModal = () => {
  emits("close")
}

const deactivate = async () => {
  await users.deactivate({ id: props.customerId })
  emits("deactivate")
  closeModal()
}
</script>

<template>
  <LcModal
    :show="props.show"
    :icon="UserPlusXl"
    :title="$t('users.deactivate_user')"
    :description="$t('users.info_about_what_this_action_does')"
    @close="closeModal"
  >
    <template #actions>
      <LcButton size="lg" variant="secondary-gray" @click="closeModal">{{
        $t("common.cancel")
      }}</LcButton
      ><LcButton size="lg" destructive @click="deactivate">{{
        $t("common.deactivate")
      }}</LcButton>
    </template>
  </LcModal>
</template>

<style lang></style>
