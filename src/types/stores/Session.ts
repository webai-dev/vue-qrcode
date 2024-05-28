import type { Role } from "~/constants/permissions"

export type IUserRole =
  | Role.SuperAdmin
  | Role.CustomerAdmin
  | Role.UserView
  | Role.UserEdit
  | Role.Developer

export interface ICurrentUserCustomers {
  name: string
  id: string
  role: { value: IUserRole }
}

export interface ICurrentUser {
  acceptedTermsDate: null | string
  active?: boolean
  admin?: boolean
  createdAt?: Date
  customers: ICurrentUserCustomers[]
  email: string
  firstName: string | null
  id: string
  lastName: string | null
  updatedAt: Date
  selectedCustomer: { id: string }
}
