import type { App } from "vue"
import type { Router, RouteRecordRaw } from "vue-router"
import type { HeadClient } from "@vueuse/head"
import type { URL_TYPES } from "./stores/GeneratorStore"

interface AppContext<HasRouter extends boolean = true> {
  app: App<Element>
  router: HasRouter extends true ? Router : undefined
  routes: HasRouter extends true ? RouteRecordRaw[] : undefined
  head: HeadClient | undefined
}

export type UserModule = (ctx: AppContext) => void

export type ILoginData = {
  email: string
  password: string
}

export type IRegistrationData = {
  email: string
  password: string
  firstName: string
  lastName: string
  acceptedTerms: boolean
}

export type ConfirmData = {
  email: string | null
  verificationCode: string
  newPassword: string
}

export type PageData = {
  page: number
  perPage: number
}

// customers

export type Customer = {
  name: string
  address: string
  postCode: string
  city: string
  state: string
  country: string
  contactPhone: string
  contactMail: string
  logo: string
  id?: string
}

export type CustomerList = Customer[]

export type InvitedUser = {
  email: string
  firstName: string
  lastName: string
  role: string
}

export type ReInvitedUser = {
  id?: string
  email: string
}

export type InvitedUsers = InvitedUser[]

export interface Column {
  key: string
  title: string
  isSelectable?: boolean
  customCellClass?: string
}

export interface ShopProps {
  customerId: string
  shopId: string
}

export interface GetShopsProps {
  customerId: string
  country?: string
}

export interface CreateShopProps extends ShopProps {
  name: string
  country: string
}

export interface EditShopProps extends ShopProps {
  id: string
  name: string
  country: string
  callback?: Function
}

export interface AllItemsProps extends ShopProps {
  windowId: number
}

export interface AddItemsProps extends ShopProps {
  windowId: number
  ean: string
  active: boolean
}

export interface DeleteItemProps extends ShopProps {
  itemId: string
}

export interface EditItemProps {
  shopId: string
  itemId: string
  windowId: string
  ean: string
  active: boolean
}

export interface IUser {
  firstName: string
  lastName: string
  email: string
  customers: any[]
  selectedCustomer: { id: string }
  id: string
}

export interface IEditUserData {
  id: string
  firstName?: string
  lastName?: string
  acceptedTerms?: boolean
  callback?: Function
}

declare global {
  interface Window {
    testStores?: { [key: string]: unknown }
    Cypress?: any
  }
}

export interface IUtmCodeUpdate {
  value: string
  index: string
}
export interface INewURLDialog {
  visible: boolean
  urlType: URL_TYPES
  headline?: string
  confirmLabel?: string
  cancelLabel?: string
  placeholder?: string
}

export enum SHORT_LINK_OPTIONS {
  DEFAULT = "default",
  CUSTOM = "custom",
}
