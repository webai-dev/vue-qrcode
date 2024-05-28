<script lang="ts" setup>
import LcLoader from "~/components/base/LcLoader.vue"

export interface ISuggest {
  name: string
  id: string
}
const props = defineProps<{
  text: any
  suggestions: (ISuggest | undefined)[]
  isLoading: boolean
}>()

const emits = defineEmits<{
  (event: "select", suggest: ISuggest | null): void
}>()

const suggestWrapper = ref()
const suggestSelected = ref("")
const scrollDim = ref<DOMRect | null>(null)
const dim = computed(() => suggestWrapper?.value?.getBoundingClientRect())
const maxHeight = computed(() => window.innerHeight - dim?.value?.bottom - 10)

const show = computed(() => props.text.length >= 3)
const scroll = ref(false)

watch(
  () => props.text,
  (newVal) => {
    if (suggestSelected.value !== "" && newVal !== suggestSelected.value) {
      suggestSelected.value = ""
      emits("select", null)
    }
  },
)

const repositionOnScroll = () => {
  scroll.value = true
  scrollDim.value = suggestWrapper?.value?.getBoundingClientRect()
}

watch(show, (newVal) => {
  const modal = document.getElementById("modal")
  if (newVal && !scroll.value) {
    modal?.addEventListener("scroll", repositionOnScroll)
  } else {
    scroll.value = false
    scrollDim.value = null
    modal?.removeEventListener("scroll", repositionOnScroll)
  }
})

const onSelect = (suggest: ISuggest | any) => {
  emits("select", suggest)
  suggestSelected.value = suggest.name
}
</script>
<template>
  <div
    :class="[
      'lc-suggestion',
      { 'lc-suggestion__active': show && !suggestSelected.length },
    ]"
  >
    <span ref="suggestWrapper">
      <slot></slot>
    </span>
    <span class="lc-suggestion__annotation">Type at least 3 characters</span>
    <Teleport to="body">
      <ul
        v-if="show && !suggestSelected.length"
        class="lc-suggestion_list"
        :style="{
          top: (scrollDim?.bottom || dim?.bottom) + 'px',
          left: dim?.left + 'px',
          width: dim?.width + 'px',
          maxHeight: maxHeight + 'px',
        }"
      >
        <li v-if="isLoading" class="lc-suggestion_list-loader">
          <LcLoader size="md" />
        </li>
        <template v-if="!isLoading && suggestions.length">
          <li
            v-for="suggest in suggestions"
            :key="suggest?.id"
            class="lc-suggestion_list-item"
            @click="onSelect(suggest)"
          >
            {{ suggest?.name }}
          </li>
        </template>
        <li
          v-if="
            !isLoading &&
            suggestions.length === 0 &&
            text.length >= 3 &&
            !suggestSelected.length
          "
          class="lc-suggestion_list-empty"
        >
          No suggestions
        </li>
      </ul>
    </Teleport>
  </div>
</template>
<style lang="scss">
.lc-suggestion {
  &__active {
    .input {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &__annotation {
    font-size: var(--text-xs-font-size);
    color: var(--clr-gray-500);
  }

  &_list {
    position: absolute;
    top: 0;
    z-index: 5;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: white;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border: 1px solid var(--clr-gray-300);
    border-top: none;
    overflow: auto;
    box-shadow: 0 4px 6px -2px rgba(16, 24, 40, 0.05),
      0 12px 16px -4px rgba(16, 24, 40, 0.1), 0 0 4px 0 rgba(0, 0, 0, 0.08);

    &-item {
      list-style: none;
      padding: var(--space-2) var(--space-4);

      &:hover {
        background-color: var(--clr-primary-25);
        cursor: pointer;
      }
    }

    &-loader {
      list-style: none;
      padding: var(--space-2) var(--space-4) var(--space-4);
      display: flex;
      justify-content: center;
    }

    &-empty {
      display: flex;
      justify-content: center;
      padding: var(--space-4);
      font-size: var(--text-xs-font-size);
    }
  }
}
</style>
