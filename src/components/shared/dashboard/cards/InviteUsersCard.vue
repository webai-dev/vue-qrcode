<script setup lang="ts">
import AddUser from "~/assets/icons/icon-add-user.svg?component"
import Plus from "~/assets/icons/icon-plus.svg?component"
const showInviteUser = ref(false)

const openInviteUser = () => {
  showInviteUser.value = true
}

const closeInviteUser = () => {
  showInviteUser.value = false
}
</script>
<template>
  <LcCard class="card-spaced">
    <LcCardHeader :title="$t('dashboard.invite_users')" />
    <LcCardActions>
      <LcButton class="add-user-button" :icon="Plus" @click="openInviteUser">{{
        $t("common.add_new_user")
      }}</LcButton>
    </LcCardActions>
    <LcModal
      :show="showInviteUser"
      :icon="AddUser"
      :title="$t('common.add_new_user')"
      @close="closeInviteUser"
    >
      <!-- TODO: only a temporary fix -->
      <InviteUsers customer-id="" @close="closeInviteUser" />
    </LcModal>
  </LcCard>
</template>

<style lang="scss">
.add-user-button {
  margin-left: auto;
}

.card-spaced {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
</style>
