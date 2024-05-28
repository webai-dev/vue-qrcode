import { defineStore } from "pinia"
import type { AxiosError, AxiosResponse } from "axios"
import axios from "axios"
import httpClient from "~/modules/httpClient"
import { useNotificationsStore } from "~/stores/notifications.store"

import { router } from "~/main"
import { localStore, getDefaultLocalState } from "~/modules/localStore"
import { useUsersStore } from "~/stores/users"
import type { ILoginData, IRegistrationData } from "~/types/types"
import type { ILocalStoreLogin } from "~/modules/localStore"
import type { ICurrentUser } from "~/types/stores/Session"
import { Role } from "~/constants/permissions"
import { i18n } from "~/modules/i18n"

const { t } = i18n.global

export interface ICurrentUserState {
  loading: {
    currentUser: boolean
    logout: boolean
    forgetPassword: boolean
    switch: boolean
    login: boolean
  }
  fetched: {
    currentUser: boolean
    logout: boolean
  }
  currentUser: ICurrentUser | null
  email: string
  sessionToken: string
  login: {
    challengeName: "NEW_PASSWORD_REQUIRED" | null
  }
}

export type APIUserDBDataDTO = ICurrentUser

export type APIRegisterDBDataDTO = {
  codeDeliveryDetails: {
    deliveryMedium: string
    destination: string
    attributeName: string
  }
  userConfirmed: boolean
  userSub: string
}

export interface IAPIStandardErrorType {
  statusCode: number
  message: string
}

export interface IAPIUserLoginResponse {
  session: string
  challengeName?: "NEW_PASSWORD_REQUIRED"
}

export const useSessionStore = defineStore("sessionStore", {
  state: (): ICurrentUserState => ({
    currentUser: null,
    email: localStore.get("login").email,
    sessionToken: localStore.get("login").session,
    loading: {
      currentUser: false,
      logout: false,
      forgetPassword: false,
      switch: false,
      login: false,
    },
    fetched: {
      currentUser: false,
      logout: false,
    },
    login: {
      challengeName: null,
    },
  }),
  getters: {
    getCurrentUser: (state): ICurrentUser | null => state.currentUser,
    isAdmin: (state: ICurrentUserState) => state.currentUser?.admin || false,
    getCurrentUserCustomers: (state: ICurrentUserState) =>
      state.currentUser?.customers || [],
    getSelectedCustomer: (state: ICurrentUserState) =>
      state.currentUser?.customers.find(
        ({ id }) => id === state.currentUser?.selectedCustomer.id,
      ),
    getSelectedCustomerId: (state: ICurrentUserState) =>
      state.currentUser?.selectedCustomer?.id,
    getCurrentRole: (state: ICurrentUserState) =>
      state.currentUser?.admin
        ? Role.SuperAdmin
        : state.currentUser?.customers?.find(
            ({ id }) => id === state.currentUser?.selectedCustomer.id,
          )?.role.value,

    isForgetPasswordLoading: (state: ICurrentUserState) =>
      state.loading.forgetPassword,

    isLoginLoading: (state: ICurrentUserState) => state.loading.login,
    isCurrentUserLoading: (state: ICurrentUserState) =>
      state.loading.currentUser,
    isCurrentUserFetched: (state: ICurrentUserState) =>
      state.fetched.currentUser,
    isSwitchCustomerLoading: (state: ICurrentUserState) => state.loading.switch,
    getCurrentUserName: (state: ICurrentUserState) =>
      `${state.currentUser?.firstName} ${state.currentUser?.lastName}`,
  },
  actions: {
    async loadCurrentUser(showErrors = true): Promise<any> {
      this.loading.currentUser = true
      try {
        const response = await httpClient.get<APIUserDBDataDTO>(
          "/users/current",
        )
        if (response && response.data) {
          this.loading.currentUser = false
          this.fetched.currentUser = true
          this.currentUser = response.data
          const accepted = localStore.get("acceptedTerms")
          if (!response.data?.acceptedTermsDate && accepted) {
            useUsersStore().edit({
              id: response.data.id,
              acceptedTerms: accepted,
            })
          }
        }
        return response
      } catch (err: unknown) {
        this.loading.currentUser = false
        this.fetched.currentUser = true
        if (showErrors) {
          const notificationsStore = useNotificationsStore()
          if (axios.isAxiosError(err) && !!err.response && err.response.data) {
            err as AxiosError<IAPIStandardErrorType>
            notificationsStore.setError(err.response.data.message)
          } else {
            notificationsStore.setError(t("messages.auth.load_user_failed_msg"))
          }
        }
      }
    },

    resetState() {
      this.email = ""
      this.sessionToken = ""
      this.currentUser = null
      localStore.set("login", getDefaultLocalState().login)
    },

    async logout(): Promise<void> {
      this.loading.logout = true
      try {
        await httpClient.get<void>("/users/logout")
        this.loading.logout = false
        this.fetched.logout = true
        this.resetState()
        localStore.set("login", getDefaultLocalState().login)
        localStore.set("acceptedTerms", getDefaultLocalState().acceptedTerms)
        await router.push({ name: "auth.login" })
      } catch (err: unknown) {
        this.loading.logout = false
        this.fetched.logout = true
        const notificationsStore = useNotificationsStore()
        if (axios.isAxiosError(err) && !!err.response && err.response.data) {
          err as AxiosError<IAPIStandardErrorType>
          notificationsStore.setError(err.response.data.message)
        } else {
          notificationsStore.setError(t("messages.auth.reset_state_msg"))
        }
      }
    },

    async register({
      email,
      password,
      firstName,
      lastName,
      acceptedTerms,
    }: IRegistrationData): Promise<any> {
      try {
        const response = await httpClient.post<APIRegisterDBDataDTO>(
          "/users/register",
          {
            email,
            password: password.trim(),
            firstName,
            lastName,
          },
        )
        localStore.update("login", (s: ILocalStoreLogin) => ({
          ...s,
          email,
          pwForAutoLogin: password,
        }))
        this.email = email
        if (response && response.data && acceptedTerms) {
          localStore.update("acceptedTerms", () => acceptedTerms)
        }
        return response
      } catch (err: unknown) {
        const notificationsStore = useNotificationsStore()
        if (axios.isAxiosError(err) && !!err.response && err.response.data) {
          err as AxiosError<IAPIStandardErrorType>
          notificationsStore.setError(err.response.data.message)
        } else {
          notificationsStore.setError(t("messages.auth.register_failed_msg"))
        }
      }
    },

    async login(
      payload: ILoginData,
    ): Promise<AxiosResponse<IAPIUserLoginResponse>> {
      this.loading.login = true
      try {
        const response = await httpClient.post<IAPIUserLoginResponse>(
          "/users/login",
          payload,
        )
        if (response && response.data) {
          this.loading.login = false
          localStore.update("login", (s: ILocalStoreLogin) => {
            if (s) {
              s.email = payload.email
              s.sessionToken = response.data?.session
              s.pwForAutoLogin = ""
            }
          })
          this.email = payload.email
          this.sessionToken = response.data?.session
          this.login.challengeName = response.data?.challengeName
            ? response.data.challengeName
            : null
        }
        return response
      } catch (err: any) {
        const notificationsStore = useNotificationsStore()
        if (err?.response.status === 403) {
          await router.push({ name: "auth.confirm" })
          notificationsStore.setWarning(
            t("messages.auth.check_email_for_verification_code"),
          )
        } else {
          this.loading.login = false
          notificationsStore.setError(
            err?.response?.data?.message || t("messages.auth.login_failed_msg"),
          )
        }
        throw err
      }
    },

    async confirm(code: string): Promise<boolean | undefined> {
      try {
        const response = await httpClient.post<void>("/users/code/confirm", {
          email: this.email,
          code,
        })

        if (response) {
          const email = localStore.get("login").email
          const password = localStore.get("login").pwForAutoLogin
          await this.login({ email, password })
          return true
        }
      } catch (err: unknown) {
        const notificationsStore = useNotificationsStore()
        if (axios.isAxiosError(err) && !!err.response && err.response.data) {
          err as AxiosError<IAPIStandardErrorType>
          notificationsStore.setError(err.response.data.message)
        } else {
          notificationsStore.setError(t("messages.auth.confirm_failed_msg"))
        }
      }
    },

    async confirmPassword(code: string, newPassword: string): Promise<void> {
      try {
        await httpClient.post<void>("/users/password/confirm", {
          email: this.email,
          verificationCode: code,
          newPassword,
        })
      } catch (err: unknown) {
        const notificationsStore = useNotificationsStore()
        if (axios.isAxiosError(err) && !!err.response && err.response.data) {
          err as AxiosError<IAPIStandardErrorType>
          notificationsStore.setError(err.response.data.message)
        } else {
          notificationsStore.setError(
            t("messages.auth.confirm_password_failed_msg"),
          )
        }
        throw err
      }
    },

    async resendToken(): Promise<void> {
      const notificationsStore = useNotificationsStore()
      try {
        await httpClient.post<void>("/users/code/resend", {
          email: this.email,
        })
        notificationsStore.setSuccess("Resent successfully.")
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && !!err.response && err.response.data) {
          err as AxiosError<IAPIStandardErrorType>
          notificationsStore.setError(err.response.data.message)
        } else {
          notificationsStore.setError(t("messages.auth.email_not_sent_msg"))
        }
      }
    },

    // used to send email with verification code
    async passwordReset(email: string): Promise<void> {
      try {
        await httpClient.post<unknown>("users/password/resend", { email })
      } catch (err: unknown) {
        const notificationsStore = useNotificationsStore()
        if (axios.isAxiosError(err) && !!err.response && err.response.data) {
          err as AxiosError<IAPIStandardErrorType>
          notificationsStore.setError(err.response.data.message)
        } else {
          notificationsStore.setError(t("messages.auth.email_not_sent_msg"))
        }
      }
    },

    async authChallenge(newPassword: string): Promise<any> {
      try {
        return await httpClient.post<unknown>("/users/challenge", {
          email: this.email,
          newPassword,
          session: this.sessionToken,
        })
      } catch (err: unknown) {
        const notificationsStore = useNotificationsStore()
        if (axios.isAxiosError(err) && !!err.response && err.response.data) {
          err as AxiosError<IAPIStandardErrorType>
          notificationsStore.setError(err.response.data.message)
        } else {
          notificationsStore.setError(t("messages.auth.email_not_sent_msg"))
        }
      }
    },

    async resendPassword(email: string) {
      this.loading.forgetPassword = true
      try {
        useSessionStore().email = email
        const response = await httpClient.post<unknown>(
          "/users/password/resend",
          {
            email,
          },
        )
        if (response) {
          this.loading.forgetPassword = false
          this.email = email
        }
      } catch (err: unknown) {
        const notificationsStore = useNotificationsStore()
        this.loading.forgetPassword = false
        if (axios.isAxiosError(err) && !!err.response && err.response.data) {
          err as AxiosError<IAPIStandardErrorType>
          notificationsStore.setError(err.response.data.message)
        } else {
          notificationsStore.setError(t("messages.auth.email_not_sent_msg"))
        }
      }
    },
    async switchCustomer(customerId: string) {
      this.loading.switch = true
      try {
        await httpClient.post<unknown>("/users/customers/switch", {
          customerId,
        })

        this.loading.switch = false
        if (this.currentUser) {
          this.currentUser.selectedCustomer = {
            id: customerId,
          }
        }
      } catch (err: unknown) {
        this.loading.switch = false
        const notificationsStore = useNotificationsStore()
        if (axios.isAxiosError(err) && !!err.response && err.response.data) {
          err as AxiosError<IAPIStandardErrorType>
          notificationsStore.setError(err.response.data.message)
        } else {
          notificationsStore.setError(
            t("messages.auth.switching_customer_error_msg"),
          )
        }
      }
    },
  },
})
