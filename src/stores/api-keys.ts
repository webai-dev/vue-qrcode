import { defineStore } from "pinia"
import httpClient from "~/modules/httpClient"

export interface ApiKeyDTO {
  active: boolean
  createdAt: string
  createdBy: string
  customerId: string
  id: string
  prefix: string
  updatedAt: string
}

export interface CreateApiKeyDTO {
  prefix: string
  key: string
}

export const useApiKeysStore = defineStore("apiKeys", {
  actions: {
    async list(customerId: string): Promise<ApiKeyDTO[]> {
      const response = await httpClient.get(`/customers/${customerId}/api-keys`)

      return response?.data?.data
    },

    async add(customerId: string): Promise<CreateApiKeyDTO> {
      const response = await httpClient.post<CreateApiKeyDTO>(
        `/customers/${customerId}/api-keys`,
      )

      return response.data
    },

    async delete(customerId: string, keyId: string) {
      return await httpClient.delete(
        `/customers/${customerId}/api-keys/${keyId}`,
      )
    },
  },
})
