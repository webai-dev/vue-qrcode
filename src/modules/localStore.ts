import type StoreJsAPI from "store"
import { createStore } from "store/src/store-engine"
import localStorage from "store/storages/localStorage"
import defaultsPlugin from "store/plugins/defaults"
import updatePlugin from "store/plugins/update"

// defined methods from plugins
export interface ExtendedStoreJsAPI extends StoreJsAPI {
  defaults(value: any): void
  update(key: string, cb: (data: any) => void): void
}

export interface ILocalStoreLogin {
  email?: string
  sessionToken?: string
  pwForAutoLogin?: string
}

export interface LocalStore {
  login: ILocalStoreLogin
  acceptedTerms: boolean
  locale: string
}

export const getDefaultLocalState = (): LocalStore => ({
  login: {
    email: "",
    sessionToken: "",
    pwForAutoLogin: "",
  },
  acceptedTerms: false,
  locale: "de",
})

export const localStore = createStore(
  [localStorage],
  [defaultsPlugin, updatePlugin],
  "a4l_",
) as ExtendedStoreJsAPI
localStore.defaults(getDefaultLocalState())
