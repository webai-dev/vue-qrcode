<script setup lang="ts">
import { useSessionStore } from "~/stores/session"
import { useStatsStore } from "~/stores/stats"
import generatorIcon from "~/assets/icons/icon-generator.svg?component"
import packageIcon from "~/assets/icons/icon-package.svg?component"
import ArrowRight from "~/assets/icons/icon-arrow-right.svg?component"

const sessionStore = useSessionStore()
const statsStore = useStatsStore()
const router = useRouter()

const NavigateToGenerators = () => {
  router.push("/app/generator")
}

const itemCount = computed(() => {
  const sizes = ["Kio", "Mio", "Gio", "Tio"]

  if (statsStore.getCustmerGeneratorProjectCount === 0) {
    return 0
  }

  const i = Math.floor(
    Math.log(statsStore.getCustmerGeneratorProjectCount) / Math.log(1000),
  )

  return `${Math.round(
    statsStore.getCustmerGeneratorProjectCount / Math.pow(1000, i),
  )} ${sizes[i]}`
})

onBeforeMount(() => {
  if (
    !statsStore.isCustomerGeneratorDataFetched &&
    sessionStore.getSelectedCustomerId
  ) {
    statsStore.loadCustomerGeneratorStats(sessionStore.getSelectedCustomerId)
  }
})
</script>
<template>
  <LcCard
    v-if="
      !statsStore.isCustomerGeneratorDataFetched ||
      (statsStore.getCustmerGeneratorProjectCount === 0 &&
        statsStore.getCustmerGeneratorItemCount)
    "
  >
    <LcCardHeader :title="$t('dashboard.generator_card.title1')" />
    <LcCardActions>
      <LcButton
        class="generator-button"
        trailing-icon
        :icon="ArrowRight"
        @click="NavigateToGenerators"
        >{{ $t("common.id_projects") }}</LcButton
      >
    </LcCardActions>
  </LcCard>
  <LcCard v-else>
    <LcCardHeader :title="$t('dashboard.generator_card.title2')" />
    <LcCardContent class="generator-stats-overview">
      <div class="stat">
        <h3>{{ statsStore.getCustmerGeneratorProjectCount }}</h3>
        <div>
          <packageIcon />
          <span>{{ $t("common.projects") }}</span>
        </div>
      </div>
      <div class="stat">
        <h3>{{ itemCount }}</h3>
        <div>
          <generatorIcon />
          <span>{{ $t("common.items") }}</span>
        </div>
      </div>
    </LcCardContent>
    <LcCardActions>
      <LcButton
        class="generator-button"
        trailing-icon
        :icon="ArrowRight"
        @click="NavigateToGenerators"
        >{{ $t("common.id_projects") }}</LcButton
      >
    </LcCardActions>
  </LcCard>
</template>

<style lang="scss">
.generator-button {
  margin-left: auto;
}

.generator-stats-overview {
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
