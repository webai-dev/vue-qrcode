import { defineStore } from "pinia"
import stringify from "qs-stringify"
import { deepUnref } from "vue-deepunref"
import httpClient from "~/modules/httpClient"

import type {
  ICreateIdPartData,
  ICreateProjectData,
  ICreateSetData,
  IDeleteIdPartData,
  IDeleteProjectData,
  IGenerateSingleQrTagData,
  IGeneratorProjectDto,
  IGeneratorProjectsDto,
  IGeneratorProjectSetCreateDto,
  IGeneratorProjectSetDto,
  IGeneratorProjectSetsStatusDto,
  IGeneratorSettingsDto,
  IDomainNameDto,
  IGeneratorSingleQrDto,
  IGeneratorSingleQrsListData,
  IGeneratorSingleQrsListDto,
  IGeneratorProjectsAndSingleQrTagsListtDto,
  IGeneratorUrlDto,
  IGeneratorUrlsDto,
  IGetProjectData,
  IGetProjectsData,
  IGetSetData,
  IGetSetsPerProjectData,
  IGetSingleQrTagData,
  IIdPartSettingsDto,
  IPollSetStatusData,
  IReorderIdPartData,
  ISetsPerProject,
  IUpdateIdPartData,
  IUpdateProjectData,
  IUpdateSetData,
  IDeleteSetData,
  IGeneratorGlobalSettingsDto,
  IUpdateSingleQrTagData,
  IAddSingleQrTagsToProjectsListData,
} from "~/types/stores/GeneratorStore"
import {
  DELIMITER,
  EXPORT_STATUS,
  INCREMENT,
  SET_EXPORT_STATUS,
  URL_TYPES,
} from "~/types/stores/GeneratorStore"
import { PAGINATION_ORDER, PAGINATION_ORDER_BY } from "~/types/stores/common"
import { useNotificationsStore } from "~/stores/notifications.store"
import { i18n } from "~/modules/i18n"

const { t } = i18n.global

export const useGeneratorStore = defineStore("generatorStore", {
  state: () => ({
    projectsAndSingleQrTags: {
      data: [],
      perPage: 30,
      page: 1,
      lastPage: 1,
      totalCount: 1,
    } as IGeneratorProjectsAndSingleQrTagsListtDto,
    project: {
      id: "",
      name: "",
      settings: {
        id: {
          parts: [] as IIdPartSettingsDto[],
        },
        longURLBase: "",
        shortURLDomain: "",
      } as IGeneratorSettingsDto,
    } as IGeneratorProjectDto,
    singleQrTags: {
      data: [],
      perPage: 5,
      page: 1,
      lastPage: 1,
      totalCount: 1,
    } as IGeneratorSingleQrsListDto,
    // pollingSets: [] as string[],
    pollingSets: {} as any,
    set: {} as IGeneratorProjectSetDto,
    sets: {} as ISetsPerProject,
    urlSuggest: [] as Array<IGeneratorUrlDto>,
    singleQr: {} as IGeneratorSingleQrDto,
    generatorSettings: {} as IGeneratorGlobalSettingsDto,
    domainNames: [] as IDomainNameDto[],
    loading: {
      project: false,
      creatingProject: false,
      deletingProject: false,
      singleQr: false,
      deletingSingleQr: false,
      creatingIdPart: false,
      updatingIdPart: "",
      reorderingIdPart: "",
      deletingIdPart: false,
      creatingSet: false,
      deletingSet: false,
      urlSuggest: false,
      generatingSingleQr: false,
      singleQrTags: false,
      projectsAndSingleQrTags: false,
      projectsAndSingleQrTagsPart: false,
      singleQrTagsPart: false,
    },
    fetched: {
      project: false,
      urlSuggest: false,
      singleQr: false,
      generatorSettings: false,
      domainNames: false,
      singleQrTags: false,
      projectsAndSingleQrTags: false,
    },
    created: {
      project: false,
    },
    polling: {
      sets: false,
    },
  }),
  getters: {
    // entities
    getAllProjectsAndSingleQrTags: (state) =>
      state.projectsAndSingleQrTags.data,
    getSingleQrsList: (state) => state.singleQrTags,
    getSingleProject: (state) => state.project,
    getProjectId: (state) => state.project.id,
    getSingleProjectSettings: (state) => state.project?.settings?.id?.parts,
    hasProjectAnyFilledSettingParts: (state) =>
      state.project?.settings?.id?.parts.some(
        (part) => part.startValue !== "" || part.increment === INCREMENT.RANDOM,
      ),
    getPollingSets: (state) => state.pollingSets,
    getSingleSet: (state) => state.set,
    getAllCustomerLongUrls: (state) =>
      state.urlSuggest.filter((url) => url.type === URL_TYPES.long),
    getAllCustomerShortUrls: (state) =>
      state.urlSuggest.filter((url) => url.type === URL_TYPES.short),
    getSingleQr: (state) => state.singleQr,
    getAllSets: (state) => state.sets,
    getGlobalShortUrl: (state) => state.generatorSettings.shortUrlDomainName,
    getAllDomainNames: (state) => state.domainNames,

    // loading
    isProjectsAndSingleQrTagsLoading: (state) =>
      state.loading.projectsAndSingleQrTags,
    isProjectsAndSingleQrTagsPartLoading: (state) =>
      state.loading.projectsAndSingleQrTagsPart,
    isSingleQrTagsPartLoading: (state) => state.loading.singleQrTagsPart,
    isProjectLoading: (state) => state.loading.project,
    isSingleQrLoading: (state) => state.loading.singleQr,
    isCreatingProject: (state) => state.loading.creatingProject,
    isCreatingIdPart: (state) => state.loading.creatingIdPart,
    isUpdatingIdPart: (state) => state.loading.updatingIdPart,
    isReorderingIdPart: (state) => state.loading.reorderingIdPart,
    isDeletingIdPart: (state) => state.loading.deletingIdPart,
    isCreatingSet: (state) => state.loading.creatingSet,
    isUrlSuggestLoading: (state) => state.loading.urlSuggest,
    isGeneratingSingleQrLoading: (state) => state.loading.generatingSingleQr,
    isDeletingProject: (state) => state.loading.deletingProject,
    isDeletingSet: (state) => state.loading.deletingSet,

    // polling
    isPollingSets: (state) => state.polling.sets,

    // fetched
    isProjectsAndSingleQrTagsFetched: (state) =>
      state.fetched.projectsAndSingleQrTags,
    isProjectFetched: (state) => state.fetched.project,
    isUrlSuggestFetched: (state) => state.fetched.urlSuggest,
    isSingleQrFetched: (state) => state.fetched.singleQr,
    isGeneratorSettingsFetched: (state) => state.fetched.generatorSettings,
    isDomainNamesFetched: (state) => state.fetched.domainNames,

    // created
    isProjectCreated: (state) => state.created.project,
  },
  actions: {
    async createProject({
      customerId,
      name,
    }: ICreateProjectData): Promise<void> {
      this.loading.creatingProject = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.post<IGeneratorProjectDto>(
          `customers/${customerId}/generator/projects`,
          { name },
        )
        if (response?.data) {
          this.project = response.data
          this.fetched.project = true
          this.loading.creatingProject = false
          this.created.project = true
        }
      } catch (err: any) {
        this.loading.creatingProject = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.create_project_failed_msg"),
          t("common.error"),
        )
      }
    },

    resetProjectCreated() {
      this.created.project = false
      this.project = {
        name: "",
        settings: {
          id: {
            parts: [] as IIdPartSettingsDto[],
          },
          longURLBase: "",
          shortURLDomain: "",
        } as IGeneratorSettingsDto,
      } as IGeneratorProjectDto
      this.fetched.project = false
    },

    async updateProject({
      customerId,
      projectId,
      payload,
      callback,
      preventLoader,
    }: IUpdateProjectData): Promise<void> {
      this.loading.project = !preventLoader
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.patch(
          `/customers/${customerId}/generator/projects/${projectId}`,
          payload,
        )
        if (response?.data) {
          this.project = response.data
          this.loading.project = false
          callback && callback()
        }
      } catch (err: any) {
        this.loading.project = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.update_project_failed_msg"),
          t("common.error"),
        )
      }
    },

    async getProject({
      customerId,
      projectId,
      callback,
    }: IGetProjectData): Promise<void> {
      this.loading.project = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.get<IGeneratorProjectDto>(
          `/customers/${customerId}/generator/projects/${projectId}`,
        )
        if (response?.data) {
          this.project = response.data as IGeneratorProjectDto
          this.loading.project = false
          this.fetched.project = true
          callback && callback()
        }
      } catch (err: any) {
        this.loading.project = false
        this.fetched.project = true
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_project_failed_msg"),
          t("common.error"),
        )
      }
    },

    async deleteProject({
      customerId,
      projectId,
      callback,
    }: IDeleteProjectData): Promise<void> {
      this.loading.deletingProject = true
      const notificationsStore = useNotificationsStore()
      try {
        await httpClient.delete(
          `/customers/${customerId}/generator/projects/${projectId}`,
        )
        this.loading.deletingProject = false
        callback && callback()
      } catch (err: any) {
        this.loading.deletingProject = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.delete_project_failed_msg"),
          t("common.error"),
        )
      }
    },

    async createIdPart({
      customerId,
      projectId,
      payload,
      callback,
    }: ICreateIdPartData): Promise<void> {
      this.loading.creatingIdPart = true
      try {
        const response = await httpClient.post<IIdPartSettingsDto>(
          `/customers/${customerId}/generator/projects/${projectId}/settings/id/parts`,
          payload,
        )
        if (response?.data) {
          this.loading.creatingIdPart = false
          if (this.project.settings?.id) {
            if (this.project.settings.id?.parts) {
              this.project.settings.id.parts =
                this.project.settings.id.parts.concat([response.data])
            }
          } else {
            this.project.settings = {
              ...this.project.settings,
              id: {
                parts: [response.data],
                delimiter: DELIMITER[" "],
              },
            }
          }
          callback && callback()
        }
      } catch (err: any) {
        this.loading.creatingIdPart = false
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.save_id_part_failed_msg"),
          t("common.error"),
        )
      }
    },

    async updateIdPart({
      customerId,
      projectId,
      partId,
      payload,
      callback,
    }: IUpdateIdPartData): Promise<void> {
      this.loading.updatingIdPart = partId
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.patch<IIdPartSettingsDto>(
          `/customers/${customerId}/generator/projects/${projectId}/settings/id/parts/${partId}`,
          payload,
        )
        if (response?.data) {
          this.loading.updatingIdPart = ""
          this.project.settings.id.parts = this.project.settings.id.parts.map(
            (elem) => (elem.id === partId ? response.data : elem),
          )
          callback && callback()
        }
      } catch (err: any) {
        this.loading.updatingIdPart = ""
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.save_id_part_failed_msg"),
          t("common.error"),
        )
      }
    },

    async reorderIdPart({
      customerId,
      projectId,
      payload,
    }: IReorderIdPartData): Promise<void> {
      this.loading.reorderingIdPart = payload.itemId
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.post(
          `/customers/${customerId}/generator/projects/${projectId}/settings/id/parts/reorder`,
          payload,
        )
        if (response) {
          this.loading.reorderingIdPart = ""
        }
      } catch (err: any) {
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.reordering_id_part_failed_msg"),
          t("common.error"),
        )
      }
    },

    async deleteIdPart({
      customerId,
      projectId,
      partId,
      callback,
    }: IDeleteIdPartData): Promise<void> {
      this.loading.deletingIdPart = true
      try {
        const response = await httpClient.delete(
          `/customers/${customerId}/generator/projects/${projectId}/settings/id/parts/${partId}`,
        )
        if (response) {
          this.loading.deletingIdPart = false
          this.project.settings.id.parts =
            this.project.settings.id.parts.filter((elem) => elem.id !== partId)
          callback && callback()
        }
      } catch (err: any) {
        this.loading.deletingIdPart = false
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.deleting_id_part_failed_msg"),
          t("common.error"),
        )
      }
    },

    async createSet({
      customerId,
      projectId,
      amount,
      options,
      exports,
      callback,
    }: ICreateSetData): Promise<void> {
      this.loading.creatingSet = true
      const notificationsStore = useNotificationsStore()
      try {
        const data: IGeneratorProjectSetCreateDto = {
          amount,
          options,
          exports,
        }
        const response = await httpClient.post<IGeneratorProjectSetDto>(
          `/customers/${customerId}/generator/projects/${projectId}/sets`,
          data,
        )
        if (response.data) {
          this.loading.creatingSet = false
          this.set = response.data
          callback && callback(response.data)
        }
      } catch (err: any) {
        this.loading.creatingSet = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.create_set_failed"),
          t("common.error"),
        )
      }
    },

    addSetsToPolling(projectId: string, setIds: string[]) {
      if (this.pollingSets[projectId]) {
        this.pollingSets[projectId] = this.pollingSets[projectId].concat(setIds)
      } else {
        this.pollingSets[projectId] = setIds
      }
      /** TODO: start polling as soon as there are setIds in array,
       * once separation between projects is removed**/
    },

    removeSetFromPolling(projectId: string, setId: string) {
      const setsToPollLeft = this.pollingSets[projectId]
        ? this.pollingSets[projectId].filter(
            (setIdString: string) => setIdString !== setId,
          )
        : []
      if (setsToPollLeft.length) {
        this.pollingSets[projectId] = setsToPollLeft
      } else {
        delete this.pollingSets[projectId]
      }
      if (!Object.keys(this.pollingSets).length) {
        this.polling.sets = false
      }
    },

    async pollSetStatus({
      customerId,
      projectId,
      setId,
      callback,
    }: IPollSetStatusData): Promise<void> {
      this.polling.sets = true
      const notificationsStore = useNotificationsStore()
      /** TODO: polling should not be divided by projectId, this becomes a
       * polling nightmare for the overview page
       * **/
      try {
        if (
          this.pollingSets[projectId] &&
          this.pollingSets[projectId].every((sId: string) => sId !== setId)
        ) {
          this.pollingSets[projectId] = this.pollingSets[projectId].concat([
            setId,
          ])
        } else {
          this.pollingSets[projectId] = [setId]
        }
        const response = await httpClient.get<IGeneratorProjectSetsStatusDto>(
          `/customers/${customerId}/generator/projects/${projectId}/sets/status?${stringify(
            { ids: deepUnref(this.pollingSets[projectId]) },
          )}`,
        )
        if (response?.data) {
          this.pollingSets[projectId] = response.data.data
            .filter((set) => set.status === EXPORT_STATUS.PROCESSING)
            .map((set) => set.id)
          if (!Object.keys(this.pollingSets).length) this.polling.sets = false
          if (!this.pollingSets[projectId].length) {
            delete this.pollingSets[projectId]
          }
          callback && callback(response.data)
        }
      } catch (err: any) {
        this.removeSetFromPolling(projectId, setId)
        callback && callback()
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_set_status_failed"),
          t("common.error"),
        )
      }
    },

    updateSetInSets({ projectId, setId, setData }: any) {
      if (this.sets[projectId]) {
        const idx = this.sets[projectId].data.findIndex(
          (set) => set.id === setId,
        )
        if (~idx) {
          this.sets[projectId].data = this.sets[projectId].data.map((set) =>
            set.id === setId ? setData : set,
          )
        }
      }
    },

    async getSet({
      customerId,
      projectId,
      setId,
      callback,
    }: IGetSetData): Promise<void> {
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.get<IGeneratorProjectSetDto>(
          `/customers/${customerId}/generator/projects/${projectId}/sets/${setId}`,
        )
        if (response?.data) {
          this.set = response.data
          this.updateSetInSets({ projectId, setId, setData: response.data })
          if (response.data.status === SET_EXPORT_STATUS.PROCESSING) {
            this.addSetsToPolling(projectId, [setId])
          }
          callback && callback()
        }
      } catch (err: any) {
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_set_failed"),
          t("common.error"),
        )
      }
    },

    async getAllSetsOfProject({
      customerId,
      projectId,
      page,
    }: IGetSetsPerProjectData): Promise<void> {
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.get(
          `/customers/${customerId}/generator/projects/${projectId}/sets`,
          { params: { page, perPage: this.sets[projectId]?.perPage || 10 } },
        )
        if (response?.data) {
          this.sets[projectId] = response.data
          const setIdsToPoll = response.data.data.reduce(
            (acc: string[], curr: IGeneratorProjectSetDto) => {
              if (curr.status === SET_EXPORT_STATUS.PROCESSING) {
                acc.push(curr.id)
              }
              return acc
            },
            [],
          )
          setIdsToPoll.length && this.addSetsToPolling(projectId, setIdsToPoll)
        }
      } catch (err: any) {
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_sets_failed"),
          t("common.error"),
        )
      }
    },

    async updateSet({
      customerId,
      projectId,
      setId,
      payload,
      callback,
    }: IUpdateSetData): Promise<void> {
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.patch(
          `/customers/${customerId}/generator/projects/${projectId}/sets/${setId}`,
          payload,
        )
        if (response?.data) {
          this.updateSetInSets({ projectId, setId, setData: response.data })

          if (this.set.id === setId) {
            this.set = response.data
          }
          callback && callback()
        }
      } catch (err: any) {
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.update_set_failed"),
          t("common.error"),
        )
      }
    },

    async deleteSet({
      customerId,
      projectId,
      setId,
      callback,
    }: IDeleteSetData): Promise<void> {
      this.loading.deletingSet = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.delete(
          `/customers/${customerId}/generator/projects/${projectId}/sets/${setId}`,
        )
        if (response) {
          this.sets[projectId].data = this.sets[projectId].data.filter(
            (set) => set.id !== setId,
          )
          if (this.set.id === setId) this.set = {} as IGeneratorProjectSetDto
          this.loading.deletingSet = false
          callback && callback()
        }
      } catch (err: any) {
        this.loading.deletingSet = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.delete_set_failed"),
          t("common.error"),
        )
      }
    },

    async getUrlSuggestions({
      customerId,
    }: {
      customerId: string
    }): Promise<void> {
      this.loading.urlSuggest = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.get<IGeneratorUrlsDto>(
          `/customers/${customerId}/generator/suggestions/urls`,
        )
        if (response?.data) {
          this.loading.urlSuggest = false
          this.fetched.urlSuggest = true
          this.urlSuggest = response.data.data
        }
      } catch (err: any) {
        this.loading.urlSuggest = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_url_failed"),
          t("common.error"),
        )
      }
    },

    async generateSingleQrTag({
      customerId,
      longURL,
      callback,
    }: IGenerateSingleQrTagData): Promise<void> {
      this.loading.generatingSingleQr = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.post<IGeneratorSingleQrDto>(
          `/customers/${customerId}/generator/single/qrs/QR`,
          { longURL },
        )
        if (response?.data) {
          this.loading.generatingSingleQr = false
          this.fetched.singleQr = true
          this.singleQr = response.data
          callback && callback(response.data)
        }
      } catch (err: any) {
        this.loading.generatingSingleQr = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.generate_qr_tag_failed"),
          t("common.error"),
        )
      }
    },

    async getSingleQrTag({
      customerId,
      singleQrId,
      callback,
    }: IGetSingleQrTagData): Promise<void> {
      this.loading.singleQr = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.get<IGeneratorSingleQrDto>(
          `/customers/${customerId}/generator/single/qrs/QR/${singleQrId}`,
        )
        if (response?.data) {
          this.loading.singleQr = false
          this.fetched.singleQr = true
          this.singleQr = response.data
          callback && callback()
        }
      } catch (err: any) {
        this.loading.singleQr = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_qr_tag_failed"),
          t("common.error"),
        )
      }
    },

    async updateSingleQrTag({
      customerId,
      singleQrId,
      payload,
      callback,
    }: IUpdateSingleQrTagData): Promise<void> {
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.patch<IGeneratorSingleQrDto>(
          `/customers/${customerId}/generator/single/qrs/QR/${singleQrId}`,
          payload,
        )
        if (response?.data) {
          await this.addSingleQrTagsToProjectsList({ customerId })
          // TODO - test if the list refreshes properly after backend sorting is finished
          callback && callback()
        }
      } catch (err: any) {
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.update_qr_tag_failed"),
          t("common.error"),
        )
      }
    },

    async deleteSingleQrTag({
      customerId,
      singleQrId,
      callback,
    }: IGetSingleQrTagData): Promise<void> {
      this.loading.deletingSingleQr = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.delete<IGeneratorSingleQrDto>(
          `/customers/${customerId}/generator/single/qrs/QR/${singleQrId}`,
        )

        if (response) {
          if (this.singleQr.id === singleQrId)
            this.singleQr = {} as IGeneratorSingleQrDto

          await this.addSingleQrTagsToProjectsList({ customerId })
          this.loading.deletingSingleQr = false
          callback && callback()
        }
      } catch (err: any) {
        this.loading.singleQr = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.delete_qr_tag_failed"),
          t("common.error"),
        )
      }
    },

    async deleteAllSingleQRTags({
      customerId,
      callback,
    }: {
      customerId: string
      callback: Function
    }): Promise<void> {
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.delete(
          `/customers/${customerId}/generator/single/qrs/QR`,
        )
        if (response) {
          this.singleQrTags.data = []
          this.projectsAndSingleQrTags.data =
            this.projectsAndSingleQrTags.data.filter(
              (entity) => !Array.isArray(entity),
            )
          callback && callback()
        }
      } catch (err: any) {
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.delete_qr_tags_failed"),
          t("common.error"),
        )
      }
    },

    async getGeneratorSettings({ customerId }: { customerId: string }) {
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.get(
          `/customers/${customerId}/generator/settings`,
        )
        if (response?.data) {
          this.generatorSettings = response.data
          this.fetched.generatorSettings = true
        }
      } catch (err: any) {
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_generator_settings_failed"),
          t("common.error"),
        )
      }
    },

    async getDomainNames({ customerId }: { customerId: string }) {
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.get(
          `/customers/${customerId}/generator/short-url-domain-names`,
        )
        if (response?.data) {
          this.fetched.domainNames = true
          this.domainNames = response.data
        }
      } catch (err: any) {
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_domain_names_failed"),
          t("common.error"),
        )
      }
    },

    async getSingleQrTagsList({
      customerId,
      page,
      order = PAGINATION_ORDER.DESC,
      orderBy = PAGINATION_ORDER_BY.CREATED_AT,
    }: IGeneratorSingleQrsListData): Promise<void> {
      this.loading.singleQrTags = true
      const notificationsStore = useNotificationsStore()
      try {
        const response = await httpClient.get<IGeneratorSingleQrsListDto>(
          `/customers/${customerId}/generator/single/qrs/QR`,
          {
            params: {
              page,
              perPage: this.singleQrTags.perPage,
              order,
              orderBy,
            },
          },
        )
        if (response?.data) {
          this.loading.singleQrTags = false
          this.fetched.singleQrTags = true
          this.singleQrTags = response.data
        }
      } catch (err: any) {
        this.loading.singleQrTags = false
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_qr_tags_failed"),
          t("common.error"),
        )
      }
    },

    async addSingleQrTagsToProjectsList({
      customerId,
      projectsListPage,
    }: IAddSingleQrTagsToProjectsListData) {
      // fetch 1st page of singleQrTags result to be able to put them
      // in proper place among projects - latest single tag taken as reference
      projectsListPage === 1 &&
        (await this.getSingleQrTagsList({
          customerId,
          page: 1,
        }))

      const latestSingleQrTag = this.singleQrTags.data[0]

      const projects = this.projectsAndSingleQrTags.data

      const singleQrTagsIdx = latestSingleQrTag
        ? projects.findIndex(
            (project) =>
              new Date((project as IGeneratorProjectDto).createdAt) <
              new Date(latestSingleQrTag.createdAt),
          )
        : -1

      singleQrTagsIdx > -1 &&
        projects.splice(singleQrTagsIdx, 0, this.singleQrTags.data)
    },

    async getProjectsAndSingleQrTagsList({
      customerId,
      page,
      perPage,
      order = PAGINATION_ORDER.DESC,
      orderBy = PAGINATION_ORDER_BY.CREATED_AT,
    }: IGetProjectsData): Promise<void> {
      !page || page === 1
        ? (this.loading.projectsAndSingleQrTags = true)
        : (this.loading.projectsAndSingleQrTagsPart = true)

      try {
        const responseProjects = await httpClient.get<IGeneratorProjectsDto>(
          `/customers/${customerId}/generator/projects`,
          {
            params: {
              page: page || 1,
              perPage: perPage || this.projectsAndSingleQrTags.perPage,
              order,
              orderBy,
            },
          },
        )

        this.projectsAndSingleQrTags = {
          data: [
            // if page is undefined or 1, it means refetch after update
            // so previous state is cleared
            ...(page && page > 1 ? this.projectsAndSingleQrTags.data : []),
            ...responseProjects.data.data,
          ],
          perPage: perPage || this.projectsAndSingleQrTags.perPage,
          page: responseProjects.data.page,
          lastPage: Math.max(responseProjects.data.lastPage),
          totalCount: responseProjects.data.totalCount,
        }

        await this.addSingleQrTagsToProjectsList({
          customerId,
          projectsListPage: page,
        })

        this.loading.projectsAndSingleQrTags = false
        this.loading.projectsAndSingleQrTagsPart = false
        this.fetched.projectsAndSingleQrTags = true
      } catch (err: any) {
        console.error(err)
        const notificationsStore = useNotificationsStore()
        notificationsStore.setError(
          err?.response?.data?.message ||
            t("generator.messages.get_generator_projects_failed"),
          t("common.error"),
        )
      }
    },
  },
})
