import type { Ref } from "vue"
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { useCustomerStore } from "~/stores/customer"

export function useTransferPermission(refsToToggle?: Ref[]) {
  const showTransferPermission = ref(false)
  const customerStore = useCustomerStore()
  const { transferPermission } = storeToRefs(customerStore)

  watch(transferPermission, (newVal, oldVal) => {
    if (newVal && !oldVal) {
      refsToToggle?.length &&
        refsToToggle.forEach((refToToggle: Ref) => (refToToggle.value = false))
      showTransferPermission.value = true
    }
  })

  const resetTransferPermission = () => {
    if (showTransferPermission.value) customerStore.resetTransfer()
  }

  const toggleTransferPermission = () => {
    resetTransferPermission()
    showTransferPermission.value = !showTransferPermission.value
  }

  return {
    showTransferPermission,
    toggleTransferPermission,
    resetTransferPermission,
  }
}
