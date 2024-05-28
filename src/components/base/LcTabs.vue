<script setup lang="ts">
export interface LcTab {
  text: string
  key: string
  url?: string
}

const props = defineProps<{
  tabs: LcTab[]
  activeTab: string
}>()

const emits = defineEmits<{
  (event: "tabChange", tab: string): void
}>()

function changeTab(key: string) {
  if (props.activeTab === key) {
    return
  }

  emits("tabChange", key)
}
</script>

<template>
  <div class="tabs">
    <a
      v-for="tab in props.tabs"
      :key="tab.key"
      :class="{
        tabs__tab: true,
        'tabs__tab--active': tab.key === props.activeTab,
      }"
      @click="changeTab(tab.key)"
      >{{ tab.text }}</a
    >
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  color: var(--clr-gray-500);
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tabs__tab {
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm-line-height);
  font-weight: var(--font-weight-medium);
  padding: 0.75rem 0;
  &:hover {
    cursor: pointer;
    color: var(--clr-primary-600);
    border-bottom: 2px solid var(--clr-primary-600);
  }

  &--active {
    color: var(--clr-primary-600);
    border-bottom: 2px solid var(--clr-primary-600);

    &:hover {
      cursor: default;
    }
  }
}
</style>
