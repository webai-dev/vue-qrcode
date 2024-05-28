import { computed } from "vue"

export function useModelWrapper(
  props: Readonly<any>,
  emit: (event: any, ...args: any[]) => void,
  name = "modelValue",
) {
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value),
  })
}
