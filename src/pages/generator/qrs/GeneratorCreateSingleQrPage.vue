<script lang="ts" setup>
import { Form } from "vee-validate"
import { machineDate } from "~/helpers/date"
import { rules } from "~/modules/validationRules"
import LcFormItem from "~/components/base/LcFormItem.vue"
import LcInput from "~/components/base/LcInput.vue"
import { useGeneratorStore } from "~/stores/generator"
import { useSessionStore } from "~/stores/session"
import LcLoader from "~/components/base/LcLoader.vue"
import type { IGeneratorSingleQrDto } from "~/types/stores/GeneratorStore"
import { track } from "~/modules/tracking"

const router = useRouter()
const route = useRoute()
const url = ref("")

const generatorStore = useGeneratorStore()
const sessionStore = useSessionStore()

const startSingleQrGeneration = () => {
  generatorStore.generateSingleQrTag({
    customerId: sessionStore.getSelectedCustomerId as string,
    longURL: url.value,
    callback: (responseData: IGeneratorSingleQrDto) => {
      track("Set generated", {
        customerId: sessionStore.getSelectedCustomerId as string,
        projectId: route.params.projectId as string,
        date: machineDate(new Date()),
        type: "Single QR",
      })
      router.push(`/app/generator/single/${responseData.id}/export`)
    },
  })
}

rules()

onUnmounted(() => {
  url.value = ""
})
</script>
<template>
  <Form @submit="startSingleQrGeneration">
    <LcFormItem
      v-slot="{ meta, field }"
      name="url"
      label="URL"
      rules="required|url"
    >
      <LcInput v-model="url" v-bind="field" :meta="meta" />
    </LcFormItem>
    <div class="single-qr-actions">
      <LcButton variant="link" @click="router.push('/app/generator')">
        {{ $t("common.cancel") }}
      </LcButton>
      <LcButton type="submit">
        <LcLoader
          v-if="generatorStore.isGeneratingSingleQrLoading"
          size="xs"
          white
        />
        <span v-else>{{ $t("generator.generate_qr_code") }}</span>
      </LcButton>
    </div>
  </Form>
</template>
<style lang="scss" scoped>
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .field--wrapper {
    width: 400px;
    max-width: 100%;
  }
}

.single-qr-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--space-8);

  .btn {
    margin: 0 var(--space-2);
  }
}
</style>
