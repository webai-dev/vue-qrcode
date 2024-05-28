<script setup lang="ts">
import { useSessionStore } from "~/stores/session"
import LcIcon from "~/components/base/LcIcon.vue"

const sessionStore = useSessionStore()

onBeforeMount(() => {
  sessionStore.loadCurrentUser()
})
</script>

<template>
  <LcPageTitle
    :title="
      $t('dashboard.hello_{username}', {
        username: sessionStore.getCurrentUserName,
      })
    "
  />
  <div data-cy="dashboard">
    <SuperAdminDashboard v-if="sessionStore.isAdmin" />
    <DefaultDashboard v-else />
  </div>
</template>

<style lang></style>
