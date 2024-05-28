<script lang="ts" setup>
import type { ComputedRef } from "vue"
import IconBook from "~/assets/icons/icon-book.svg?component"
import LogoSimple from "~/assets/icons/icon-logo-simple-white.svg?component"
import IconAddLabel from "~/assets/icons/icon-add-label.svg?component"
import IconAllLabel from "~/assets/icons/icon-all-label.svg?component"
import IconAnalytics from "~/assets/icons/icon-analytics.svg?component"
import IconWorkspaces from "~/assets/icons/icon-workspaces.svg?component"
import { useSessionStore } from "~/stores/session"
import { useUtilityStore } from "~/stores/utility"

import { register } from "~/modules/tracking"

import type {
  ICurrentUser,
  ICurrentUserCustomers,
} from "~/types/stores/Session"
import { Role, generatorAllowedRoles } from "~/constants/permissions"
import { LabelsRoutesNamespaces } from "~/router/labels.routes"

const props = defineProps<{
  isMobile?: boolean
  menuCallback?: Function
}>()

const route = useRoute()

const sessionStore = useSessionStore()
const utilityStore = useUtilityStore()

const currentUser: ComputedRef<ICurrentUser | null> = computed(
  () => sessionStore.getCurrentUser,
)
const customers: ComputedRef<ICurrentUserCustomers[]> = computed(
  () => sessionStore.getCurrentUserCustomers,
)
const selectedCustomer: ComputedRef<ICurrentUserCustomers | undefined> =
  computed(() => sessionStore.getSelectedCustomer)
const isCustomerAdmin: ComputedRef<boolean> = computed(
  () => selectedCustomer?.value?.role?.value === Role.CustomerAdmin,
)
const isEditor: ComputedRef<boolean> = computed(
  () => selectedCustomer?.value?.role?.value === Role.UserEdit,
)

const showCompanySwitchModal = ref(false)
const toggleCompanySwitchModal = () => {
  showCompanySwitchModal.value = !showCompanySwitchModal.value
}

const logout = () => {
  sessionStore.logout()
}

onMounted(() => {
  if (sessionStore.getCurrentUser) {
    register(sessionStore.getCurrentUser?.id)
  }
})

onBeforeMount(() => {
  if (!sessionStore.isCurrentUserFetched) {
    sessionStore.loadCurrentUser()
  }
})
</script>

<template>
  <div v-if="!utilityStore.isWholePageLayout" class="sidebar">
    <div class="sidebar-profile">
      <LcAvatar size="xl" class="sidebar-profile-avatar" />
      <div class="sidebar-profile-text">
        <div
          v-if="currentUser?.firstName || currentUser?.lastName"
          class="sidebar-profile-text__name"
        >
          {{
            `${currentUser && currentUser.firstName} ${
              currentUser && currentUser.lastName
            }`
          }}
        </div>
      </div>
      <h3 v-if="selectedCustomer" class="sidebar-profile-company-name">
        {{ sessionStore.isAdmin ? "Superadmin" : selectedCustomer?.name }}
      </h3>
    </div>
    <div class="sidebar-nav-container">
      <nav
        class="sidebar-nav customIcon__primary--300"
        @click="menuCallback && menuCallback()"
      >
        <router-link
          v-slot="{ isActive }"
          :to="{ name: LabelsRoutesNamespaces.add.main }"
        >
          <div
            :class="[
              'sidebar-nav__item',
              isActive && 'sidebar-nav__item--active',
            ]"
          >
            <IconAddLabel class="sidebar-nav__icon" />
            <span>{{ $t("navbar.add_label") }}</span>
          </div>
        </router-link>
        <router-link
          v-if="sessionStore.isAdmin"
          v-slot="{ isActive }"
          :to="{ name: 'app.customers' }"
        >
          <div
            :class="[
              'sidebar-nav__item',
              (isActive ||
                String(route?.name)?.includes('app.customerDetails')) &&
                'sidebar-nav__item--active',
            ]"
          >
            <IconBook class="sidebar-nav__icon" />
            <span>{{ $t("common.customers") }}</span>
          </div>
        </router-link>
        <router-link
          v-if="
            generatorAllowedRoles.includes(sessionStore.getCurrentRole as Role)
          "
          v-slot="{ isActive }"
          to="/app/generator"
        >
          <div
            :class="[
              'sidebar-nav__item',
              (isActive || String(route?.name)?.includes('app.generator')) &&
                'sidebar-nav__item--active',
            ]"
          >
            <IconAllLabel class="sidebar-nav__icon" />
            <span>{{ $t("navbar.all_labels") }}</span>
          </div>
        </router-link>
      </nav>

      <nav
        class="sidebar-nav customIcon__primary--300"
        @click="menuCallback && menuCallback()"
      >
        <router-link v-slot="{ isActive }" :to="{ name: 'app.dashboard' }">
          <div
            :class="[
              'sidebar-nav__item',
              isActive && 'sidebar-nav__item--active',
            ]"
          >
            <IconAnalytics class="sidebar-nav__icon" />
            <span>{{ $t("navbar.analytics") }}</span>
          </div>
        </router-link>
        <router-link
          v-if="isCustomerAdmin || sessionStore.isAdmin"
          v-slot="{ isActive }"
          to="/app/users"
        >
          <div
            :class="[
              'sidebar-nav__item',
              (isActive || String(route?.name)?.includes('app.userdetails')) &&
                'sidebar-nav__item--active',
            ]"
          >
            <LcIcon class="sidebar-nav__icon">group</LcIcon>
            <span>{{ $t("common.users") }}</span>
          </div>
        </router-link>
        <router-link v-slot="{ isActive }" to="/app/settings">
          <div
            :class="[
              'sidebar-nav__item',
              isActive && 'sidebar-nav__item--active',
            ]"
          >
            <LcIcon class="sidebar-nav__icon">settings</LcIcon>
            <span>{{ $t("common.settings") }}</span>
          </div>
        </router-link>
      </nav>

      <nav
        class="sidebar-nav customIcon__primary--300"
        @click="menuCallback && menuCallback()"
      >
        <div
          :class="[
            'sidebar-nav__item',
            showCompanySwitchModal && 'sidebar-nav__item--active',
          ]"
          @click="toggleCompanySwitchModal"
        >
          <IconWorkspaces class="sidebar-nav__icon" />
          <span>{{ $t("navbar.workspaces") }}</span>
        </div>
        <div :class="['sidebar-nav__item']" @click="logout">
          <LcIcon class="sidebar-nav__icon">logout</LcIcon>
          <span>{{ $t("navbar.logout") }}</span>
        </div>
      </nav>
    </div>
    <div class="sidebar-footer">
      <LogoSimple class="logo sidebar-logo" />
    </div>
    <LcModal
      title="Switch company"
      :show="showCompanySwitchModal"
      @close="toggleCompanySwitchModal"
    >
      <SwitchCustomerModal @close="toggleCompanySwitchModal" />
    </LcModal>
  </div>
</template>

<style lang="scss">
.sidebar {
  background-color: var(--clr-primary-900);
  box-sizing: border-box;
  padding: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @include mq("tablet") {
    padding: var(--space-10) var(--space-4) var(--space-12);
    grid-column: span 2;
  }

  @include mq("desktop") {
    grid-column: 1/4;
  }

  &-headline {
    color: var(--clr-white);
    font-weight: var(--font-weight-smibold);
  }
}

.logo {
  width: var(--space-10);
  height: var(--space-10);
  cursor: default;
  z-index: 1;
  color: white;
}

.sidebar-nav-container {
  padding: var(--space-16) 0 var(--space-8);
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: var(--space-6);

  @include mq("desktop") {
    row-gap: 2.75rem;
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  row-gap: 0.375rem;
}

.sidebar-nav,
.header-nav {
  font-size: var(--text-md-font-size);
  line-height: var(--text-md-line-height);
  color: var(--clr-primary-50);
  font-weight: var(--font-weight-medium);
  width: 100%;

  &__icon {
    width: 24px;
    color: var(--clr-primary-500);
    transition: all 0.3s;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: var(--space-2) var(--space-3);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;

    &--active,
    &:hover {
      background-color: var(--clr-primary-700);

      .sidebar-nav__icon {
        color: var(--clr-primary-100);
      }
    }
  }
}

.sidebar-footer {
  display: none;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;

  @include mq("tablet") {
    display: flex;
  }
}

.sidebar-profile {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  &-avatar {
    display: none;

    @include mq("desktop") {
      display: initial;
      margin-bottom: var(--space-3);
    }
  }

  &-text {
    color: var(--clr-white);
    font-size: var(--text-sm-font-size);
    font-weight: var(--font-weight-medium);
    flex: 1 1 auto;
    overflow: hidden;

    > div {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &-company-name {
    margin-top: var(--space-8);
    margin-bottom: 0;
    text-align: center;
    color: var(--clr-white);
    font-size: var(--display-xs-font-size);
    line-height: var(--display-xs-line-height);
    font-weight: var(--font-weight-semibold);

    @include mq("desktop") {
      font-size: var(--display-sm-font-size);
      line-height: var(--display-sm-line-height);
    }
  }

  &__logout {
    color: var(--clr-primary-300);
    margin-left: auto;
    cursor: pointer;
    align-self: flex-start;
    min-width: 18px;
  }
}
</style>
