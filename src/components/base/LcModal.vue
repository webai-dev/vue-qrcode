<script lang="ts" setup>
import type { Component } from "vue"
import Close from "~/assets/icons/icon-x.svg?component"
const props = defineProps<{
  show: boolean
  icon?: Component
  title?: string
  description?: string
  scannerModal?: boolean
  closeButton?: boolean
  destructive?: boolean
  success?: boolean
  className?: string
}>()

const emits = defineEmits<{
  (e: "close"): void
}>()
</script>
<template>
  <teleport to="body">
    <Transition name="nested" appear>
      <div v-if="show" :class="['modal', props.className ?? '']">
        <div class="modal__overlay" @click="$emit('close')"></div>
        <div
          id="modal"
          :class="['modal__content inner', { 'no-padding': scannerModal }]"
        >
          <div
            v-if="closeButton"
            :class="['close-button', { 'scanner-close-button': scannerModal }]"
          >
            <LcButton round @click="$emit('close')"><Close /></LcButton>
          </div>
          <div class="content">
            <div class="header">
              <div
                v-if="props.icon"
                class="content__icon"
                :class="{
                  'icon-destructive': props.destructive,
                  'icon-success': props.success,
                }"
              >
                <component :is="props.icon" class="prefix"></component>
              </div>
              <div v-if="props.title" class="content__title">
                {{ props.title }}
              </div>
              <div v-if="props.description" class="content__description">
                {{ props.description }}
              </div>
            </div>
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style lang="scss" scoped>
.modal {
  position: absolute;
  width: 100%;
  height: 100vh;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease;
  border-radius: 12px;
  z-index: 5;

  &__overlay {
    position: absolute;
    inset: 0;
    background: #344054;
    opacity: 0.6;
    backdrop-filter: blur(16px);
  }
  &__content {
    z-index: 1;
    width: 100%;
    padding: 0;
    border-radius: 0;
    height: 100%;
    position: relative;
    background-color: var(--clr-white);
    // padding according figma is 24px
    // scrollbar: 16px
    // this adds whitespace for scrollbar
    scrollbar-gutter: stable both-edges;
    // rest of padding is 8px => 24px - scrollbar 16px = 8px
    overflow: auto;
    @include mq("tablet") {
      max-height: unset;
      width: 400px;
      min-height: auto;
      max-height: 90%;
      height: auto;
      border-radius: 12px;
      padding: var(--space-2);
    }
  }
}

.modal__content {
  &::-webkit-scrollbar {
    width: 16px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--clr-gray-300);
    border: 4px solid transparent;
    border-radius: 12px;
    background-clip: padding-box;
  }

  &.no-padding {
    scrollbar-gutter: unset;
    overflow: hidden;
  }
}

.close-button {
  z-index: 3;
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  padding: var(--space-6);
}

.scanner-close-button {
  margin-top: var(--space-8);
}

.header {
  display: flex;
  flex-direction: column;
  padding-block-end: var(--space-8);
  align-items: center;
}
.content {
  &__title {
    font-size: var(--text-lg-font-size);
    line-height: var(--text-lg-line-height);
    font-weight: var(--font-weight-semibold);
  }

  &__description {
    font-size: var(--text-sm-font-size);
    line-height: var(--text-sm-line-height);
    color: var(--clr-gray-500);
    margin-top: var(--space-4);
  }

  &__icon {
    padding-block-start: var(--space-4);
    padding-block-end: 20px;
    stroke: var(--clr-primary-600);
    color: var(--clr-primary-600);

    &.icon-destructive {
      stroke: var(--clr-error-600);
      color: var(--clr-error-600);
    }

    &.icon-success {
      stroke: var(--clr-success-500);
      color: var(--clr-success-500);
    }
  }
}

// transitions
.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}
.nested-leave-active {
  transition-delay: 0.2s;
}

.nested-enter-from,
.nested-leave-to {
  opacity: 0.01;
}

.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.2s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: scale(0.5);
  opacity: 0.01;
}
</style>
