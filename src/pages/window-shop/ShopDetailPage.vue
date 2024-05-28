<script setup lang="ts">
import { Form } from "vee-validate"
import { useMediaQuery } from "@vueuse/core"
import EditShop from "./EditShop.vue"
import Edit from "~/assets/icons/icon-edit.svg?component"
import Delete from "~/assets/icons/icon-delete.svg?component"
import Escape from "~/assets/icons/icon-escape.svg?component"
import Scan from "~/assets/icons/icon-barcode-scanner.svg?component"
import Plus from "~/assets/icons/icon-plus.svg?component"
import { useWindowShopStore } from "~/stores/window-shop"
import { rules } from "~/modules/validationRules"
import type { Column } from "~/types/types"
import { useNotificationsStore } from "~/stores/notifications.store"

import { useSessionStore } from "~/stores/session"
import PlusXl from "~/assets/icons/icon-plus-xl.svg?component"
import { Role } from "~/constants/permissions"
import LcContextMenu from "~/components/base/LcContextMenu.vue"
import LcLoader from "~/components/base/LcLoader.vue"
import { track } from "~/modules/tracking"

const isMobile = ref(useMediaQuery("(max-width: 48em)"))

const { t } = useI18n()

const notificationsStore = useNotificationsStore()

rules()

const router = useRouter()

const shopStore = useWindowShopStore()
const sessionStore = useSessionStore()

const route = useRoute()
const shopId = ref(route.params.shopId)
const shopDetails = ref()
const showContextMenu = ref(false)

// pagination
const page = ref(1)
const perPage = ref(30)
const lastPage = ref()
const total = ref(null)

const hasShopRights = computed(
  () =>
    sessionStore.getCurrentRole !== Role.UserView &&
    sessionStore.getCurrentRole !== Role.Developer,
)

const columns = ref<Column[]>([
  { key: "ean", title: "EAN" },
  { key: "actions", title: "" },
])

const articlesList = ref([])
const currentArticle = ref()
const ean = ref("")

const showEditShop = ref(false)
const toggleEditShop = () => {
  showEditShop.value = !showEditShop.value
}

const showDeleteShop = ref(false)
const toggleDeleteShop = () => {
  showDeleteShop.value = !showDeleteShop.value
}

const showScanArticle = ref(false)
const toggleScanArticle = () => {
  showScanArticle.value = !showScanArticle.value
  if (showScanArticle.value) {
    router.push(`${route.path}?scanner=open`)
  } else {
    router.push(route.path)
  }
}

const showAddArticle = ref(false)
const toggleAddArticle = () => {
  showAddArticle.value = !showAddArticle.value
}

const showDeleteAll = ref(false)
const toggleDeleteAll = () => {
  showDeleteAll.value = !showDeleteAll.value
}

const showDeleteArticle = ref(false)
const toggleDeleteArticle = () => {
  showDeleteArticle.value = !showDeleteArticle.value
}
const openDeleteArticle = (id: string) => {
  currentArticle.value = id
  toggleDeleteArticle()
}

const getShopDetails = async () => {
  try {
    if (sessionStore.getSelectedCustomerId) {
      const response = await shopStore.getSingleShop({
        customerId: sessionStore.getSelectedCustomerId,
        shopId: shopId.value as string,
      })
      shopDetails.value = response.data
    }
  } catch (error: any) {
    if (error.response.status === 400) {
      await router.push("/app/touchpoint")
    } else {
      notificationsStore.setError(
        error?.response?.data?.message ||
          t("window_shop.could_not_load_location_details"),
      )
    }
  }
}

const getArticles = async () => {
  try {
    if (sessionStore.getSelectedCustomerId && shopDetails.value.id) {
      const response = await shopStore.getItems(
        {
          windowId: 1,
          shopId: shopDetails.value?.id,
          customerId: sessionStore.getSelectedCustomerId,
        },
        { page: page.value, perPage: perPage.value },
      )
      articlesList.value = response.data.data
      lastPage.value = response.data.lastPage
      total.value = response.data.totalCount || 0
    }
  } catch (error: any) {
    notificationsStore.setError(
      error?.response?.data?.message ||
        t("window_shop.could_not_load_list_of_countries"),
    )
  }
}

const deleteShop = async () => {
  try {
    if (sessionStore.getSelectedCustomerId) {
      await shopStore.deleteShop({
        shopId: shopDetails.value.id,
        customerId: sessionStore.getSelectedCustomerId,
      })
      notificationsStore.setSuccess(
        t("window_shop.location_deleted_successfully"),
      )
    }
  } catch (err) {
    notificationsStore.setError(t("window_shop.could_not_delete_this_location"))
  } finally {
    toggleDeleteShop()
    await router.replace("/app/touchpoint")
  }
}

const scanMessage = ref<"error" | "success" | undefined>()
const addArticle = async (articleEan: string, scanner = true) => {
  try {
    if (sessionStore.getSelectedCustomerId) {
      const response = await shopStore.addItem({
        shopId: shopDetails.value.id,
        customerId: sessionStore.getSelectedCustomerId,
        windowId: 1, // hardcoded, needs to be changed when design is updated
        ean: articleEan,
        active: true,
      })
      if (response) {
        track("Article added", {
          shopId: shopDetails.value.id,
          customerId: sessionStore.getSelectedCustomerId,
          type: scanner ? "scanner" : "input",
        })
      }
      if (!showScanArticle.value) {
        notificationsStore.setSuccess(
          t("window_shop.article_successfully_added"),
        )
      }
      getArticles()
      scanMessage.value = "success"
      ean.value = ""
    }
  } catch {
    notificationsStore.setError(t("window_shop.could_not_add_an_article"))
  } finally {
    showAddArticle.value = false
  }
}

const articleId = ref()
const scanArticle = (ean: string) => {
  articleId.value = articlesList.value.find(
    (article: any) => article.ean === ean,
  )
  if (articleId.value) {
    scanMessage.value = "error"
    return
  }
  addArticle(ean as string)
}

const deleteArticle = async () => {
  try {
    if (sessionStore.getSelectedCustomerId) {
      await shopStore.deleteItem({
        shopId: shopDetails.value.id,
        customerId: sessionStore.getSelectedCustomerId,
        itemId: articleId.value ? articleId.value.id : currentArticle.value,
      })
      if (!showScanArticle.value) {
        notificationsStore.setSuccess(
          t("window_shop.article_deleted_successfully"),
        )
      }
      getArticles()
    }
  } catch {
    notificationsStore.setError(t("window_shop.could_not_delete_an_article"))
  } finally {
    if (!showScanArticle.value) toggleDeleteArticle()
  }
}

const deleteAll = async () => {
  try {
    if (sessionStore.getSelectedCustomerId) {
      await shopStore.deleteAllItems({
        windowId: 1,
        shopId: shopDetails.value.id,
        customerId: sessionStore.getSelectedCustomerId,
      })
      notificationsStore.setSuccess(
        t("window_shop.articles_deleted_successfully"),
      )
      getArticles()
    }
  } catch {
    notificationsStore.setError(t("window_shop.could_not_delete_articles"))
  } finally {
    toggleDeleteAll()
  }
}

const toggleContextMenu = () => {
  showContextMenu.value = !showContextMenu.value
}

const onClickOnAddArticle = () => {
  toggleContextMenu()
  toggleAddArticle()
}

const onPageChange = (nextPage: number) => {
  page.value = nextPage
  getArticles()
}

watch(
  () => route.query.scanner,
  (newVal) => {
    if (!newVal) showScanArticle.value = false
  },
)

onBeforeMount(async () => {
  await getShopDetails()
  getArticles()
  if (route.query.scanner === "open") {
    toggleScanArticle()
  }
})
</script>

<template>
  <div class="header">
    <div v-if="total === null" class="wrapper-loader">
      <LcLoader size="lg" />
    </div>
    <template v-else>
      <span v-if="shopDetails" class="shop-id">
        ID: {{ shopDetails.shopId }}
      </span>
      <div class="header-actions">
        <Delete v-if="hasShopRights" @click="toggleDeleteShop" />
        <Edit v-if="hasShopRights" @click="toggleEditShop" />
        <router-link to="/app/touchpoint">
          <div class="actions__switch">
            <Escape /> <span>{{ $t("window_shop.switch_location") }}</span>
          </div>
        </router-link>
      </div>
    </template>
  </div>
  <LcPageTitle v-if="shopDetails && total !== null" :title="shopDetails.name" />
  <div v-if="articlesList.length && !!total">
    <LcTableCard :title="$t('common.ean')" paginated>
      <template #header>
        <div class="table-buttons">
          <LcButton
            v-if="isMobile && hasShopRights"
            class="btn-scan"
            size="sm"
            @click="toggleScanArticle"
            ><span>{{ $t("window_shop.Scan") }} </span><Scan
          /></LcButton>
          <LcButton
            v-if="!isMobile && hasShopRights"
            :icon="Plus"
            size="sm"
            @click="toggleAddArticle"
          >
            {{ $t("window_shop.add_articles_by_EAN") }}
          </LcButton>
          <LcButton
            v-if="hasShopRights"
            class="btn-delete"
            size="sm"
            variant="tertiary"
            @click="toggleDeleteAll"
          >
            <span>{{ $t("window_shop.delete_all") }}</span>
            <Delete />
          </LcButton>
          <LcContextMenu
            v-if="isMobile && hasShopRights"
            :show-menu="showContextMenu"
            @toggle="toggleContextMenu"
          >
            <li @click="onClickOnAddArticle">
              <Plus /> <span>{{ $t("add_articles") }}</span>
            </li>
          </LcContextMenu>
        </div>
      </template>
      <template #table>
        <LcTable :columns="columns" :data="articlesList" identifier="id">
          <template #actions="{ item }">
            <div v-if="hasShopRights" class="lc-table-actions">
              <Delete
                class="lc-table-action-icon"
                @click="openDeleteArticle(item.id)"
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
  </div>
  <div v-else-if="!articlesList.length && total !== null" class="no-data">
    <p v-if="hasShopRights">
      {{ $t("window_shop.scan_labels_description") }}
    </p>
    <p v-else>{{ $t("window_shop.admin_did_not_add_locations") }}</p>
    <div class="buttons">
      <LcButton
        v-if="isMobile && hasShopRights"
        :icon="Scan"
        size="md"
        @click="toggleScanArticle"
      >
        {{ $t("window_shop.scan_articles") }}
      </LcButton>
      <LcButton
        v-if="hasShopRights"
        :icon="Plus"
        size="md"
        variant="secondary"
        @click="toggleAddArticle"
      >
        {{ $t("window_shop.add_articles") }}
      </LcButton>
    </div>
  </div>
  <LcModal
    :show="showEditShop"
    :title="$t('window_shop.manage.edit_location')"
    :description="$t('window_shop.manage.change_location_details')"
    :icon="Edit"
    @close="toggleEditShop"
  >
    <EditShop
      :shop-id="shopDetails.id"
      :edit-callback="getShopDetails"
      @close="toggleEditShop"
    />
  </LcModal>

  <LcModal
    :show="showDeleteShop"
    :title="$t('window_shop.manage.delete_location')"
    :description="$t('window_shop.manage.delete_location_including_articles')"
    @close="toggleDeleteShop"
  >
    <LcActionButtons>
      <LcButton size="lg" variant="link" @click.prevent="toggleDeleteShop">
        {{ $t("common.cancel") }}
      </LcButton>
      <LcButton size="lg" destructive @click="deleteShop">
        {{ $t("common.delete") }}
      </LcButton>
    </LcActionButtons>
  </LcModal>

  <LcModal
    :show="showAddArticle"
    :title="$t('window_shop.add_article')"
    :icon="PlusXl"
    @close="toggleAddArticle"
  >
    <Form @submit="addArticle(ean, false)">
      <LcFormItem
        v-slot="{ field, meta }"
        name="ean"
        :label="$t('window_shop.ean_number')"
        rules="required"
      >
        <LcInput v-model="ean" :meta="meta" v-bind="field" />
      </LcFormItem>
      <LcActionButtons>
        <LcButton size="lg" variant="link" @click.prevent="toggleAddArticle">
          {{ $t("common.cancel") }}
        </LcButton>
        <LcButton size="lg" type="submit">{{ $t("common.add") }}</LcButton>
      </LcActionButtons>
    </Form>
  </LcModal>

  <LcModal
    :show="showDeleteArticle"
    :title="$t('window_shop.delete_article')"
    :description="$t('window_shop.delete_article_confirm')"
    @close="toggleDeleteArticle"
  >
    <LcActionButtons>
      <LcButton size="lg" variant="link" @click.prevent="toggleDeleteArticle">
        {{ $t("common.cancel") }}
      </LcButton>
      <LcButton size="lg" destructive @click="deleteArticle">{{
        $t("common.delete")
      }}</LcButton>
    </LcActionButtons>
  </LcModal>

  <LcModal
    :show="showDeleteAll"
    :title="$t('window_shop.delete_all_articles')"
    :description="$t('window_shop.delete_all_articles_confirm')"
    @close="toggleDeleteAll"
  >
    <LcActionButtons>
      <LcButton size="lg" variant="link" @click.prevent="toggleDeleteAll">
        {{ $t("common.cancel") }} </LcButton
      ><LcButton size="lg" destructive @click="deleteAll">{{
        $t("common.delete")
      }}</LcButton>
    </LcActionButtons>
  </LcModal>
  <LcModal
    :show="isMobile && showScanArticle"
    scanner-modal
    close-button
    @close="toggleScanArticle"
  >
    <LcBarcodeReader
      :scan-message="scanMessage"
      @decode="scanArticle"
      @delete="deleteArticle"
    />
  </LcModal>
</template>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include mqDesktopFirst("mobile") {
    display: grid;
    gap: var(--space-2);
  }
}

.shop-id {
  color: var(--clr-gray-500);
}

.wrapper-loader {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-6);
}

.actions__switch {
  display: flex;
  align-items: center;

  svg {
    margin-right: var(--space-2);
  }
}

.no-data {
  width: 100%;
  max-width: 446px;
}

.header-actions {
  display: flex;
  gap: var(--space-4);
  color: var(--clr-primary-600);
  align-items: center;
  cursor: pointer;

  &__switch {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    border-left: 1px solid var(--clr-gray-200);
    padding: 0 var(--space-4);
  }

  & > svg:hover,
  .actions__switch:hover {
    color: var(--clr-primary-800);
  }
}

.buttons {
  display: flex;
  gap: var(--space-4);
}

.btn-scan,
.btn-delete {
  .button__text {
    display: flex;
    align-items: center;

    span {
      margin-right: var(--space-2);
    }
  }
}

.table-buttons {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.dropdown-actions {
  display: flex;
  align-items: center;
  & > svg {
    height: 17px;
    width: 17px;
  }
}
</style>
