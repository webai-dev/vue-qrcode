export interface ICustomer {
  name: string
  id?: string
  address?: string
  postCode?: string
  city?: string
  state?: string
  country: string
  contactPhone?: string
  contactMail?: string
  role?: { value: string }
  logo?: string
}
