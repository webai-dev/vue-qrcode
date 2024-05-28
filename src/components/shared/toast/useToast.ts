import { useToast as useToastificationToast } from "vue-toastification"
import type { TYPE } from "vue-toastification"
import type { ToastOptions, ToastID } from "vue-toastification/dist/types/types"
import ToastText from "./ToastText.vue"
import CloseBtn from "./CloseBtn.vue"
import SuccessIcon from "~/assets/icons/toast/icon-toast-success.svg?component"
import ErrorIcon from "~/assets/icons/toast/icon-toast-error.svg?component"
import WarningIcon from "~/assets/icons/toast/icon-toast-warning.svg?component"
import InfoIcon from "~/assets/icons/toast/icon-toast-info.svg?component"

export function useToast() {
  const toast = useToastificationToast()

  function success(
    body: string,
    title?: string,
    options?: ToastOptions & { type?: TYPE.SUCCESS },
  ): ToastID {
    return toast.success(
      { component: ToastText, props: { body, title } },
      {
        ...options,
        closeButton: CloseBtn,
        icon: SuccessIcon,
      },
    )
  }

  function error(
    body: string,
    title?: string,
    options?: ToastOptions & { type?: TYPE.ERROR },
  ): ToastID {
    return toast.error(
      { component: ToastText, props: { body, title } },
      {
        ...options,
        closeButton: CloseBtn,
        icon: ErrorIcon,
      },
    )
  }

  function warning(
    body: string,
    title?: string,
    options?: ToastOptions & { type?: TYPE.WARNING },
  ): ToastID {
    return toast.warning(
      { component: ToastText, props: { body, title } },
      {
        ...options,
        closeButton: CloseBtn,
        icon: WarningIcon,
      },
    )
  }

  function info(
    body: string,
    title?: string,
    options?: ToastOptions & { type?: TYPE.INFO },
  ): ToastID {
    return toast.info(
      { component: ToastText, props: { body, title } },
      {
        ...options,
        closeButton: CloseBtn,
        icon: InfoIcon,
      },
    )
  }

  return {
    success,
    error,
    warning,
    info,
  }
}
