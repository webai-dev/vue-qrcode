<script setup lang="ts">
import { useStatsStore } from "~/stores/stats"
import ArrowRight from "~/assets/icons/icon-arrow-right.svg?component"
import IconLocation from "~/assets/icons/icon-location.svg?component"
import IconTag from "~/assets/icons/icon-tag.svg?component"

const router = useRouter()
const statsStore = useStatsStore()

onBeforeMount(() => {
  if (!statsStore.isAdminDataFetched) {
    statsStore.loadAdminStats()
  }
})
</script>
<template>
  <LcCard>
    <LcCardHeader :title="$t('dashboard.your_customers')" />
    <LcCardContent class="your-customers-stats-overview">
      <div class="stat">
        <h3>{{ statsStore.getAdminTotalCustomerCount }}</h3>
        <div>
          <IconLocation />
          <span>{{ $t("common.customers") }}</span>
        </div>
      </div>
      <div class="stat">
        <h3>{{ statsStore.getAdminTotalUserCount }}</h3>
        <div>
          <IconTag /><span>{{ $t("common.users") }}</span>
        </div>
      </div>
    </LcCardContent>
    <LcCardActions>
      <LcButton
        class="manage-customer-button"
        :icon="ArrowRight"
        trailing-icon
        @click="router.push({ name: 'app.customers' })"
        >{{ $t("dashboard.manage_customers") }}</LcButton
      >
    </LcCardActions>
  </LcCard>
</template>

<style lang="scss">
.manage-customer-button {
  margin-left: auto;
}

.your-customers-stats-overview {
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
