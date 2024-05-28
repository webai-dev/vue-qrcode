export interface Country {
  code: string
  name: string
}

export interface WindowShop {
  shopId: string
  customerId: string
  name: string
  country: string
}
export interface Shop extends WindowShop {
  id: string
  createdAt: string
  updatedAt: string
}

export interface WindowArticle {
  ean: string
  windowId: number
  active: boolean
}

export interface Article extends WindowArticle {
  id: string
  createdAt: string
  updatedAt: string
  shopId: string
}

export interface WindowShopState {
  currentArticle: string
  shop: WindowShop
  article: WindowArticle
  shopList: Shop[]
  articleList: Article[]
  selectedCountry: string
  countryList: Country[]
  selectedShop: Shop
  selectedWindow: number | undefined
}
