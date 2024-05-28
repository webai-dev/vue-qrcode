<script setup lang="ts">
import type { ComputedRef } from "vue"
import { storeToRefs } from "pinia"
import Edit from "~/assets/icons/icon-edit.svg?component"
import Delete from "~/assets/icons/icon-delete.svg?component"
import { useNotificationsStore } from "~/stores/notifications.store"
import { useUsersStore } from "~/stores/users"
import { useSessionStore } from "~/stores/session"

import { colorMap, getRoleDisplayName, Role } from "~/constants/permissions"
import type { TableColumn } from "~/components/base/LcTable.vue"
import type { IUser } from "~/types/types"
import type { ICustomer } from "~/types/stores/ICustomer"
import { useTransferPermission } from "~/composables/useTransferPermission"
import AddUser from "~/assets/icons/icon-user-plus.svg?component"
import EditSquare from "~/assets/icons/icon-edit-square.svg?component"
import DeactivateUser from "~/assets/icons/icon-deactivate-user.svg?component"
import Warning from "~/assets/icons/icon-warning.svg?component"
import PlusXl from "~/assets/icons/icon-plus-xl.svg?component"
import Left from "~/assets/icons/icon-left.svg?component"
import Dot from "~/assets/icons/icon-dot.svg?component"

const { t } = useI18n()
const notificationsStore = useNotificationsStore()
const router = useRouter()

// store data
const usersStore = useUsersStore()
const { isLoading, isDeleting, isActivating, customerUsers, users } =
  storeToRefs(usersStore)

const sessionStore = useSessionStore()

const isEditor: ComputedRef<boolean> = computed(
  () => sessionStore.getSelectedCustomer?.role?.value === Role.UserEdit,
)

// modals
const showEditUser = ref(false)
const showInviteUser = ref(false)
const showDeactivateUser = ref(false) // customer admin
const showContextMenu = ref("")
const userId = ref("")
const userItem = ref()
const {
  showTransferPermission,
  toggleTransferPermission,
  resetTransferPermission,
} = useTransferPermission([])

const list: any = computed(() =>
  sessionStore.isAdmin ? users.value : customerUsers.value,
)

// pagination
const page = computed(() => list.value.page)
const perPage = computed(() => list.value.perPage)
const lastPage = computed(() => list.value.lastPage)
const total = computed(() => list.value.totalCount)

// table config
const columns = ref<TableColumn[]>([
  {
    key: "name",
    title: t("common.name"),
    customHeaderClass: "users-table__md",
    wrapMobile: true,
  },
  {
    key: "email",
    title: t("common.email"),
    customHeaderClass: "users-table__md",
    wrapMobile: true,
  },
  sessionStore.isAdmin
    ? {
        key: "active",
        title: t("common.status"),
        customHeaderClass: "users-table__xs",
        customCellClass: "lc-no-ellipsis one-line",
        wrapMobile: true,
      }
    : {
        key: "access",
        title: t("common.access"),
        customHeaderClass: "users-table__sm",
        customCellClass: "lc-no-ellipsis one-line",
        wrapMobile: true,
      },
  {
    key: "invitation",
    title: t("common.invitation"),
    customHeaderClass: "users-table__sm",
    customCellClass: "lc-no-ellipsis one-line",
    wrapMobile: true,
  },
  {
    key: "actions",
    title: "",
    customHeaderClass: "users-table__sm",
    customCellClass: "lc-no-ellipsis lc-hide-mobile",
  },
])

isEditor.value && columns.value.pop()

// list users
const fetchUserList = (page?: number, preventLoader?: boolean) => {
  if (sessionStore.isAdmin) {
    usersStore.getUsers(page, preventLoader)
  } else {
    usersStore.getUsersOfCustomer({ onlyActive: true, page, preventLoader })
  }
}

const toggleInviteUser = () => {
  showInviteUser.value = !showInviteUser.value
}

const inviteCallBack = () => {
  if (sessionStore.isAdmin) {
    fetchUserList(users.value.page)
  } else {
    fetchUserList(customerUsers.value.page)
  }
}

const toggleEditUser = () => {
  showEditUser.value = !showEditUser.value
}

const openEditModal = (id: string) => {
  userId.value = id
  toggleEditUser()
}

const toggleDeactivateUser = () => {
  showDeactivateUser.value = !showDeactivateUser.value
}

const openDeactivateModal = (user: IUser) => {
  userItem.value = user
  userId.value = user.id
  toggleDeactivateUser()
}

const onDeactivate = async () => {
  if (sessionStore.getSelectedCustomerId) {
    usersStore.deactivateUserOfCustomer({
      customerId: sessionStore.getSelectedCustomerId,
      userId: userId.value,
      callBack: () => fetchUserList(page.value, true),
    })
    toggleDeactivateUser()
  }
}

const toggleContextMenu = (item: ICustomer) => {
  if (showContextMenu.value === "") showContextMenu.value = item.id as string
  else showContextMenu.value = ""
}

const closeContextMenu = () => (showContextMenu.value = "")

// toggle // super admin
const toggleUserActivation = (
  id: string,
  currentStatus: boolean,
  user: IUser,
) => {
  userId.value = id
  userItem.value = user
  if (currentStatus) {
    usersStore.deactivate({
      id,
      callback: () => fetchUserList(page.value, true),
    })
  } else {
    usersStore.activate({
      id,
      callback: () => fetchUserList(page.value, true),
    })
  }
}

const onTransferConfirm = () => {
  resetTransferPermission()
  router.push(`/app/user/${userId.value}`)
}

const onCloseTransfer = () => {
  toggleTransferPermission()
  resetTransferPermission()
}

// pagination
const onPageChange = (nextPage: number) => fetchUserList(nextPage)

onBeforeMount(() => {
  fetchUserList()
})
</script>

<template>
  <LcPageTitle :title="$t('common.users')" />
  <LcTableCard class="users-table" :title="$t('common.users')" paginated>
    <LcLoader size="md" />
    <template #header>
      <LcButton
        variant="primary"
        :icon="PlusXl"
        data-cy="users-add-user"
        @click="toggleInviteUser"
      >
        {{ $t("common.add_user") }}
      </LcButton>
    </template>
    <template #table>
      <LcTable
        :columns="columns"
        :data="(sessionStore.isAdmin ? users.data : customerUsers.data) || []"
        :is-loading="isLoading"
        identifier="id"
        data-cy="users-list"
      >
        <template #name="{ item }">
          <div class="user-name">
            <LcAvatar size="sm" />
            <span class="user-name__text"
              >{{ item.firstName }} {{ item.lastName }}</span
            >
            <LcBadge
              v-if="sessionStore.isAdmin && item.admin"
              color="primary"
              :icon="Dot"
              :text="$t('common.super_admin')"
            />
          </div>
        </template>
        <template #active="{ item }">
          <LcLoader
            v-if="isDeleting === item.id || isActivating === item.id"
            size="sm"
          />
          <template v-if="isDeleting !== item.id && isActivating !== item.id">
            <LcToggle
              :id="item.id"
              :checked="item.active"
              data-cy="user-toggle-activation"
              @input="toggleUserActivation(item.id, item.active, item)"
            />
          </template>
        </template>
        <template #access="{ item }">
          <LcBadge
            :color="colorMap[item.roles[0].role]"
            :icon="Dot"
            :text="getRoleDisplayName(item.roles[0].role)"
          />
        </template>
        <template #invitation="{ item }">
          <ResendInvite
            :user="{ ...item }"
            :show-resend-option="!sessionStore.isAdmin"
        /></template>
        <template #actions="{ item }">
          <div class="lc-table-actions">
            <Delete
              v-if="!sessionStore.isAdmin"
              class="lc-table-action-icon"
              data-cy="user-delete"
              @click="openDeactivateModal(item)"
            />
            <Edit
              v-if="!sessionStore.isAdmin"
              class="lc-table-action-icon"
              data-cy="user-edit"
              @click="openEditModal(item.id)"
            />
          </div>
          <LcButton
            v-if="sessionStore.isAdmin"
            variant="link"
            :icon="Left"
            :trailing-icon="true"
            data-cy="user-details-btn"
            @click="router.push(`/app/user/${item.id}`)"
          >
            {{ $t("common.details") }}
          </LcButton>
          <div class="lc-table-actions__mobile">
            <LcContextMenu
              v-if="!sessionStore.isAdmin"
              :show-menu="showContextMenu === item.id"
              @toggle="toggleContextMenu(item)"
              @close="closeContextMenu"
            >
              <li @click="openDeactivateModal(item)">Deactivate</li>
              <li @click="openEditModal(item.id)">Edit</li>
            </LcContextMenu>
          </div>
        </template>
      </LcTable>
    </template>
    <template #pagination>
      <LcPaginator
        :page="page || 1"
        :total="total || 0"
        :page-size="perPage"
        :total-pages="lastPage || 1"
        @page-change="onPageChange"
      />
    </template>
  </LcTableCard>
  <LcModal
    :show="showEditUser"
    :icon="EditSquare"
    :title="$t('settings.edit_user_data')"
    @close="toggleEditUser"
  >
    <EditUser
      :user-id="userId"
      :edit-callback="fetchUserList"
      @close="toggleEditUser"
    />
  </LcModal>

  <LcModal
    :show="showInviteUser"
    :icon="AddUser"
    :title="$t('common.add_new_user')"
    @close="toggleInviteUser"
  >
    <InviteUsers
      :invite-callback="inviteCallBack"
      :customer-id="sessionStore.getSelectedCustomerId"
      @close="toggleInviteUser"
    />
  </LcModal>

  <LcModal
    :show="showDeactivateUser"
    :icon="DeactivateUser"
    :title="
      $t(
        'users.deactivate_user_modal.remove {firstname} {lastname} from {customer_name}',
        {
          firstname: userItem?.firstName,
          lastName: userItem?.lastName,
          customer_name: sessionStore.getSelectedCustomer?.name,
        },
      )
    "
    :description="$t('users.deactivate_user_modal.description')"
    @close="toggleDeactivateUser"
  >
    <LcActionButtons>
      <LcButton size="lg" variant="link" @click="toggleDeactivateUser">{{
        $t("common.cancel")
      }}</LcButton
      ><LcButton size="lg" @click="onDeactivate">{{
        $t("users.deactivate_user_modal.confirm")
      }}</LcButton>
    </LcActionButtons>
  </LcModal>
  <LcDialog
    :show="showTransferPermission"
    :icon="Warning"
    :headline="$t('transfer_permission_dialog.headline')"
    :description="$t('transfer_permission_dialog.description')"
    :confirm-label="$t('transfer_permission_dialog.confirm')"
    @close="onCloseTransfer"
    @confirm="onTransferConfirm"
  />
</template>

<style lang="scss" scoped>
.users-table {
  margin-bottom: var(--space-1);

  @include mq("tablet") {
    margin-bottom: var(--space-5);
  }
}

.users-table__md {
  width: 30%;
}
.users-table__sm {
  width: 20%;
}

.users-table__xs {
  width: 10%;
}

.user-name {
  display: flex;
  align-items: center;

  &__text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .avatar-wrapper {
    margin-right: var(--space-4);
    flex: 0 0 auto;
  }

  .badge {
    margin-left: var(--space-4);
  }
}

.actions {
  cursor: pointer;
  gap: 24px;
  align-items: center;

  @include mq("tablet") {
    display: table-cell;
  }
}
</style>

<style lang="scss">
.button__add {
  display: flex;
  justify-content: end;
  padding: 0 24px 32px 0;
}
</style>
