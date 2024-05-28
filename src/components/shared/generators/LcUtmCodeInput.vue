<script setup lang="ts">
import { ref, watch } from "vue"
import type { FieldMeta } from "vee-validate"
import LcInput from "~/components/base/LcInput.vue"
import LcButton from "~/components/base/LcButton.vue"

type Props = {
  utmCode: string
  meta?: FieldMeta<unknown>
  placeholder: string
  name: string
}

const props = withDefaults(defineProps<Props>(), {
  utmCode: "",
  placeholder: "",
  name: "",
})

const emits = defineEmits<{
  (e: "update:utmCode", payload: { value: string; index: string }): void
  (e: "remove"): void
}>()

const localUtmCode = ref(props.utmCode)

const handleInput = (value: any) => {
  localUtmCode.value = value.target?.value
  emits("update:utmCode", {
    value: localUtmCode.value,
    index: props.name.split("-")[2],
  }) // assuming name is 'utm-code-${index}'
}

watch(
  () => props.utmCode,
  (newVal) => {
    localUtmCode.value = newVal
  },
)
</script>

<template>
  <div class="wrapper">
    <LcInput
      v-model="localUtmCode"
      class="input__utm"
      :meta="meta"
      :placeholder="placeholder"
      :name="name"
      @input="handleInput"
    />
    <LcButton variant="link" @click="emits('remove')">
      <template #circled-icon>
        <div class="circle">X</div>
      </template>
    </LcButton>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.wrapper :deep(.input__utm) {
  width: 22.075rem;
}
.circle {
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--clr-error-600);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
}
.btn--md {
  width: fit-content;
}
</style>