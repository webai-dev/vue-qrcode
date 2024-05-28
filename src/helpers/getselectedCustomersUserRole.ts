import type { IUser } from "~/types/types"

export function getSelectedCustomersUserRole(user: IUser, customerId?: string) {
  const selectedCustomerId: string = customerId || user?.selectedCustomer?.id
  const usersCustomers: any[] = user?.customers
  const customer = usersCustomers.find(
    (customer) => customer.id === selectedCustomerId,
  )
  if (customer) return customer.role.value
  return null
}
