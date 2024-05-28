<script setup lang="ts">
import type { Component } from "vue"
import LcLoader from "~/components/base/LcLoader.vue"
interface LcDialogProps {
  show: boolean
  icon?: Component
  headline: string
  description?: string
  destructive?: boolean
  confirmLabel?: string
  cancelLabel?: string
  showLoader?: boolean
  confirmButtonIcon?: Component
}

const props = withDefaults(defineProps<LcDialogProps>(), {
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  destructive: false,
  showLoader: false,
})

const emit = defineEmits<{
  (e: "close"): () => void
  (e: "confirm"): () => void
}>()
</script>

<template>
  <LcModal
    :show="props.show"
    :icon="props.icon"
    :title="props.headline"
    :description="props.description"
    :destructive="props.destructive"
    @close="$emit('close')"
  >
    <div class="dialog">
      <slot></slot>
      <footer>
        <LcButton variant="tertiary" @click="$emit('close')">
          {{ props.cancelLabel }}
        </LcButton>
        <LcButton
          :icon="props.confirmButtonIcon"
          :destructive="props.destructive"
          @click="$emit('confirm')"
        >
          <LcLoader v-if="props.showLoader" size="xs" white />
          <span :class="{ hide: props.showLoader }">
            {{ props.confirmLabel }}
          </span>
        </LcButton>
      </footer>
    </div>
  </LcModal>
</template>

<style lang="scss" scoped>
.dialog {
  footer {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
    gap: 10px;

    .lc-loader {
      position: absolute;
      left: calc(50% - 5px);
    }

    .hide {
      visibility: hidden;
    }
  }
}
</style>
