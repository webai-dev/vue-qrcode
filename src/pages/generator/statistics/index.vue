<script setup lang="ts">
import { computed, watch } from "vue"
import { storeToRefs } from "pinia"
import type { ComputedRef } from "vue"
import Badge from "./Badge.vue"
import { useCustomerMessagesStore } from "~/stores/customer-messages"
import type { ProjectStatistic } from "~/stores/customer-messages"

const props = defineProps<{
  projectId: string
  initialValue: ProjectStatistic
}>()
const customerMessagesStore = useCustomerMessagesStore()
const { getCurrentChannel } = storeToRefs(customerMessagesStore)

watch(
  getCurrentChannel,
  async () => {
    await customerMessagesStore.subscribeProjectStatsMessages(props.projectId)
  },
  { immediate: true },
)

const projectStats = computed(() => ({
  ...props.initialValue,
  ...(customerMessagesStore.getProjectStats?.[props.projectId] || {}),
}))
</script>

<template>
  <div class="container">
    <Badge :title="$t('common.today')" :statistic="projectStats?.perDay" />
    <Badge :title="$t('common.last7days')" :statistic="projectStats?.perWeek" />
    <Badge :title="$t('common.total')" :statistic="projectStats?.total" />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  gap: 1.5em;
}
</style>
