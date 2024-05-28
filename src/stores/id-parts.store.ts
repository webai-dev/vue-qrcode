import { defineStore } from "pinia"
import type { IIdPartSettingsDto } from "~/types/stores/GeneratorStore"
import { DELIMITER } from "~/types/stores/GeneratorStore"
import { useIdPartsApiService } from "~/composables/useIdPartsApiService"
import { useSessionStore } from "~/stores/session"
import { useNotificationsStore } from "~/stores/notifications.store"

export const useIdPartsStore = defineStore("idPartsStore", () => {
  /* ---INIT/STATE--- */
  const isLoading = ref(false)
  const parts = ref<Partial<IIdPartSettingsDto>[]>([])
  const session = useSessionStore()
  const apiService = useIdPartsApiService()
  const notificationsStore = useNotificationsStore()

  /* GETTERS */
  const getParts = computed(() => parts.value)
  const getPart = computed((index: number) => parts.value[index])

  /* ---ACTIONS--- */
  /* ---API--- */
  const saveIdParts = async (projectId: string): Promise<void> => {
    try {
      isLoading.value = true
      const customerId = session.getSelectedCustomerId!
      const indexedIdParts = parts.value.map((part, index) => ({
        ...part,
        index,
      }))

      const response = await apiService.updateIdParts(
        { customerId, projectId },
        {
          parts: indexedIdParts,
          delimiter: DELIMITER["."],
        },
      )
      parts.value = response.data.parts
    } catch (error: any) {
      notificationsStore.setError(
        error?.message as string,
        "Can not save id parts",
      )
    } finally {
      isLoading.value = false
    }
  }

  const fetchIdParts = async (projectId: string): Promise<void> => {
    try {
      isLoading.value = true
      const customerId = session.getSelectedCustomerId!
      const response = await apiService.fetchIdParts({ customerId, projectId })
      parts.value = response.data.data
    } catch (error: any) {
      notificationsStore.setError(
        error?.message as string,
        "Can not fetch id parts",
      )
    } finally {
      isLoading.value = false
    }
  }

  const emptyParts = (): void => {
    parts.value = []
  }

  return {
    isLoading,
    getParts,
    getPart,
    saveIdParts,
    fetchIdParts,
    emptyParts,
  }
})
