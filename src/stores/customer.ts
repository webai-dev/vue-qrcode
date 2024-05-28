import { defineStore } from "pinia"
import type { Customer, InvitedUser, ReInvitedUser } from "~/types/types"
import httpClient from "~/modules/httpClient"
import type { ICustomer } from "~/types/stores/ICustomer"
import { useNotificationsStore } from "~/stores/notifications.store"
import { PAGINATION_ORDER, PAGINATION_ORDER_BY } from "~/types/stores/common"
import { i18n } from "~/modules/i18n"

const { t } = i18n.global

interface CustomersResponseDTO {
  data: CustomerDTO[]
  page: number
  perPage: number
  totalCount: number
}

interface CustomerDTO {
  id: string
  address: string
  city: string
  contactMail: string
  contactPhone: string
  country: string
  createdAt: string
  deleted: boolean
  logo: string
  name: string
  postCode: string
  state: string
  updatedAt: string
}

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    isLoading: false,
    isUpdating: false,
    isDeOrActivating: false,
    customers: {
      data: [],
      perPage: 30,
      page: 1,
      totalCount: 0,
    } as CustomersResponseDTO,
    modalCustomerList: [] as CustomersResponseDTO[],
    customer: { id: "" },
    transferPermission: false,
  }),

  actions: {
    async getCustomers(
      name?: string,
      preventLoader?: boolean,
      page?: number,
      order: PAGINATION_ORDER = PAGINATION_ORDER.DESC,
      orderBy: PAGINATION_ORDER_BY = PAGINATION_ORDER_BY.CREATED_AT,
    ) {
      this.isLoading = !preventLoader
      try {
        const response = await httpClient.get(`/customers`, {
          params: {
            name,
            page,
            perPage: this.customers.perPage,
            order,
            orderBy,
          },
        })
        if (response && response.data) {
          this.customers = response.data
          this.isLoading = false
        }
      } catch (error: any) {
        this.isLoading = false
      }
    },

    resetCustomers() {
      this.customers = { data: [], perPage: 30, page: 1, totalCount: 0 }
    },

    resetTransfer() {
      this.transferPermission = false
    },

    async getSingleCustomer(id: string, preventLoader?: boolean) {
      this.isLoading = !preventLoader
      try {
        const response = await httpClient.get(`/customers/${id}`)
        if (response?.data) {
          this.customer = response.data
          this.isLoading = false
        }
      } catch (error) {
        this.isLoading = false
        return error
      }
    },

    async add(payload: Customer, callback?: Function) {
      this.isLoading = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.post("/customers", payload)
        if (response && response.data) {
          this.isLoading = false
          callback && callback(response.data)
          notificationsStore.setSuccess(
            t("customer.messages.add_success_msg_{name}", {
              name: payload.name,
            }),
            t("common.success"),
          )
        }
        return response
      } catch (error: any) {
        this.isLoading = false
        notificationsStore.setError(
          error.response.data.message || t("customer.messages.add_failed_msg"),
          t("common.error"),
        )
      }
    },

    async reInvite(
      customerId: string,
      payload: ReInvitedUser,
      callback?: Function,
    ) {
      this.isLoading = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.post(
          `/customers/${customerId}/reinvite`,
          { ...payload },
        )
        if (callback && response) callback()
        notificationsStore.setSuccess(
          t("customer.messages.re_invite_success_msg"),
          t("common.success"),
        )
        return response
      } catch (error: any) {
        notificationsStore.setError(
          error.response.data.message ||
            t("customer.messages.re_invite_failed_msg"),
          t("common.error"),
        )
      } finally {
        this.isLoading = false
      }
    },

    async edit(id: string, payload: ICustomer, updateCallback: any) {
      this.isUpdating = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.put(`/customers/${id}`, payload)
        if (response) {
          this.isUpdating = false
          updateCallback && updateCallback()
        }
      } catch (error: any) {
        this.isUpdating = false
        notificationsStore.setError(
          error.response.data.message || t("customer.messages.edit_failed_msg"),
          t("common.error"),
        )
      }
    },

    async updateCustomerUserRole(
      customerId: string,
      userId: string,
      role: { role: string },
      callback?: Function,
    ) {
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.put(
          `/customers/${customerId}/users/${userId}`,
          role,
        )
        response && callback && callback()
        return response
      } catch (error: any) {
        if (error.response.data.statusCode === 403) {
          this.transferPermission = true
        }
        notificationsStore.setError(
          error.response.data.message ||
            t("customer.messages.update_role_failed_msg"),
          t("common.error"),
        )
      }
    },

    async invite(
      customerId: string,
      payload: InvitedUser,
      callback?: Function,
    ) {
      const response = await httpClient.post(
        `/customers/${customerId}/invite`,
        {
          users: [payload],
        },
      )
      if (callback) callback()
      return response
    },

    async deactivate({ id, callback }: { id: string; callback?: Function }) {
      this.isDeOrActivating = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.delete(`/customers/${id}`)
        if (response) {
          this.isDeOrActivating = false
          callback && callback()
        }
      } catch (error: any) {
        this.isDeOrActivating = false
        notificationsStore.setError(
          error?.response?.data?.message ||
            t("customer.messages.deactivate_failed_msg"),
        )
      }
    },

    async activate({ id, callback }: { id: string; callback?: Function }) {
      this.isDeOrActivating = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.post(`/customers/${id}`)
        if (response) {
          this.isDeOrActivating = false
          callback && callback()
        }
      } catch (error: any) {
        this.isDeOrActivating = false
        notificationsStore.setError(
          error?.response?.data?.message ||
            t("customer.messages.activate_failed_msg"),
        )
      }
    },
  },
})
