<script setup lang="ts">
import { computed } from "vue"
import type { ProjectStatisticData } from "~/stores/customer-messages"
import Dot from "~/assets/icons/icon-dot.svg?component"
import ArrowUpRight from "~/assets/icons/icon-arrow-up-right.svg?component"
import ArrowDownRight from "~/assets/icons/icon-arrow-down-right.svg?component"

const props = defineProps<{ title: string; statistic?: ProjectStatisticData }>()

const typeProps: {
  [key: string]: {
    color?: string
    icon: any
  }
} = {
  success: {
    color: "success",
    icon: ArrowUpRight,
  },
  error: { color: "error", icon: ArrowDownRight },
  neutral: { icon: Dot },
}

const badgeType = computed(() => {
  if (
    !props.statistic ||
    props.statistic.shortUrlsAccessed ===
      props.statistic.shortUrlsAccessedPreviousPeriod
  ) {
    return "neutral"
  }

  const prevCount = props?.statistic?.shortUrlsAccessedPreviousPeriod || 0

  return props?.statistic?.shortUrlsAccessed > prevCount ? "success" : "error"
})
</script>

<template>
  <div class="badge-container">
    <span class="title">{{ title }}</span
    ><lc-badge
      :color="typeProps[badgeType]?.color"
      :icon="typeProps[badgeType].icon"
      :text="`${statistic?.shortUrlsAccessed || '0'}`"
    />
  </div>
</template>

<style scoped lang="scss">
.badge-container {
  display: flex;
  align-items: center;
  gap: 0;
}

.title {
  padding-right: 1em;
  font-size: var(--text-xs-font-size);
  color: var(--clr-grey-500);
}
</style>
