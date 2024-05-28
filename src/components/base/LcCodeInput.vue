<script setup lang="ts">
interface CodeInputProps {
  count?: number
  pattern?: "numerical" | "alpha" | "alphanumeric"
  modelValue?: string
}

const props = withDefaults(defineProps<CodeInputProps>(), {
  count: 6,
  pattern: "numerical",
  modelValue: "",
})

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void
  (event: "filled"): void
}>()

const patternValue = {
  numerical: /[0-9]+/,
  alpha: /[a-zA-Z]+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
}

interface InputItem {
  id: number
  value: string
  isFocused: boolean
  el: HTMLElement | null
}

const inputItem: InputItem = {
  id: 1,
  value: "",
  isFocused: false,
  el: null,
}
const inputsList = ref<InputItem[]>([])

for (let index = 0; index < props.count; index++) {
  inputsList.value.push({
    ...inputItem,
    id: index + 1,
  })
}

const codeValue = ref("")

onMounted(() => {
  inputsList.value[0].el?.focus()
})

watch(inputsList.value, () => {
  codeValue.value = inputsList.value
    .map((i) => i.value)
    .reduce((prev, curr) => {
      return `${prev}${curr}`
    }, "")
  emit("update:modelValue", codeValue.value)
  if (codeValue.value.length >= props.count) {
    emit("filled")
  }
})

const isInputValueAllowed = (e: KeyboardEvent) => {
  if (!e.key.match(patternValue[props.pattern])) e.preventDefault()
  return true
}

const functionRef = (el: HTMLElement, index: number): void => {
  inputsList.value[index].el = el
}
const triggerDelete = (input: InputItem) => {
  inputsList.value[input.id - 1].value = ""
}

const handleReplace = (e: Event, input: InputItem) => {
  const currentInputValue = (input.el as HTMLInputElement).value
  if (currentInputValue) {
    input.value = ""
  }
}
const handlePaste = (e: ClipboardEvent, input: InputItem) => {
  const code = e.clipboardData?.getData("text") || ""
  e.preventDefault()
  if (typeof code !== "string") return
  const chars = code
    .split("")
    .filter((char) => char.match(patternValue[props.pattern]))

  for (let i = 0; i < props.count; i++) {
    if (chars[i] && inputsList.value[input.id - 1 + i]) {
      inputsList.value[input.id - 1 + i].value = chars[i]
    }
  }
}

const focusNext = (input: InputItem) => {
  if (inputsList.value[input.id]) {
    inputsList.value[input.id].el?.focus()
  }
}

const focusPrev = (input: InputItem) => {
  if (inputsList.value[input.id - 2]) {
    inputsList.value[input.id - 2].el?.focus()
  }
}

const handleInput = (e: Event, input: InputItem) => {
  // value items
  input.value = (input.el as HTMLInputElement).value

  // focus next
  focusNext(input)
}

const allEvents = (e: KeyboardEvent, input: InputItem) => {
  switch (true) {
    case e.key === "Delete" || e.key === "Backspace": {
      triggerDelete(input)
      e.preventDefault()
      focusPrev(input)
      break
    }
    case e.key === "ArrowLeft": {
      focusPrev(input)
      break
    }
    case e.key === "ArrowRight": {
      focusNext(input)
      break
    }
    case e.shiftKey || e.key === "Tab" || e.altKey || e.metaKey || e.ctrlKey: {
      return true
    }
    default:
      isInputValueAllowed(e)
      handleReplace(e, input)
  }
}
</script>

<template>
  <div class="number__code">
    <input
      v-for="(input, index) in inputsList"
      :ref="(el) => functionRef((el as HTMLElement), index)"
      :key="input.id"
      :value="input.value"
      :name="`code-${input.id}`"
      class="code-input"
      autocomplete="off"
      @keydown="(e) => allEvents(e, input)"
      @input="(e) => handleInput(e, input)"
      @paste="(e) => handlePaste(e, input)"
    />
  </div>
</template>

<style lang="scss" scoped>
.number__code {
  display: flex;
  gap: 12px;
  padding: var(--space-8) 0;
}

input.code-input {
  text-align: center;
  width: 80px;
  height: 80px;
  font-size: var(--display-lg-font-size);
  line-height: var(--display-lg-line-height);
  color: var(--clr-primary-600);
  padding: 0;
}

input {
  border: 1px solid var(--clr-primary-300);
  border-radius: 8px;
  &:focus {
    outline: transparent;
    box-shadow: 0px 0px 0px 4px var(--clr-primary-100);
  }
}
</style>
