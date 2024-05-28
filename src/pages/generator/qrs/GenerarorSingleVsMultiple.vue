<script lang="ts" setup>
import ArrowRightIcon from "~/assets/icons/icon-arrow-right.svg?component"

const router = useRouter()
const route = useRoute()
</script>
<template>
  <div>
    <LcCard @click="router.push(`${route.path}/single`)">
      <LcCardContent>{{ $t("customer.single_qr_code") }}</LcCardContent>
      <LcCardActions><ArrowRightIcon /></LcCardActions>
    </LcCard>
    <LcCard @click="router.push(`${route.path}/multiple`)">
      <LcCardContent>{{ $t("customer.multiple_qr_codes") }}</LcCardContent>
      <LcCardActions><ArrowRightIcon /></LcCardActions>
    </LcCard>
  </div>
</template>
<style lang="scss" scoped>
.card {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: var(--space-4);
  min-width: 38vw;

  .LcCardActions svg {
    color: var(--clr-primary-600);
  }
}
</style>
