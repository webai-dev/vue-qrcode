<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useToast } from "~/components/shared/toast/useToast"
import {
  useNotificationsStore,
  NotificationType,
} from "~/stores/notifications.store"

const toast = useToast()
const notificationsStore = useNotificationsStore()
const { getNotification } = storeToRefs(notificationsStore)

const notificationFn = {
  [NotificationType.Error]: toast.error,
  [NotificationType.Success]: toast.success,
  [NotificationType.Warning]: toast.warning,
  [NotificationType.Info]: toast.info,
}

watch(getNotification, (notification) => {
  if (notification) {
    const { type, message, title } = notification
    notificationFn[type](message, title)
  }
})
</script>

<template>
  <slot />
</template>
