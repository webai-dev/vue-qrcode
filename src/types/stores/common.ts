// PAGINATION

export enum PAGINATION_ORDER {
  ASC = "ASC",
  DESC = "DESC",
}

export enum PAGINATION_ORDER_BY {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export interface IPaginationOrder {
  order: PAGINATION_ORDER
  orderBy: PAGINATION_ORDER_BY
}

export interface IPagination<data> {
  page: number
  perPage: number
  lastPage: number
  totalCount: number
  order?: IPaginationOrder
  data: data
}
