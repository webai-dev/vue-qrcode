<script setup lang="ts">
import CloseIcon from "@/assets/icons/toast/icon-toast-close.svg?component"
import InfoIcon from "@/assets/icons/toast/icon-toast-info.svg?component"
import WarningIcon from "@/assets/icons/toast/icon-toast-warning.svg?component"
import ErrorIcon from "@/assets/icons/toast/icon-toast-error.svg?component"
import SuccessIcon from "@/assets/icons/toast/icon-toast-success.svg?component"

export type NotificationType = "success" | "info" | "warning" | "error"

export interface NotificationProps {
  type: NotificationType
  title?: string
}

const props = withDefaults(defineProps<NotificationProps>(), {
  type: "info",
})

const emits = defineEmits<{
  (e: "close"): void
}>()

function onClose() {
  emits("close")
}
</script>

<template>
  <div :class="['lc-notification', 'lc-notification--' + props.type]">
    <div class="lc-notification__icon">
      <InfoIcon v-if="props.type === 'info'" data-cy="info-icon" />
      <WarningIcon v-if="props.type === 'warning'" data-cy="warning-icon" />
      <ErrorIcon v-if="props.type === 'error'" data-cy="error-icon" />
      <SuccessIcon v-if="props.type === 'success'" data-cy="success-icon" />
    </div>
    <div class="lc-notification__body">
      <span v-if="props.title" class="lc-notification__title">{{
        props.title
      }}</span>
      <slot style="margin-top: 0.25rem"></slot>
    </div>
    <div class="lc-notification__close"><CloseIcon @click="onClose()" /></div>
  </div>
</template>

<style lang="scss" scoped>
.lc-notification {
  display: flex;
  font-size: 14px;
  width: 100%;
  padding: 1rem;
  border: 1px solid;
  border-radius: 8px;
  &--info {
    background-color: var(--clr-primary-25);
    color: var(--clr-primary-700);
    border-color: var(--clr-primary-300);
  }
  &--success {
    background-color: var(--clr-success-25);
    color: var(--clr-success-700);
    border-color: var(--clr-success-300);
  }
  &--error {
    background-color: var(--clr-error-25);
    color: var(--clr-error-700);
    border-color: var(--clr-error-300);
  }
  &--warning {
    background-color: var(--clr-warning-25);
    color: var(--clr-warning-700);
    border-color: var(--clr-warning-300);
  }
}

.lc-notification__icon {
  margin-right: 1rem;
  height: 20px;
}
.lc-notification__close {
  margin-left: auto;
  height: 10px;
  opacity: 0.8;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
}
.lc-notification__title {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>
