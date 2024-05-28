<script setup lang="ts">
import IconPlusWhite from "~/assets/icons/icon-plus-white.svg?component"
import LabelsIdPartsFormItem from "~/components/shared/generators/ids/LcIdPartsFormItem.vue"
import LcDraggable from "~/components/base/LcDraggable.vue"
import XIcon from "~/assets/icons/icon-x.svg?component"
import type { IIdPartSettingsDto } from "~/types/stores/GeneratorStore"
import { defaultIdPartsItems } from "~/constants/generators"

const props = defineProps<{
  idParts: IIdPartSettingsDto[]
  isAllItemsAbleToDelete?: boolean | undefined
}>()

const emit = defineEmits<{
  (
    event: "part:update",
    index: number,
    action: "update" | "remove" | "insert" | "swap",
    part: IIdPartSettingsDto,
    newIndex?: number,
  ): void
}>()

// **** REFS **** //
const parts = ref<IIdPartSettingsDto[]>(props.idParts || [])
const isModalRemoveItemOpen = ref<boolean>(false)
const itemIndexToRemove = ref<number | null>(null)

// **** METHODS **** //
const handleAddItemClick = () => {
  const part = defaultIdPartsItems.RANDOM
  parts.value.push(part)
  const index = parts.value.length - 1
  emit("part:update", index, "insert", parts.value[index])
}
const handleRemoveItemClick = (index: number, showModal: boolean) => {
  itemIndexToRemove.value = index
  isModalRemoveItemOpen.value = showModal
}

const handlePartUpdate = (part: IIdPartSettingsDto) => {
  const { index } = part
  parts.value[index!] = part

  emit("part:update", index!, "update", part)
}

const handleUpdatePartStartValue = (index: number, value: string) => {
  parts.value[index].startValue = value
  emit("part:update", index, "update", parts.value[index])
}
const removeItem = () => {
  emit(
    "part:update",
    itemIndexToRemove.value!,
    "remove",
    parts.value[itemIndexToRemove.value!],
  )
  parts.value.splice(itemIndexToRemove.value!, 1)
  isModalRemoveItemOpen.value = false
}

const handleCloseRemoveModal = () => {
  isModalRemoveItemOpen.value = false
  itemIndexToRemove.value = null
}

const handleDragEnd = (payload: any) => {
  const { newIndex, oldIndex } = payload
  emit("part:update", oldIndex, "swap", parts.value[newIndex], newIndex)
}

onMounted(() => {
  if (parts.value.length > 0) {
    const index = parts.value.length - 1
    emit("part:update", index, "insert", parts.value[index])
  }
})
</script>

<template>
  <LcDraggable
    :list="parts as IIdPartSettingsDto[]"
    :drag="parts.length > 1"
    :on-drag-end="handleDragEnd"
  >
    <template #element="{ element, index, toggleDragOn, toggleDragOff }">
      <div>
        <LabelsIdPartsFormItem
          :item="element as IIdPartSettingsDto"
          :index="index as number"
          :is-draggable="parts.length > 1"
          :is-able-to-delete="isAllItemsAbleToDelete || parts.length > 1"
          @toggle:drag-off="toggleDragOff"
          @toggle:drag-on="toggleDragOn"
          @item:remove="handleRemoveItemClick"
          @item:update:part="handlePartUpdate"
          @item:update:start-value="handleUpdatePartStartValue"
        />
      </div>
    </template>
  </LcDraggable>
  <LcButton variant="link" class="btn--add-part" @click="handleAddItemClick">
    <template #circled-icon>
      <div class="circle">
        <IconPlusWhite />
      </div>
    </template>
    Add ID part
  </LcButton>
  <LcDialog
    :show="isModalRemoveItemOpen as boolean"
    :icon="XIcon"
    :headline="$t('generator.remove_id_part')"
    :cancel-label="$t('common.cancel')"
    :confirm-label="$t('generator.yes_remove')"
    destructive
    @close="handleCloseRemoveModal"
    @confirm="removeItem"
  />
</template>

<style scoped lang="scss">
.circle {
  width: 2.25rem;
  height: 2.25rem;
  background-color: var(--clr-primary-600);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn--md {
  width: fit-content;
  padding: 9px;

  &.btn--add-part {
    margin-top: 0.125rem;
    margin-bottom: 0.3125rem;

    &:deep(.button__text) {
      color: var(--clr-primary-600);
      margin-left: 3px;
    }
  }
}
</style>
