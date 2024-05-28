<script setup lang="ts">
import type { RouteRecordName } from "vue-router"
import type { LcTab } from "~/components/base/LcTabs.vue"
import { useSessionStore } from "~/stores/session"
import { Role, generatorEditAllowedRoles } from "~/constants/permissions"
import { TAB } from "~/constants/settingTabs"

const router = useRouter()
const sessionStore = useSessionStore()

const addIfTrue = (condition: boolean, value: any) => (condition ? [value] : [])

const activeTab = ref("")
const tabs: LcTab[] = [
  TAB.myAccount,
  ...addIfTrue(
    sessionStore.getCurrentRole !== Role.UserView &&
      sessionStore.getCurrentRole !== Role.UserEdit,
    TAB.apiKeys,
  ),
  ...addIfTrue(
    generatorEditAllowedRoles.includes(sessionStore.getCurrentRole as Role),
    TAB.urlSettings,
  ),
  // TAB.billing,
  TAB.termsOfUse,
]

const onRouteChanged = (route: RouteRecordName | undefined | null) => {
  const tab = tabs.find(({ url }) => url === route)
  activeTab.value = tab?.key || "my-account"
}

onMounted(() => {
  onRouteChanged(router.currentRoute.value.name)
})

router.beforeEach((to, _) => {
  onRouteChanged(to.name)
})

function changeTab(tabKey: string) {
  const tab = tabs.find(({ key }) => key === tabKey)

  if (tab) {
    activeTab.value = tab.key
    router.push({ name: tab.url })
  }
}
</script>
<script lang="ts">
export default {
  name: "SettingsIndex",
}
</script>
<template>
  <div class="lc-page-title lc-page-title--tight">
    {{ $t("common.settings") }}
  </div>
  <LcTabs
    v-if="!sessionStore.isAdmin"
    :tabs="tabs"
    :active-tab="activeTab"
    @tab-change="changeTab"
  />
  <router-view />
</template>

<style lang="scss"></style>
