import { ref } from "vue"
import { localeReplacing, localeWrapper } from "~/helpers/formatters"

export const useFormattedValue = (initialValue: string) => {
  const formattedValue = ref(localeWrapper(initialValue))

  const handleChange = (value: string) => {
    formattedValue.value = localeWrapper(localeReplacing(value))
  }

  const value = computed(() => localeReplacing(formattedValue.value))

  return {
    formattedValue,
    value,
    handleChange,
  }
}
