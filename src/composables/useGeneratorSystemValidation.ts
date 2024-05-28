import type { Ref } from "vue"
import { onBeforeMount } from "vue"
import { SYSTEM_OPTIONS } from "~/constants/generators"

const applyRules = (appliedRules: Ref, newSystem: Ref) => {
  switch (newSystem.value) {
    // DECIMAL
    case SYSTEM_OPTIONS[0].value: {
      appliedRules.value = {
        ...appliedRules.value,
        alpha: false,
        alpha_num: false,
        an_ex: false,
        num: true,
        hex: false,
      }
      break
    }
    // HEX - hexadecimal
    case SYSTEM_OPTIONS[1].value: {
      appliedRules.value = {
        ...appliedRules.value,
        alpha: false,
        alpha_num: false,
        an_ex: false,
        num: false,
        hex: true,
      }
      break
    }
    // AN - alphanumeric
    case SYSTEM_OPTIONS[2].value: {
      appliedRules.value = {
        ...appliedRules.value,
        alpha: false,
        alpha_num: true,
        an_ex: false,
        num: false,
        hex: false,
      }
      break
    }
    // AN Ex - exalphanumeric excl. 0, O, I, l
    case SYSTEM_OPTIONS[3].value: {
      appliedRules.value = {
        ...appliedRules.value,
        alpha: false,
        alpha_num: true,
        an_ex: true,
        num: false,
        hex: false,
      }
      break
    }
    // AL - alphabetic
    case SYSTEM_OPTIONS[4].value: {
      appliedRules.value = {
        ...appliedRules.value,
        alpha: true,
        alpha_num: false,
        an_ex: false,
        num: false,
        hex: false,
      }
      break
    }
  }
}

const applyChars = (appliedRules: Ref, newChars: Ref) => {
  appliedRules.value = {
    ...appliedRules.value,
    length: newChars,
  }
}

export function useGeneratorSystemValidation(
  appliedRules: Ref,
  system: Ref,
  chars?: Ref,
) {
  watch([system, chars], ([newSystem, newChars]) => {
    if (newSystem) {
      applyRules(appliedRules, newSystem)
    }
    if (newChars) {
      applyChars(appliedRules, newChars)
    }
  })

  onBeforeMount(() => {
    if (system.value) applyRules(appliedRules, system.value)
    if (chars?.value) applyChars(appliedRules, chars?.value)
  })
}
