import { defineStore } from "pinia"
import httpClient from "~/modules/httpClient"
import { useSessionStore } from "~/stores/session"
import { useCustomerStore } from "~/stores/customer"
import { useNotificationsStore } from "~/stores/notifications.store"
import type { IUser, IEditUserData } from "~/types/types"
import type { IInviteStatuses } from "~/constants/statuses"
import { PAGINATION_ORDER, PAGINATION_ORDER_BY } from "~/types/stores/common"
import { i18n } from "~/modules/i18n"

const { t } = i18n.global

export interface IUserStore {
  isLoading: boolean
  isDeleting: string
  isActivating: string
  users: { data: IUser[]; perPage: number; page: number }
  customerUsers: ResponseDTO<Array<UserDTO>>
  user: IUser
}

interface UserDTO {
  id: string
  firstName: string
  lastName: string
  email: string
  active: boolean
  inviteStatus?: IInviteStatuses
}

interface ResponseDTO<Data> {
  data: Data
  page: number
  perPage: number
  totalCount: number
}

export const useUsersStore = defineStore("usersStore", {
  state: () => ({
    isLoading: false,
    isDeleting: "",
    isActivating: "",
    isUpdating: "",
    users: { data: [], perPage: 30, page: 1 },
    modalUserList: [] as UserDTO[],
    customerUsers: {
      data: [],
      perPage: 30,
      page: 1,
      totalCount: 0,
    } as ResponseDTO<Array<UserDTO>>,
    user: {},
  }),

  actions: {
    async getUsers(
      page?: number,
      preventLoader?: boolean,
      order: PAGINATION_ORDER = PAGINATION_ORDER.DESC,
      orderBy: PAGINATION_ORDER_BY = PAGINATION_ORDER_BY.CREATED_AT,
    ) {
      this.isLoading = !preventLoader
      try {
        const response = await httpClient.get(`/users`, {
          params: {
            page: page || this.users.page,
            perPage: this.users.perPage,
            order,
            orderBy,
          },
        })
        if (response && response.data) {
          this.isLoading = false
          this.users = response.data
        }
      } catch (error: any) {
        this.isLoading = false
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          error?.response?.data?.message ||
            t("users.messages.get_user_list_failed"),
          t("common.error"),
        )
      }
    },

    async getSingleUser(id: string, preventLoader?: boolean) {
      this.isLoading = !preventLoader
      try {
        const response = await httpClient.get(`/users/${id}`)
        if (response?.data) {
          this.user = response.data
          this.isLoading = false
        }
        return response.data
      } catch (error) {
        this.isLoading = false
        return error
      }
    },

    resetUsersOfCustomer({ modal }: { modal: boolean }) {
      if (modal) {
        this.modalUserList = []
      } else {
        this.customerUsers = { data: [], perPage: 30, page: 1, totalCount: 0 }
      }
    },

    async getUsersOfCustomer({
      onlyActive,
      page,
      preventLoader,
      clientId,
      name,
      modal,
      order = PAGINATION_ORDER.DESC,
      orderBy = PAGINATION_ORDER_BY.CREATED_AT,
    }: {
      onlyActive?: boolean
      page?: number
      preventLoader?: boolean
      clientId?: string
      name?: string
      modal?: boolean
      order?: PAGINATION_ORDER
      orderBy?: PAGINATION_ORDER_BY
    }) {
      this.isLoading = !preventLoader
      try {
        const customerId: string = (clientId ||
          useSessionStore().getSelectedCustomerId) as string
        const response = await httpClient.get<ResponseDTO<Array<UserDTO>>>(
          `/customers/${customerId}/users`,
          {
            params: {
              active: onlyActive,
              page: page || this.customerUsers.page,
              perPage: this.customerUsers.perPage,
              name,
              order,
              orderBy,
            },
          },
        )
        if (response && response.data) {
          this.isLoading = false
          if (modal) {
            this.modalUserList = response.data.data
          } else {
            this.customerUsers = response.data
          }
          return response
        }
      } catch (error: any) {
        this.isLoading = false
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          error?.response?.data?.message ||
            t("users.messages.get_user_list_failed"),
          t("common.error"),
        )
      }
    },

    async deactivateUserOfCustomer({
      customerId,
      userId,
      callBack,
      preventLoader,
    }: {
      customerId: string
      userId: string
      callBack: Function
      preventLoader?: boolean
    }) {
      this.isDeleting = !preventLoader ? userId : ""
      try {
        const response = await httpClient.delete(
          // @ts-ignore
          `/customers/${customerId}/users`,
          { data: [{ userId }] },
        )
        if (response) {
          this.isDeleting = ""
          callBack && callBack()
        }
      } catch (error: any) {
        if (error?.response?.data?.statusCode === 403) {
          useCustomerStore().transferPermission = true
        }
        this.isDeleting = ""
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          error?.response?.data?.message ||
            t("users.messages.deactivate_user_failed"),
          t("common.error"),
        )
      }
    },

    async edit({
      id,
      firstName,
      lastName,
      acceptedTerms,
      callback,
    }: IEditUserData) {
      this.isUpdating = id
      try {
        const response = await httpClient.patch(`/users/${id}`, {
          firstName,
          lastName,
          acceptedTermsDate: acceptedTerms,
        })
        if (response) {
          this.isUpdating = ""
          callback && callback()
        }
        return response
      } catch (error: any) {
        this.isUpdating = ""
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          error?.response?.data?.message || "Edit user failed",
          t("common.error"),
        )
      }
    },

    async deactivate({ id, callback }: { id: string; callback?: Function }) {
      this.isDeleting = id
      try {
        const response = await httpClient.delete(`/users/${id}`)
        if (response) {
          this.isDeleting = ""
          callback && callback()
        }
      } catch (error: any) {
        this.isDeleting = ""
        if (error.response.data.statusCode === 403) {
          useCustomerStore().transferPermission = true
        }
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          error?.response?.data?.message || "Deactivation of user failed",
          t("common.error"),
        )
      }
    },

    async activate({ id, callback }: { id: string; callback?: Function }) {
      this.isActivating = id
      try {
        const response = await httpClient.post(`/users/${id}`)
        if (response) {
          this.isActivating = ""
          callback && callback()
        }
      } catch (error: any) {
        this.isActivating = ""
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          error?.response?.data?.message || "Activation of user failed",
          t("common.error"),
        )
      }
    },
  },
})
