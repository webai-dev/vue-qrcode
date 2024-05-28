<script lang="ts" setup>
import { ref, defineProps } from "vue"
import draggable from "vuedraggable"

const props = defineProps<{
  list: any[]
  onDragEnd?: (...payload: any[]) => void
  drag?: boolean
}>()

const drag = ref(props.drag ?? false)

const toggleDragOn = () => (drag.value = true)
const toggleDragOff = () => (drag.value = false)

const onDragEndHandler = (payload: any) => {
  if (props.onDragEnd) {
    props.onDragEnd(payload)
  }
}
</script>
<template>
  <draggable
    class="lc-draggable"
    :list="list"
    :disabled="!drag"
    item-key="id"
    @end="onDragEndHandler"
  >
    <template #item="{ element, index }">
      <div>
        <slot
          name="element"
          :index="index"
          :element="element"
          :toggle-drag-on="toggleDragOn"
          :toggle-drag-off="toggleDragOff"
        />
      </div>
    </template>
  </draggable>
</template>
