<script setup lang="ts">
import type { ToRefs } from "vue"
import { storeToRefs } from "pinia"
import { useSessionStore } from "~/stores/session"
import { useI18nStore } from "~/stores/i18n"
import type { TableColumn } from "~/components/base/LcTable.vue"
import { useCustomerStore } from "~/stores/customer"
import IconEdit from "~/assets/icons/icon-edit-square.svg?component"
import UserPlus from "~/assets/icons/icon-user-plus.svg?component"
import Warning from "~/assets/icons/icon-warning.svg?component"
import Edit from "~/assets/icons/icon-edit.svg?component"
import PlusXl from "~/assets/icons/icon-plus-xl.svg?component"
import Dot from "~/assets/icons/icon-dot.svg?component"
import { Role, getRoleDisplayName } from "~/constants/permissions"
import { i18n } from "~/modules/i18n"
import { LOCALE_TO_LANG_NAME } from "~/constants/i18n"
import type { Locale } from "~/constants/i18n"

const columns = ref<TableColumn[]>([
  { key: "name", title: i18n.global.t("common.company_name") },
  { key: "role", title: i18n.global.t("common.role") },
  { key: "action", title: "" },
])

const colorMap: Record<string, string> = {
  SuperAdmin: "success",
  CustomerAdmin: "purple",
  UserView: "gray",
  UserEdit: "error",
  Developer: "primary",
}

const sessionStore = useSessionStore()
const customerStore = useCustomerStore()
const i18nStore = useI18nStore()
const { customer }: ToRefs<any> = storeToRefs(customerStore)
const showAddCustomer = ref(false)
const showEditCustomer = ref(false)
const showContextMenu = ref("")
const editCustomerId = ref<string | undefined>()
const deleteCustomerId = ref<string | undefined>()
const showEditUserModal = ref<boolean>(false)
const locale = ref(LOCALE_TO_LANG_NAME[i18nStore.current])
const localeLabels = Object.values(LOCALE_TO_LANG_NAME)

const hasAddCompanyRights = computed(
  () =>
    sessionStore.getCurrentRole === Role.CustomerAdmin ||
    sessionStore.isAdmin ||
    !sessionStore.getSelectedCustomerId,
)

const openAddCustomerForm = () => {
  showAddCustomer.value = true
}

const closeAddCustomerForm = () => {
  showAddCustomer.value = false
}

const openEditCustomerForm = () => {
  showEditCustomer.value = true
}

const closeEditCustomerForm = () => {
  showEditCustomer.value = false
}

const openContextMenu = (item: { id: string }) => {
  showContextMenu.value = item.id
  customerStore.getSingleCustomer(item.id, true)
}

const closeContextMenu = () => (showContextMenu.value = "")

const onCompanyEdit = (id: string) => {
  closeContextMenu()
  editCustomerId.value = id
  openEditCustomerForm()
}

const onCompanyDelete = (id: string) => {
  closeContextMenu()
  deleteCustomerId.value = id
}

const onCustomerFormSubmit = () => {
  closeAddCustomerForm()
  closeEditCustomerForm()
  sessionStore.loadCurrentUser()
}

const onDeleteCancel = () => {
  deleteCustomerId.value = undefined
}

const onDeleteConfirm = () => {
  customerStore.deactivate({ id: deleteCustomerId.value as string })
  deleteCustomerId.value = undefined
}

const onEditData = () => {
  showEditUserModal.value = true
}

const closeEditUserForm = () => {
  showEditUserModal.value = false
}

const updateLocale = (languageName: string) => {
  const localeName = Object.keys(LOCALE_TO_LANG_NAME).find(
    (locale) => LOCALE_TO_LANG_NAME[locale as Locale] === languageName,
  )
  i18nStore.setCurrent(localeName as Locale)
}
</script>

<template>
  <div class="lc-page-subtitle">{{ $t("settings.my_account") }}</div>
  <LcCard class="account-data">
    <LcCardHeader :title="$t('settings.preferences')" />
    <LcCardContent>
      <div class="item">
        <div class="label">{{ $t("settings.language") }}</div>
        <span class="value">
          <LcDropdown
            v-model="locale"
            :options="localeLabels"
            @update="updateLocale"
          />
        </span>
      </div>
    </LcCardContent>
  </LcCard>
  <LcCard class="account-data">
    <LcCardHeader :title="$t('settings.my_data')">
      <template #actions
        ><LcButton variant="tertiary" :icon="Edit" @click="onEditData"
      /></template>
    </LcCardHeader>
    <LcCardContent>
      <div class="item">
        <div class="label">{{ $t("settings.Email") }}</div>
        <span class="value">{{ sessionStore.getCurrentUser?.email }}</span>
      </div>
      <div class="item">
        <div class="label">{{ $t("settings.Name") }}</div>
        <span class="value"
          >{{ sessionStore.getCurrentUser?.firstName }}
          {{ sessionStore.getCurrentUser?.lastName }}</span
        >
      </div>
      <div class="item">
        <div class="label">{{ $t("settings.accepted_terms_of_use") }}</div>
        <span class="value">
          {{
            sessionStore.getCurrentUser?.acceptedTermsDate
              ? new Date(
                  sessionStore.getCurrentUser.acceptedTermsDate,
                ).toLocaleDateString("de-DE")
              : $t("common.no")
          }}
        </span>
      </div>
    </LcCardContent>
  </LcCard>
  <LcTableCard :title="$t('settings.my_companies')">
    <template #header>
      <LcButton
        v-if="hasAddCompanyRights"
        size="md"
        :icon="PlusXl"
        @click="openAddCustomerForm"
        >{{ $t("common.add_company") }}</LcButton
      >
    </template>
    <template #table>
      <LcTable
        identifier="id"
        :columns="columns"
        :data="sessionStore.getCurrentUserCustomers"
        :is-loading="sessionStore.isCurrentUserLoading"
      >
        <template #role="{ item }">
          <LcBadge
            :icon="Dot"
            :text="getRoleDisplayName(item.role.value)"
            :color="colorMap[item.role.value]"
          />
        </template>
        <template #action="{ item }">
          <div
            v-if="item.role.value === Role.CustomerAdmin"
            class="menu-wrapper"
          >
            <LcContextMenu
              :show-menu="showContextMenu === item.id"
              @toggle="openContextMenu(item)"
              @close="closeContextMenu"
            >
              <li @click="onCompanyEdit(item.id)">
                {{ $t("settings.edit_company_data") }}
              </li>
              <li @click="onCompanyDelete(item.id)">
                {{ $t("settings.delete_company") }}
              </li>
            </LcContextMenu>
          </div>
        </template>
      </LcTable>
    </template>
  </LcTableCard>
  <LcModal
    :show="showEditUserModal"
    :title="$t('settings.edit_user_data')"
    :icon="IconEdit"
    @close="closeEditUserForm"
  >
    <EditUser hide-role @close="closeEditUserForm" />
  </LcModal>
  <LcModal
    :show="showAddCustomer"
    :title="$t('common.add_new_customer')"
    :icon="UserPlus"
    @close="closeAddCustomerForm"
  >
    <CustomerForm
      :hide-email-field="true"
      :current-mail="sessionStore.getCurrentUser?.email"
      :customer-id="undefined"
      @submit="onCustomerFormSubmit"
      @close="closeAddCustomerForm"
    />
  </LcModal>
  <LcModal
    :show="showEditCustomer"
    :title="$t('settings.edit_customer')"
    :icon="IconEdit"
    @close="closeEditCustomerForm"
  >
    <CustomerForm
      :hide-email-field="true"
      :current-mail="sessionStore.getCurrentUser?.email"
      :customer-id="editCustomerId"
      :callback="sessionStore.loadCurrentUser"
      @submit="onCustomerFormSubmit"
      @close="closeEditCustomerForm"
    />
  </LcModal>
  <LcDialog
    :show="Boolean(deleteCustomerId)"
    :icon="Warning"
    :destructive="true"
    :headline="`${$t('common.delete')} ${customer?.name}`"
    :confirm-label="$t('settings.delete_company')"
    @confirm="onDeleteConfirm"
    @close="onDeleteCancel"
  >
    <p>
      {{ $t("settings.delete_company_warn_text") }}
    </p>
  </LcDialog>
</template>

<style lang="scss">
.account-data {
  margin-bottom: var(--space-8) !important;

  & .item {
    margin-bottom: var(--space-5);

    & .label {
      margin-bottom: var(--space-1);
    }

    & .value {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-md-font-size);
    }
  }
}

.menu-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
