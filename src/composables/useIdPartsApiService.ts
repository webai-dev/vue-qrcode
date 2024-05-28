import type { AxiosResponse } from "axios"
import type {
  IIdPartSettingsDto,
  DELIMITER,
  IIdSettingsDto,
  IProjectIdPartsDto,
} from "~/types/stores/GeneratorStore"
import httpClient from "~/modules/httpClient"

export type IdPartsApiParams = {
  customerId: string
  projectId: string
}

const fetchUrl = (params: IdPartsApiParams) =>
  `/customers/${params.customerId}/generator/projects/${params.projectId}/settings/id/parts/`

const patchUrl = (params: IdPartsApiParams) =>
  `/customers/${params.customerId}/generator/projects/${params.projectId}/settings/id/`

export const useIdPartsApiService = () => {
  async function fetchIdParts(
    params: IdPartsApiParams,
  ): Promise<AxiosResponse<IProjectIdPartsDto>> {
    return await httpClient.get(fetchUrl(params))
  }

  async function updateIdParts(
    params: IdPartsApiParams,
    data: {
      parts?: Partial<IIdPartSettingsDto>[]
      delimiter: DELIMITER
    },
  ): Promise<AxiosResponse<IIdSettingsDto>> {
    return await httpClient.patch(patchUrl(params), data)
  }

  return {
    fetchIdParts,
    updateIdParts,
  }
}
