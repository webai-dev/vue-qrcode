import { defineStore } from "pinia"
import httpClient from "~/modules/httpClient"
import { useNotificationsStore } from "~/stores/notifications.store"
import { i18n } from "~/modules/i18n"

const { t } = i18n.global

interface ApiErrorInterface {
  message: string
}

class APIErrorDAO implements ApiErrorInterface {
  message: string
  constructor(message: string) {
    this.message = message
  }
}

interface APICustomerStatsDAO {
  customerShopCount: number
  customerItemCount: number
  customerId: string
}

interface APICustomerGeneratorStatsDAO {
  projectsCreated: number
  setsCreated: number
  itemsCreated: number
}

interface APIAdminStatsDAO {
  totalCustomerCount: number
  totalUserCount: number
}

interface StatsState {
  customer: {
    data: {
      shopCount: number
      itemCount: number
      customerId: string | null
    }
    fetched: null | Date
  }
  generator: {
    data: {
      projectsCreated: number
      setsCreated: number
      itemsCreated: number
    }
    fetched: null | Date
  }
  admin: {
    data: {
      totalCustomerCount: number
      totalUserCount: number
    }
    fetched: null | Date
  }
}

export const useStatsStore = defineStore("statsStore", {
  state: () =>
    ({
      customer: {
        data: {
          shopCount: 0,
          itemCount: 0,
          customerId: null,
        },
        fetched: null,
      },
      generator: {
        data: {
          projectsCreated: 0,
          setsCreated: 0,
          itemsCreated: 0,
        },
        fetched: null,
      },
      admin: {
        data: {
          totalCustomerCount: 0,
          totalUserCount: 0,
        },
        fetched: null,
      },
    } as StatsState),
  getters: {
    isCustomerDataFetched: (state) => state.customer.fetched !== null,
    isCustomerGeneratorDataFetched: (state) => state.generator.fetched !== null,
    getCustomerStats: (state) => state.customer.data,
    getCustomerShopCount: (state) => state.customer.data.shopCount,
    getCustomerItemCount: (state) => state.customer.data.itemCount,
    isAdminDataFetched: (state) => state.admin.fetched !== null,
    getAdminStats: (state) => state.admin.data,
    getAdminTotalCustomerCount: (state) => state.admin.data.totalCustomerCount,
    getAdminTotalUserCount: (state) => state.admin.data.totalUserCount,
    getCustmerGeneratorItemCount: (state) => state.generator.data.itemsCreated,
    getCustmerGeneratorProjectCount: (state) =>
      state.generator.data.projectsCreated,
  },
  actions: {
    async loadCustomerStats(customerId: string) {
      try {
        const response = await httpClient.get<APICustomerStatsDAO>(
          `/stats/customers/${customerId}`,
        )
        if (response && response.data) {
          this.customer = {
            data: {
              shopCount: response.data.customerShopCount,
              itemCount: response.data.customerItemCount,
              customerId: response.data.customerId,
            },
            fetched: new Date(),
          }
        }
        return response
      } catch (error: any) {
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          error.message || t("messages.stats.unable_load_customer_stats_msg"),
        )
        return error
      }
    },

    async loadCustomerGeneratorStats(customerId: string) {
      try {
        const response = await httpClient.get<APICustomerGeneratorStatsDAO>(
          `/stats/customers/${customerId}/generator`,
        )

        if (response && response.data) {
          this.generator = {
            data: {
              projectsCreated: response.data.projectsCreated,
              setsCreated: response.data.setsCreated,
              itemsCreated: response.data.itemsCreated,
            },
            fetched: new Date(),
          }
        }
        return response
      } catch (error: unknown) {
        if (error instanceof APIErrorDAO) {
          const notificationsStore = useNotificationsStore()
          notificationsStore.setError(
            error.message || t("messages.stats.unable_load_customer_stats_msg"),
          )
          return error
        }
      }
    },

    async loadAdminStats() {
      try {
        const response = await httpClient.get<APIAdminStatsDAO>("/stats/admin")
        if (response && response.data) {
          this.admin = {
            data: {
              totalCustomerCount: response.data.totalCustomerCount,
              totalUserCount: response.data.totalUserCount,
            },
            fetched: new Date(),
          }
        }
        return response
      } catch (error: any) {
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          error.message || t("messages.stats.unable_load_admin_stats_msg"),
        )
        return error
      }
    },
  },
})
