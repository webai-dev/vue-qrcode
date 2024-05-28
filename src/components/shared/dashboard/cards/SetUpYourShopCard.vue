<script setup lang="ts">
import ArrowRight from "~/assets/icons/icon-arrow-right.svg?component"
const router = useRouter()
</script>
<template>
  <LcCard class="dashboard-customer">
    <div>
      <LcCardHeader :title="$t('dashboard.setup_your_shop_card.title')" />
      <LcCardContent>
        <p>{{ $t("dashboard.setup_your_shop_card.content") }}</p>
      </LcCardContent>
    </div>
    <LcCardActions>
      <LcButton
        class="window-shop-button"
        :icon="ArrowRight"
        trailing-icon
        @click="router.push('/app/touchpoint')"
      >
        {{ $t("common.location") }}</LcButton
      >
    </LcCardActions>
  </LcCard>
</template>

<style scoped lang="scss">
.dashboard-customer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .window-shop-button {
    margin-left: auto;
  }
}
</style>
