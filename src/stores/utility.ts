import { defineStore } from "pinia"
import httpClient from "~/modules/httpClient"

export const useUtilityStore = defineStore("utilityStore", {
  state: () => ({
    roles: {},
    countries: [],
    wholePageLayout: false,
  }),

  getters: {
    isWholePageLayout: (state) => state.wholePageLayout,
  },

  actions: {
    async getRoles() {
      try {
        const response = await httpClient.get("/utility/roles")
        if (response && response.data) {
          this.roles = response.data
        }
      } catch (err) {
        return err
      }
    },

    async getCountryList() {
      try {
        const response = await httpClient.get("/utility/country-list")
        if (response?.data) {
          this.countries = response.data
        }
        return response
      } catch (error: any) {
        return error
      }
    },

    activateWholePageLayout() {
      this.wholePageLayout = true
    },

    deactivateWholePageLayout() {
      this.wholePageLayout = false
    },
  },
})
