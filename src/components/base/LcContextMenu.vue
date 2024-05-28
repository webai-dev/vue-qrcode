<script lang="ts" setup>
import VerticalDotsIcon from "~/assets/icons/icon-vertical-dots.svg?component"
const props = defineProps<{
  showMenu: boolean
}>()

const popoverIcon = ref()
const popover = ref()
const popoverVisibility = ref(0)
const x = ref(0)
const y = ref(0)

const emits = defineEmits<{
  (event: "toggle"): void
  (event: "close"): void
}>()

const resetPopover = () => {
  emits("close")
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  window.removeEventListener("click", outsideClose, true)
  window.removeEventListener("resize", resetPopover, true)
}

const outsideClose = (event: MouseEvent) => {
  if (
    !popover?.value?.contains(event.target) &&
    !popoverIcon?.value?.contains(event.target)
  ) {
    emits("close")
    window.removeEventListener("click", outsideClose, true)
    window.removeEventListener("resize", resetPopover, true)
  }
  if (popoverIcon?.value?.contains(event.target)) {
    window.removeEventListener("click", outsideClose, true)
    window.removeEventListener("resize", resetPopover, true)
  }
}

const onIconClick = () => {
  const iconElem = popoverIcon.value.getBoundingClientRect()
  x.value = iconElem.left
  y.value = iconElem.bottom
  popoverVisibility.value = 1

  // we hide the popover until we have it's height to smoothly open to top
  popoverVisibility.value = 0
  // popover must be done rendering to get it's dimensions
  setTimeout(() => {
    const popElem = popover?.value?.getBoundingClientRect()
    if (popElem) {
      // if icon is too close to window bottom we open to top
      if (iconElem.left + popElem.width > window.innerWidth) {
        x.value = iconElem.left + 20 - popElem.width
      }
      if (iconElem.bottom + 200 > window.innerHeight) {
        y.value = iconElem.top - popElem.height - 20
      }
      popoverVisibility.value = 1
    }
  }, 10)

  window.addEventListener("click", outsideClose, true)
  window.addEventListener("scroll", resetPopover, true)
  window.addEventListener("resize", resetPopover)
  emits("toggle")
}
</script>
<template>
  <div
    ref="popoverIcon"
    class="lc-context-icon"
    v-bind="$attrs"
    @click="onIconClick"
  >
    <VerticalDotsIcon />
  </div>

  <Teleport to="body">
    <div
      v-if="showMenu && x > 0 && y > 0"
      ref="popover"
      class="lc-context-popover"
      :style="{
        top: y + 'px',
        left: x + 'px',
        visibility: popoverVisibility ? 'visible' : 'hidden',
      }"
    >
      <ul>
        <slot></slot>
      </ul>
    </div>
  </Teleport>
</template>
<style lang="scss">
.lc-context {
  &-icon {
    cursor: pointer;
    padding: 0 0.3rem;
  }
  &-popover {
    position: absolute;
    background-color: white;
    box-sizing: border-box;
    width: 180px;
    border-radius: 12px;
    margin: var(--space-2) var(--space-2);
    overflow: hidden;
    box-shadow: 0 4px 6px -2px rgba(16, 24, 40, 0.05),
      0 12px 16px -4px rgba(16, 24, 40, 0.1),
      0px 0px 4px 0px rgba(0, 0, 0, 0.08);

    ul {
      margin: 0;
      padding: 0;

      li:not(.lc-divider) {
        list-style: none;
        cursor: pointer;
        font-size: var(--text-sm-font-size);
        padding: var(--space-4) var(--space-6);

        &:hover {
          background-color: var(--clr-primary-25);
        }
      }

      li.lc-divider {
        list-style: none;
        border-bottom: 1px solid var(--clr-gray-300);
        margin: 0 var(--space-3);

        &.hide-mobile {
          @include mqDesktopFirst("tablet") {
            display: none;
          }
        }
      }
    }
  }
}
</style>
