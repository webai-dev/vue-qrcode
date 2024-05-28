<script lang="ts" setup>
import { storeToRefs } from "pinia"
import type { TableColumn } from "~/components/base/LcTable.vue"
import { useUsersStore } from "~/stores/users"
import { colorMap, getRoleDisplayName } from "~/constants/permissions"
import EditIcon from "~/assets/icons/icon-edit.svg?component"
import DeleteIcon from "~/assets/icons/icon-delete.svg?component"
import type { IUser } from "~/types/types"
import { useTransferPermission } from "~/composables/useTransferPermission"
import type { ICustomer } from "~/types/stores/ICustomer"
import AddUser from "~/assets/icons/icon-user-plus.svg?component"
import EditSquare from "~/assets/icons/icon-edit-square.svg?component"
import DeactivateUser from "~/assets/icons/icon-deactivate-user.svg?component"
import Switch from "~/assets/icons/icon-switch.svg?component"
import PlusXl from "~/assets/icons/icon-plus-xl.svg?component"
import Dot from "~/assets/icons/icon-dot.svg?component"
import { i18n } from "~/modules/i18n"

const route = useRoute()

const props = defineProps<{
  customer: ICustomer
}>()

// table config
const columns = ref<TableColumn[]>([
  {
    key: "name",
    title: i18n.global.t("common.name"),
    customHeaderClass: "users-table__sm",
    wrapMobile: true,
  },
  {
    key: "email",
    title: i18n.global.t("common.email"),
    customHeaderClass: "users-table__sm",
    wrapMobile: true,
  },
  {
    key: "access",
    title: i18n.global.t("common.access"),
    customHeaderClass: "users-table__xs",
    customCellClass: "lc-no-ellipsis one-line",
    wrapMobile: true,
  },
  {
    key: "invitation",
    title: i18n.global.t("common.invitation"),
    customHeaderClass: "users-table__xs",
    customCellClass: "lc-no-ellipsis one-line",
    wrapMobile: true,
  },
  {
    key: "actions",
    title: "",
    customHeaderClass: "users-table__xs",
    customCellClass: "lc-no-ellipsis",
  },
])

// modals
const showEditUser = ref(false)
const showInviteUser = ref(false)
const showDeleteDialog = ref(false)
const userId = ref("")
const user = ref()
const customerName = ref("")

// store data
const usersStore = useUsersStore()
const { isLoading, isDeleting, customerUsers, isActivating }: any =
  storeToRefs(usersStore)

const { showTransferPermission, toggleTransferPermission } =
  useTransferPermission([showDeleteDialog])

// pagination
const page = computed(() => customerUsers.value.page)
const perPage = computed(() => customerUsers.value.perPage)
const lastPage = computed(() => customerUsers.value.lastPage)
const total = computed(() => customerUsers.value.totalCount)

const fetchUsers = (page?: number, preventLoader?: boolean) => {
  usersStore.getUsersOfCustomer({
    clientId: route.params.customerId as string,
    page,
    preventLoader,
  })
}

const toggleInviteUser = () => {
  showInviteUser.value = !showInviteUser.value
}

const toggleDeleteDialog = (userData?: IUser) => {
  userId.value = userData?.id || ""
  user.value = userData
  showDeleteDialog.value = !showDeleteDialog.value
}

const toggleEditUser = () => {
  showEditUser.value = !showEditUser.value
}

const deactivateUserForCompany = () => {
  usersStore.deactivateUserOfCustomer({
    customerId: route.params.customerId as string,
    userId: userId.value,
    callBack: () => {
      showDeleteDialog.value = false
      fetchUsers(page.value, true)
    },
  })
}

const openEditModal = (userData: IUser) => {
  userId.value = userData.id
  user.value = userData
  toggleEditUser()
}

const transferCallback = () => {
  fetchUsers()
  toggleEditUser()
}

// pagination
const onPageChange = (nextPage: number) => fetchUsers(nextPage)

onBeforeMount(() => {
  fetchUsers()
})
</script>
<template>
  <LcTableCard :title="$t('common.users')" paginated>
    <LcLoader size="md" />
    <template #header>
      <LcButton variant="primary" :icon="PlusXl" @click="toggleInviteUser">
        {{ $t("common.add_user") }}
      </LcButton>
    </template>
    <template #table>
      <LcTable
        :columns="columns"
        :data="customerUsers?.data || []"
        identifier="id"
      >
        <template #name="{ item }">
          <div class="user-name">
            <LcAvatar size="sm" />
            <span class="user-name__text">
              {{ item.firstName }} {{ item.lastName }}
            </span>
          </div>
        </template>
        <template #access="{ item }">
          <LcBadge
            :color="colorMap[item.roles[0].role]"
            :icon="Dot"
            :text="getRoleDisplayName(item.roles[0].role)"
          />
        </template>
        <template #invitation="{ item }">
          <ResendInvite :user="{ ...item }" :customer-id="customer.id" />
        </template>

        <template #actions="{ item }">
          <div class="lc-table-actions">
            <DeleteIcon @click="toggleDeleteDialog(item)" />
            <EditIcon
              class="lc-table-action-icon"
              @click="openEditModal(item)"
            />
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
    :show="showInviteUser"
    :icon="AddUser"
    :title="$t('common.add_new_user')"
    @close="toggleInviteUser"
  >
    <InviteUsers
      :customer-id="String(route.params.customerId)"
      :invite-callback="fetchUsers"
      @close="toggleInviteUser"
    />
  </LcModal>
  <LcModal
    :show="showEditUser"
    :icon="EditSquare"
    :title="$t('Edit user data')"
    @close="toggleEditUser"
  >
    <EditUser
      :user-id="userId"
      :customer-id="String(route.params.customerId)"
      :edit-callback="fetchUsers"
      @close="toggleEditUser"
    />
  </LcModal>
  <LcDialog
    :show="showDeleteDialog"
    :icon="DeactivateUser"
    :headline="`Remove ${user?.firstName} ${user?.lastName} from ${props.customer.name}`"
    description="This user can be re-invited to the company."
    cancel-label="Cancel"
    confirm-label="Yes, remove"
    :on-close="toggleDeleteDialog"
    :on-confirm="deactivateUserForCompany"
  />
  <LcModal
    :show="showTransferPermission"
    :icon="Switch"
    :title="`Transfer admin permission for ${props.customer.name}`"
    :description="`Before changing ${user?.firstName} ${user?.lastName}'s admin role, you have to transfer the admin permissions to another user within that company.`"
    @close="toggleTransferPermission"
  >
    <TransferPermission
      :customer-id="String(route.params.customerId)"
      :transfer-callback="transferCallback"
      @close="toggleTransferPermission"
    />
  </LcModal>
</template>
<style lang="scss" scoped>
.users-table__sm {
  width: 35%;
}

.users-table__xs {
  width: 10%;
}

.user-name {
  display: flex;
  align-items: center;

  &__text {
    white-space: nowrap;
  }

  .avatar-wrapper {
    margin-right: var(--space-4);
    flex: 0 1 auto;
  }

  .badge {
    margin-left: var(--space-4);
  }
}
.actions {
  cursor: pointer;
  display: inline-flex;
  gap: 24px;
  align-items: center;
}
</style>
