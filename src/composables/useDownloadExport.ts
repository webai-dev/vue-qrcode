import { ref, unref } from "vue"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"
import type {
  IGeneratorProjectSetsStatusDto,
  IGeneratorFileDto,
  IMAGE_FORMATS,
  STRING_FORMATS,
} from "~/types/stores/GeneratorStore"
import { EXPORT_STATUS } from "~/types/stores/GeneratorStore"
import { useNotificationsStore } from "~/stores/notifications.store"

export const useDownloadExport = (projectId?: string, setId?: string) => {
  type DownloadData = {
    customerId: string
    projectId: string
    setId: string
    format?: STRING_FORMATS | IMAGE_FORMATS | string
    type?: "ids" | "urls" | "qrs" | string
  }

  const processing = ref(false)
  const success = ref(false)
  const error = ref(false)

  let pollInterval: NodeJS.Timeout

  const generatorStore = useGeneratorStore()
  const sessionStore = useSessionStore()
  const notificationsStore = useNotificationsStore()

  const stopPolling = () => {
    clearInterval(pollInterval)
  }

  const callback = (res: IGeneratorProjectSetsStatusDto) => {
    if (res) {
      const exportedSet = res.data.find((set) => set.id === setId)
      if (exportedSet?.status === EXPORT_STATUS.COMPLETE) {
        processing.value = false
        success.value = true
        generatorStore.getSet({
          customerId: sessionStore.getSelectedCustomerId as string,
          projectId: projectId as string,
          setId: unref(setId) as string,
        })
      } else if (exportedSet?.status === EXPORT_STATUS.FAILED) {
        processing.value = false
        error.value = true
      }
      if (!Object.keys(generatorStore.getPollingSets).length) {
        stopPolling()
      }
    } else {
      stopPolling()
      processing.value = false
      error.value = true
    }
  }

  const polling = () => {
    processing.value = true
    pollInterval = setInterval(() => {
      generatorStore.pollSetStatus({
        customerId: sessionStore.getSelectedCustomerId as string,
        projectId: projectId as string,
        setId: unref(setId) as string,
        callback,
      })
    }, 1000)
  }

  const startPolling = () => {
    if (
      !generatorStore.getSingleSet?.id ||
      generatorStore.getSingleSet?.id !== setId
    ) {
      generatorStore.getSet({
        customerId: sessionStore.getSelectedCustomerId as string,
        projectId: projectId as string,
        setId: unref(setId) as string,
        callback: () => polling(),
      })
    } else {
      polling()
    }
  }

  const downloadURI = (uri: string, name: string) => {
    try {
      const link = document.createElement("a")
      link.download = name
      link.href = `data:${uri}`
      link.click()
    } catch (err: any) {
      notificationsStore.setError("Download failed", "Error")
    }
  }

  const startDownload = (
    type?: "ids" | "urls" | "qrs" | string,
    format?: STRING_FORMATS | IMAGE_FORMATS | string,
  ) => {
    try {
      const exports: any = generatorStore.getSingleSet?.exports
      if (format && type) {
        const exportFiles = exports[type]?.files
        const file = exportFiles.find((fileItem: IGeneratorFileDto) =>
          fileItem.name.toLowerCase().includes(format.toLowerCase()),
        )
        downloadURI(file.downloadUrl, file.name)
      } else {
        const allTypes = ["ids", "urls", "qrs"]
        allTypes.forEach((typeItem) => {
          const exportFiles = exports[typeItem]?.files
          exportFiles &&
            exportFiles.length &&
            exportFiles.forEach((file: IGeneratorFileDto) => {
              downloadURI(file.downloadUrl, file.name)
            })
        })
      }
    } catch (err: any) {
      notificationsStore.setError("Download could not be started", "Error")
    }
  }

  const downloadSet = ({
    customerId,
    projectId,
    setId,
    format,
    type,
  }: DownloadData): void => {
    if (setId === generatorStore.getSingleSet.id) {
      startDownload(type, format)
    } else {
      generatorStore.getSet({
        customerId,
        projectId,
        setId,
        callback: () => startDownload(type, format),
      })
    }
  }

  const startSingleQrDownload = () => {
    try {
      downloadURI(
        generatorStore.getSingleQr?.svg?.downloadUrl,
        generatorStore.getSingleQr?.svg?.name,
      )
    } catch (err: any) {
      notificationsStore.setError("Download could not be started", "Error")
    }
  }

  const downloadSingleQr = ({ customerId, singleQrId }: any): void => {
    if (singleQrId === generatorStore.getSingleQr?.id) {
      startSingleQrDownload()
    } else {
      generatorStore.getSingleQrTag({
        customerId,
        singleQrId,
        callback: () => startSingleQrDownload(),
      })
    }
  }

  onBeforeUnmount(() => {
    clearInterval(pollInterval)
  })

  return {
    processing,
    success,
    error,
    startPolling,
    downloadSet,
    downloadSingleQr,
  }
}
