<script setup lang="ts">
import { useSessionStore } from "~/stores/session"
import { useStatsStore } from "~/stores/stats"
import IconLocation from "~/assets/icons/icon-location.svg?component"
import IconTag from "~/assets/icons/icon-tag.svg?component"
import ArrowRight from "~/assets/icons/icon-arrow-right.svg?component"

const router = useRouter()
const statsStore = useStatsStore()
const sessionStore = useSessionStore()

onBeforeMount(() => {
  if (!statsStore.isCustomerDataFetched && sessionStore.getSelectedCustomerId) {
    statsStore.loadCustomerStats(sessionStore.getSelectedCustomerId)
  }
})
</script>

<template>
  <LcCard>
    <LcCardHeader :title="$t('dashboard.manage_your_window_shop.title')" />
    <LcCardContent class="window-shop-stats-overview">
      <div class="stat">
        <h3>{{ statsStore.getCustomerShopCount }}</h3>
        <div>
          <IconLocation />
          <span>{{ $t("common.locations") }}</span>
        </div>
      </div>
      <div class="stat">
        <h3>{{ statsStore.getCustomerItemCount }}</h3>
        <div>
          <IconTag /><span>{{ $t("common.articles") }}</span>
        </div>
      </div>
    </LcCardContent>
    <LcCardActions>
      <LcButton
        class="window-shop-button"
        :icon="ArrowRight"
        trailing-icon
        @click="router.push('/app/touchpoint')"
      >
        {{ $t("common.touchpoint") }}</LcButton
      >
    </LcCardActions>
  </LcCard>
</template>

<style scoped lang="scss">
.window-shop-button {
  margin-left: auto;
}

.window-shop-stats-overview {
  display: flex;

  padding-bottom: 0;

  .stat {
    margin: 0 20px;

    h3 {
      font-size: var(--display-md-font-size);
      line-height: var(--display-sm-line-height);
      font-weight: var(--font-weight-bold);

      color: var(--clr-gray-900);
      margin: 0;
    }

    div {
      display: flex;
      align-items: center;
      color: var(--clr-gray-500);

      svg {
        margin-right: 0.5em;
        height: 1.5em;
      }

      span {
        font-size: var(--text-sm-font-size);
        line-height: var(--display-sm-line-height);
        font-weight: var(--font-weight-medium);
      }
    }
  }
}
</style>
