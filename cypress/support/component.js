import { defineStore } from "pinia"
import { mount } from "@cypress/vue"

/**
 * add component specific cypress commands here to not crash e2e tests
 * **/
Cypress.Commands.add("mount", (...args) => {
  return mount(...args).then((wrapper) => {
    return cy.wrap(wrapper).as("vue")
  })
})

/*
 * Define the states
 * */
const superAdminState = () => ({
  currentUser: {
    id: "b47d5e55-dbc7-4f73-bdbe-24346618a35c",
    firstName: "Super",
    lastName: "Admin",
    email: "labelcloud.test+superadmin@gmail.com",
    active: true,
    admin: true,
    acceptedTermsDate: "2022-06-14T07:39:43.520Z",
    createdAt: "2022-03-22T13:19:22.032Z",
    updatedAt: "2022-06-14T07:39:43.521Z",
    customers: [
      {
        id: "b6fae890-64e9-481b-9353-3a245cdd1159",
        name: "New test",
        role: {
          value: "CustomerAdmin",
        },
      },
    ],
    selectedCustomer: {
      id: "b6fae890-64e9-481b-9353-3a245cdd1159",
    },
  },
  email: "labelcloud.test+superadmin@gmail.com",
  sessionToken: "fake",
  loading: {
    currentUser: false,
    logout: false,
    forgetPassword: false,
    switch: false,
    login: false,
  },
  fetched: {
    currentUser: true,
    logout: false,
  },
  login: {
    challengeName: null,
  },
})

/*
 * define store for testing
 * */
export const testSessionStore = defineStore("sessionStore", {
  state: () => superAdminState(),
  getters: {
    getCurrentUser: (state) => state.currentUser,
    isAdmin: (state) => state.currentUser?.admin,
    getCurrentUserCustomers: (state) => state.currentUser?.customers || [],
    getSelectedCustomer: (state) =>
      state.currentUser?.customers.find(
        ({ id }) => id === state.currentUser?.selectedCustomer.id,
      ),
    getSelectedCustomerId: (state) => state.currentUser?.selectedCustomer?.id,
    getCurrentRole: (state) =>
      state.currentUser?.customers?.find(
        ({ id }) => id === state.currentUser?.selectedCustomer.id,
      )?.role.value,
    isForgetPasswordLoading: (state) => state.loading.forgetPassword,
    isLoginLoading: (state) => state.loading.login,
    isCurrentUserLoading: (state) => state.loading.currentUser,
    isCurrentUserFetched: (state) => state.fetched.currentUser,
    isSwitchCustomerLoading: (state) => state.loading.switch,
    getCurrentUserName: (state) =>
      `${state.currentUser?.firstName} ${state.currentUser?.lastName}`,
  },
  actions: {
    login: () => {},
  },
})

export const testGeneratorStore = defineStore("generatorStore", {
  state: () => ({
    loading: {
      creatingIdPart: false,
      updatingIdPart: "",
      reorderingIdPart: "",
    },
  }),
  getters: {
    isCreatingIdPart: (state) => state.loading.creatingIdPart,
    isUpdatingIdPart: (state) => state.loading.updatingIdPart,
    isReorderingIdPart: (state) => state.loading.reorderingIdPart,
  },
  actions: {},
})

export const testUtilityStore = defineStore("utilityStore", {
  state: () => ({
    wholePageLayout: false,
  }),
  getters: {
    isWholePageLayout: (state) => state.wholePageLayout,
  },
  actions: {
    activateWholePageLayout() {
      this.wholePageLayout = true
    },

    deactivateWholePageLayout() {
      this.wholePageLayout = false
    },
  },
})
