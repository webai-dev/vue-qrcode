import { defineStore } from "pinia"
import type { Ref } from "vue"

export enum NotificationType {
  Error = "error",
  Success = "success",
  Warning = "warning",
  Info = "info",
}

type Notification = { message: string; type: NotificationType; title?: string }

export const useNotificationsStore = defineStore("notificationsStore", () => {
  const notification: Ref<Notification | null> = ref(null)

  const setNotification = (
    message: string,
    type: NotificationType,
    title?: string,
  ) => {
    notification.value = { message, type, title }
  }

  const setError = (message: string, title?: string) =>
    setNotification(message, NotificationType.Error, title)

  const setSuccess = (message: string, title?: string) =>
    setNotification(message, NotificationType.Success, title)

  const setWarning = (message: string, title?: string) =>
    setNotification(message, NotificationType.Warning, title)

  const setInfo = (message: string, title?: string) =>
    setNotification(message, NotificationType.Info, title)

  const getNotification = computed(() => {
    return notification.value
  })

  return {
    setError,
    setSuccess,
    setWarning,
    setInfo,
    getNotification,
  }
})
