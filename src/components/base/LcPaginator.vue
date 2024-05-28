<script setup lang="ts">
import { computed } from "vue"
import IconArrowLeft from "~/assets/icons/icon-arrow-left.svg?component"
import IconArrowRight from "~/assets/icons/icon-arrow-right.svg?component"

const props = withDefaults(
  defineProps<{
    page?: number
    pageSize?: number
    total: number
    totalPages?: number
  }>(),
  {
    page: 1,
    pageSize: 10,
  },
)

const emits = defineEmits<{
  (e: "page-change", value: number): void
}>()

const totalPages = computed<number>(() => {
  if (props.totalPages) return props.totalPages
  if (props.pageSize <= 0) return 1
  return Math.ceil(props.total / props.pageSize) || 1
})

function onPrevPage() {
  emits("page-change", props.page - 1)
}

function onNextPage() {
  emits("page-change", props.page + 1)
}
</script>

<template>
  <div class="paginator">
    <LcButton
      class="paginator__btn--left"
      size="sm"
      :icon="IconArrowLeft"
      :disabled="page <= 1"
      variant="link"
      @click="onPrevPage"
      >Previous</LcButton
    >
    <span class="paginator__text">{{
      $t("common.page {page} of {totalPages}", { page, totalPages })
    }}</span>
    <LcButton
      class="paginator__btn--right"
      size="sm"
      :icon="IconArrowRight"
      trailing-icon
      :disabled="page >= totalPages"
      variant="link"
      @click="onNextPage"
      >Next</LcButton
    >
  </div>
</template>

<style lang="scss">
.paginator {
  align-items: center;
  display: flex;
  padding: 0.75rem;

  .btn {
    .button__text {
      display: none;
      @include mq("tablet") {
        display: inline-block;
      }
    }
  }
}

.paginator__text {
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm-line-height);
  color: var(--clr-gray-700);
  margin: auto;
  text-align: center;
  width: 100%;
}

.paginator__btn--right {
  margin-left: auto;
}
</style>
