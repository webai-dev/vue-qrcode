<script lang="ts" setup>
import { storeToRefs } from "pinia"
import type { ToRefs } from "vue"
import { useUsersStore } from "~/stores/users"
import EditSquare from "~/assets/icons/icon-edit-square.svg?component"
import EditIcon from "~/assets/icons/icon-edit.svg?component"
import Switch from "~/assets/icons/icon-switch.svg?component"
import Link from "~/assets/icons/icon-link.svg?component"
import UserRemove from "~/assets/icons/icon-user-remove.svg?component"

import type { TableColumn } from "~/components/base/LcTable.vue"
import { colorMap, getRoleDisplayName } from "~/constants/permissions"
import type { ICustomer } from "~/types/stores/ICustomer"
import type { IUser } from "~/types/types"
import { useTransferPermission } from "~/composables/useTransferPermission"
import ArrowLeft from "~/assets/icons/icon-arrow-left.svg?component"
import PlusXl from "~/assets/icons/icon-plus-xl.svg?component"
import ArrowRight from "~/assets/icons/icon-arrow-right.svg?component"
import Dot from "~/assets/icons/icon-dot.svg?component"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const showEditUser = ref(false)
const showInviteUser = ref(false)
const showContextMenu = ref("")
const showChangeUserRole = ref(false)
const customerRoleToChange = ref()
const transferCustomerId = ref()
const showRemoveDialog = ref(false)

// store data
const userStore = useUsersStore()
const { user, isLoading }: ToRefs<any> = storeToRefs(userStore)

const {
  showTransferPermission,
  toggleTransferPermission,
  resetTransferPermission,
} = useTransferPermission([showChangeUserRole, showRemoveDialog])

const getUserDetails = (preventLoader?: boolean) => {
  userStore.getSingleUser(route.params.userId as string, preventLoader)
}

const toggleEditUser = () => {
  showEditUser.value = !showEditUser.value
}

const toggleInviteUser = () => {
  showInviteUser.value = !showInviteUser.value
}

const toggleChangeUserRole = (customer?: ICustomer) => {
  if (customer) customerRoleToChange.value = customer
  showChangeUserRole.value = !showChangeUserRole.value
  resetTransferPermission()
}

const toggleContextMenu = (item: IUser) => {
  if (showContextMenu.value === "") showContextMenu.value = item.id
  else showContextMenu.value = ""
}

const toggleRemoveUser = (customer?: ICustomer) => {
  if (customer) customerRoleToChange.value = customer
  showRemoveDialog.value = !showRemoveDialog.value
  resetTransferPermission()
}

const closeContextMenu = () => (showContextMenu.value = "")

const onConfirmRemoveUser = () => {
  userStore.deactivateUserOfCustomer({
    customerId: customerRoleToChange.value.id,
    userId: user.value.id,
    preventLoader: true,
    callBack: () => {
      getUserDetails(true)
      toggleRemoveUser()
    },
  })
}

const onGoToCompanyPage = () => {
  resetTransferPermission()
  router.push(`/app/customer/${customerRoleToChange.value.id}/users`)
}

const inviteCallback = () => userStore.getSingleUser(user.value.id, true)

// table config
const columns = ref<TableColumn[]>([
  { key: "name", title: t("common.company_name"), wrapMobile: true },
  { key: "role", title: t("common.role"), wrapMobile: true },
  { key: "action", title: "" },
])

// hooks
onBeforeMount(() => {
  getUserDetails()
})
</script>
<template>
  <div>
    <LcButton
      class="btn-back"
      variant="link"
      :icon="ArrowLeft"
      @click="router.push('/app/users')"
    >
      {{ $t("common.back") }}
    </LcButton>
    <template v-if="!isLoading">
      <LcPageTitle :title="`${user.firstName} ${user.lastName}`" />
      <div class="profile-card" data-cy="user-details">
        <div class="card-head">
          <span class="card-head__title">{{ $t("common.account") }}</span>
          <EditIcon
            class="card-head__icon"
            data-cy="user-edit"
            @click="toggleEditUser"
          />
        </div>
        <div class="card-body">
          <div class="card-body__title">{{ $t("common.email") }}</div>
          <span class="card-body__text">{{ user.email }}</span>
        </div>
        <div class="card-body">
          <div class="card-body__title">{{ $t("common.name") }}</div>
          <span class="card-body__text">{{
            `${user.firstName} ${user.lastName}`
          }}</span>
        </div>
      </div>
      <LcTableCard :title="$t('Companies')" paginated>
        <template #header>
          <LcButton variant="primary" :icon="PlusXl" @click="toggleInviteUser">
            {{ $t("users.Invite to another company") }}
          </LcButton>
        </template>
        <template #table>
          <LcTable :columns="columns" :data="user.customers" identifier="id">
            <template #name="{ item }">
              {{ item.name }}
            </template>
            <template #role="{ item }">
              <LcBadge
                :color="colorMap[item.role.value]"
                :icon="Dot"
                :text="getRoleDisplayName(item.role.value)"
              />
            </template>
            <template #action="{ item }">
              <div class="menu-wrapper">
                <LcContextMenu
                  :show-menu="showContextMenu === item.id"
                  data-cy="user-context-menu"
                  @toggle="toggleContextMenu(item)"
                  @close="closeContextMenu"
                >
                  <li @click="toggleRemoveUser(item)">
                    {{ $t("users.remove_relation") }}
                  </li>
                  <li @click="toggleChangeUserRole(item)">
                    {{ $t("users.change_role") }}
                  </li>
                </LcContextMenu>
              </div>
            </template>
          </LcTable>
        </template>
      </LcTableCard>
    </template>
    <div v-if="isLoading" class="load-wrapper">
      <LcLoader size="lg" />
    </div>
  </div>
  <LcModal
    :show="showEditUser"
    :icon="EditSquare"
    :title="$t('settings.edit_user_data')"
    @close="toggleEditUser"
  >
    <EditUser
      hide-role
      :user-id="user.id"
      :edit-callback="getUserDetails"
      @close="toggleEditUser"
    />
  </LcModal>
  <LcModal
    :show="showInviteUser"
    :icon="Link"
    :title="
      $t('users.invite {firstname} {lastname} to', {
        firstName: user.firstName,
        lastname: user.lastName,
      })
    "
    @close="toggleInviteUser"
  >
    <InviteUserToCustomer
      :user="user"
      :invite-callback="inviteCallback"
      @close="toggleInviteUser"
    />
  </LcModal>
  <LcModal
    :show="showChangeUserRole"
    :icon="EditSquare"
    :title="
      $t(
        'users.{firstname} {lastname}\'s permission in {customer_role_to_change_name}',
        {
          firstname: user.firstName,
          lastname: user.lastName,
          customer_role_to_change_name: customerRoleToChange?.name,
        },
      )
    "
    @close="toggleChangeUserRole"
  >
    <ChangeRole
      :current-role="customerRoleToChange?.role?.value"
      :customer-id="customerRoleToChange.id"
      :change-callback="() => getUserDetails(true)"
      :user-id="user.id"
      @close="toggleChangeUserRole"
    />
  </LcModal>
  <LcModal
    :show="showTransferPermission"
    :icon="Switch"
    :title="
      $t('users.show_transfer_permission_modal.title {name}', {
        name: customerRoleToChange?.name,
      })
    "
    :description="
      $t(
        'users.show_transfer_permission_modal.description {firstname} {lastname}',
        {
          firstname: user.firstName,
          lastname: user.lastName,
        },
      )
    "
    @close="toggleTransferPermission"
  >
    <LcActionButtons class="transfer-permission-buttons">
      <LcButton
        size="lg"
        variant="link"
        @click.prevent="toggleTransferPermission"
      >
        {{ $t("common.cancel") }}
      </LcButton>
      <LcButton
        size="lg"
        :icon="ArrowRight"
        trailing-icon
        @click="onGoToCompanyPage"
      >
        {{ $t("users.go_to_company_page") }}
      </LcButton>
    </LcActionButtons>
  </LcModal>
  <LcDialog
    :show="showRemoveDialog"
    :icon="UserRemove"
    :headline="
      $t(
        'users.deactivate_user_modal.remove {firstname} {lastname} from {customer_name}',
        {
          firstname: user?.firstName,
          lastName: user?.lastName,
          customer_name: customerRoleToChange?.name,
        },
      )
    "
    :confirm-label="$t('users.deactivate_user_modal.confirm')"
    @close="toggleRemoveUser"
    @confirm="onConfirmRemoveUser"
  >
    <p>{{ $t("users.remove_dialog.description") }}</p>
  </LcDialog>
</template>
<style lang="scss" scoped>
.btn-back {
  margin-left: -0.5rem;
}
.title {
  padding-top: var(--space-1);
  padding-bottom: var(--space-12);
}

.transfer-permission-buttons {
  margin-top: var(--space-2);
  margin-bottom: var(--space-4);
}

.profile-card {
  border-radius: 12px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(16, 24, 40, 0.1),
    0 1px 2px 0 rgba(16, 24, 40, 0.06);
  padding: var(--space-4);
  margin-bottom: var(--space-8);
}
.card {
  &-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-8);

    &__title {
      font-weight: var(--font-weight-semibold);
      font-size: var(--text-lg-font-size);
    }

    &__icon {
      cursor: pointer;
    }
  }

  &-body {
    font-size: var(--text-sm-font-size);
    margin-bottom: var(--space-6);

    &__text {
      font-weight: var(--font-weight-semibold);
    }
  }
}

.menu-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-right: var(--space-4);
}

.load-wrapper {
  display: flex;
  padding: var(--space-10);
  align-items: center;
  justify-content: center;
}
</style>
