<script setup lang="ts">
import IconArrowRight from "~/assets/icons/icon-arrow-right.svg?component"
const router = useRouter()
const t = useI18n()

const handleGoMainPage = () => {
  router.replace({ name: "app.generator" })
}
</script>
<template>
  <div class="container">
    <LcRive
      src="/assets/label-creation-no-back.riv"
      data-cy="in-process-animation"
    />
    <p class="bold">{{ $t("generator.in_process_serialising_labels") }}</p>
    <p>{{ $t("generator.can_take_few_minutes") }}</p>
    <LcButton
      :icon="IconArrowRight"
      trailing-icon
      variant="link"
      @click="handleGoMainPage"
    >
      {{ $t("common.continue") }}
    </LcButton>
  </div>
</template>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & p {
    text-align: center;

    &.bold {
      font-weight: 600;
    }
  }
}

:deep(.button-icon) {
  width: 0.75rem;
  height: 0.75rem;
}
</style>
