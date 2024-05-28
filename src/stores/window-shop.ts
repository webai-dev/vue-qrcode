import { defineStore } from "pinia"
import API from "@/modules/httpClient"
import type {
  AddItemsProps,
  AllItemsProps,
  CreateShopProps,
  DeleteItemProps,
  EditItemProps,
  EditShopProps,
  GetShopsProps,
  PageData,
  ShopProps,
} from "~/types/types"
import { useNotificationsStore } from "~/stores/notifications.store"
import { i18n } from "~/modules/i18n"

const { t } = i18n.global

export const useWindowShopStore = defineStore("windowshop", {
  state: () => ({
    isLoading: false,
    isUpdating: false,
    shops: { data: [], perPage: 30, page: 1 },
  }),
  actions: {
    // shop actions
    async getShops(
      { customerId, country }: GetShopsProps,
      { page }: Partial<PageData>,
    ) {
      this.isLoading = true

      try {
        const response = await API.get(`/customers/${customerId}/shops`, {
          params: {
            page,
            perPage: this.shops.perPage,
            country,
          },
        })
        if (response?.data) {
          this.shops = response.data
          this.isLoading = false
          return response.data.data
        }
      } catch (error: any) {
        this.isLoading = false
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(error?.response?.data?.message)
      }
    },

    async createShop({ shopId, customerId, name, country }: CreateShopProps) {
      return await API.post(`/customers/${customerId}/shops`, {
        shopId,
        name,
        country,
      })
    },

    getSingleShop({ customerId, shopId }: ShopProps) {
      return API.get(`/customers/${customerId}/shops/${shopId}`)
    },

    async editShop({
      customerId,
      id,
      shopId,
      name,
      country,
      callback,
    }: EditShopProps) {
      this.isUpdating = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await API.put(`/customers/${customerId}/shops/${id}`, {
          shopId,
          name,
          country,
        })
        if (response) {
          this.isUpdating = false
          notificationsStore.setSuccess(
            t("window_shop.messages.update_location_success_msg"),
          )
          callback && callback()
        }
      } catch (error: any) {
        this.isUpdating = false
        notificationsStore.setError(
          error?.response?.data?.message ||
            t("window_shop.messages.update_location_failed_msg"),
        )
      }
    },

    async deleteShop({ shopId, customerId }: ShopProps) {
      return await API.delete(`/customers/${customerId}/shops/${shopId}`)
    },
    // items actions

    getItems(
      { windowId, shopId, customerId }: AllItemsProps,
      { page, perPage }: PageData,
    ) {
      return API.get(
        `/customers/${customerId}/shops/${shopId}/items/windows/${windowId}`,
        {
          params: {
            page,
            perPage,
          },
        },
      )
    },
    async addItem({
      customerId,
      shopId,
      windowId,
      ean,
      active,
    }: AddItemsProps) {
      return await API.post(`/customers/${customerId}/shops/${shopId}/items`, {
        windowId,
        ean,
        active,
      })
    },

    async deleteItem({ customerId, shopId, itemId }: DeleteItemProps) {
      return await API.delete(
        `customers/${customerId}/shops/${shopId}/items/${itemId}`,
      )
    },
    // not in the desing
    async getItemsByWindow(shopId: string, windowId: number) {
      return await API.get(`/shops/${shopId}/items/windows/${windowId}`)
    },

    async deleteAllItems({ windowId, shopId, customerId }: AllItemsProps) {
      return await API.delete(
        `customers/${customerId}/shops/${shopId}/items/windows/${windowId}`,
      )
    },

    // not in the desing
    async editItem({ shopId, itemId, windowId, ean, active }: EditItemProps) {
      return await API.put(`/shops/${shopId}/items/${itemId}`, {
        windowId,
        ean,
        active,
      })
    },
  },
})
