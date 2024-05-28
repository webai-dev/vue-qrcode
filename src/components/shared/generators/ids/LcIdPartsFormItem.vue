<script setup lang="ts">
import type {
  ICharsOptions,
  IIdPartSettingsDto,
  IIncrementOptions,
  ISystemsOptions,
  ITypesOptions,
} from "~/types/stores/GeneratorStore"
import { SYSTEMS, SERIAL_NUMBER_TYPE } from "~/types/stores/GeneratorStore"
import {
  CHAR_LENGTH_OPTIONS,
  defaultIdPartsItems,
  INCREMENT_OPTIONS,
  SYSTEM_OPTIONS,
  TYPE_OPTIONS,
} from "~/constants/generators"
import { isValidAscii, isValidUrl } from "~/helpers/formatters"
import DragItemIcon from "~/assets/icons/icon-drag-item.svg?component"
import XIcon from "~/assets/icons/icon-x.svg?component"

interface Props {
  item: IIdPartSettingsDto
  index: number | string
  isDraggable?: boolean
  isAbleToDelete?: boolean
}

interface State {
  type: ITypesOptions
  system: ISystemsOptions
  length: ICharsOptions
  increment: IIncrementOptions
  startValue: string
}

const { t } = useI18n()

const props = defineProps<Props>()
const prevIndex = ref(props.index)

const emit = defineEmits<{
  (event: "item:remove", index: number, showModal: boolean): void
  (event: "item:update:part", part: IIdPartSettingsDto): void
  (event: "item:update:start-value", index: number, value: string): void
  (event: "toggle:drag-on"): void
  (event: "toggle:drag-off"): void
}>()

// **** UTILS **** //
// TODO create Unit tests for helpers. Move it to there
const stateAdapter = (data: IIdPartSettingsDto): State => ({
  type:
    TYPE_OPTIONS.find((option) => data.type === option.value) ||
    TYPE_OPTIONS[2],
  system:
    SYSTEM_OPTIONS.find((option) => data.system === option.value) ||
    SYSTEM_OPTIONS[1],
  length:
    CHAR_LENGTH_OPTIONS.find((option) => data.length === option.value) ||
    CHAR_LENGTH_OPTIONS[0],
  increment:
    INCREMENT_OPTIONS.find((option) => data.increment === option.value) ||
    INCREMENT_OPTIONS[0],
  // TODO: add rules to validate it on FE
  startValue: data.startValue || "0",
})

// **** REFS **** //
const state = reactive<State>(stateAdapter(props.item))
const isValidStartValue = ref(true)
const validationErrorMessage = ref("")

// **** COMPUTED **** //
const showStartValue = computed(
  () => props.item.type !== SERIAL_NUMBER_TYPE.RANDOM,
)

const isTypeNotFixed = computed(
  () => props.item.type !== SERIAL_NUMBER_TYPE.FIXED,
)

const showIncrement = computed(
  () => props.item.type === SERIAL_NUMBER_TYPE.INCREMENT,
)

// **** METHODS **** //

const validateStartValue = (value: string) => {
  if (state.system.value === SYSTEMS.DEC) {
    return { valid: /^\d+$/.test(value), sys: SYSTEMS.DEC }
  } else if (state.system?.value === SYSTEMS.HX_L) {
    return { valid: /^[a-f0-9]+$/.test(value), sys: SYSTEMS.HX_L }
  } else if (state.system?.value === SYSTEMS.HX_U) {
    return { valid: /^[A-F0-9]+$/.test(value), sys: SYSTEMS.HX_U }
  } else if (state.system?.value === SYSTEMS.AL_UP) {
    return { valid: isValidAscii(value), sys: SYSTEMS.AL_UP }
  } else if (state.system?.value === SYSTEMS.URL_CH) {
    return { valid: isValidUrl(value), sys: SYSTEMS.URL_CH }
  }
  return { valid: true, sys: "" }
}

const getStartValueValidationErrorMessage = (value: string): string => {
  if (value === SYSTEMS.DEC) {
    return t("common.decimal_error")
  } else if (value === SYSTEMS.HX_L) {
    return t("common.hexadecimal_lowercase_error")
  } else if (value === SYSTEMS.HX_U) {
    return t("common.hexadecimal_uppercase_error")
  } else if (value === SYSTEMS.AL_UP) {
    return t("common.ascii_error")
  } else if (value === SYSTEMS.URL_CH) {
    return t("common.invalid_url_error")
  }
  return ""
}

const updateValidity = (value: string) => {
  const { valid, sys } = validateStartValue(value)
  isValidStartValue.value = valid
  validationErrorMessage.value = valid
    ? ""
    : getStartValueValidationErrorMessage(sys)
}

const updateItem = () => {
  emit("item:update:part", {
    system: state.system.value,
    type: state.type.value,
    increment: state.increment.value,
    startValue: state.startValue,
    length: state.length.value,
    index: Number(props.index),
  })
  updateValidity(state.startValue)
}

const handleTypeChanged = (selected: ITypesOptions) => {
  const typed = defaultIdPartsItems[selected.value]
  // state.startValue = "0"
  emit("item:update:part", {
    ...typed,
    index: Number(props.index),
  })
  updateValidity(state.startValue)
}

const handleStartValueChanged = (value: string) => {
  emit("item:update:start-value", Number(props.index), value)
  updateValidity(value)
}

watch(
  () => props.item,
  (newItem) => Object.assign(state, stateAdapter(newItem)),
)
</script>

<template>
  <div class="part-item__container" data-cy="id-part-form-item">
    <div class="circle">
      <span>#{{ Number(index) + 1 }}</span>
    </div>
    <div class="container__items">
      <LcFormItem v-slot="{ meta }" name="type">
        <LcDropdown
          v-model="(state as State).type"
          :meta="meta"
          :options="TYPE_OPTIONS"
          class="form-item select__type"
          @update="handleTypeChanged"
        >
          <template #default="{ option }">
            <span> {{ `${option?.label}` }} </span>
          </template>
        </LcDropdown>
      </LcFormItem>
      <LcFormItem v-if="showIncrement" v-slot="{ meta }" name="increment">
        <LcDropdown
          v-model="(state as State).increment"
          :meta="meta"
          :options="INCREMENT_OPTIONS"
          class="form-item select__chars"
          @update="updateItem"
        >
          <template #default="{ option }">
            <span class="">{{ `${option?.label}` }}</span>
          </template>
        </LcDropdown>
      </LcFormItem>
      <LcFormItem
        v-if="isTypeNotFixed && !showIncrement"
        v-slot="{ meta }"
        name="char"
      >
        <LcDropdown
          v-model="(state as State).length"
          :meta="meta"
          :options="CHAR_LENGTH_OPTIONS"
          class="form-item select__chars"
          @update="updateItem"
        >
          <template #default="{ option }">
            <span class="">{{ `${option?.label}` }}</span>
          </template>
        </LcDropdown>
      </LcFormItem>
      <LcFormItem v-if="isTypeNotFixed" v-slot="{ meta }" name="system">
        <LcDropdown
          v-model="(state as State).system"
          :meta="meta"
          :options="SYSTEM_OPTIONS"
          class="form-item select__system"
          @update="updateItem"
        >
          <template #default="{ option }">
            <span>{{ `${option?.label}` }}</span>
          </template>
        </LcDropdown>
      </LcFormItem>
      <div v-if="showStartValue" class="form-item">
        <LcFormItem
          v-slot="{ field, meta }"
          name="start-value"
          :default-value="(state as State).startValue"
        >
          <LcInput
            v-model="(state as State).startValue"
            v-bind="field"
            :meta="{ ...meta, valid: isValidStartValue }"
            :placeholder="$t('generator.start_value')"
            :error="validationErrorMessage"
            @update:model-value="handleStartValueChanged as () => void"
          />
        </LcFormItem>
      </div>
    </div>
    <div class="container__actions">
      <DragItemIcon
        v-if="isDraggable"
        class="draggable-icon"
        @mouseenter="emit('toggle:drag-on')"
        @mouseleave="emit('toggle:drag-off')"
        @touchstart="emit('toggle:drag-on')"
        @touchend="emit('toggle:drag-off')"
      />
      <XIcon
        v-if="isAbleToDelete"
        class="clickable"
        @click="emit('item:remove', Number(index), true)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.circle {
  position: relative;
  width: 2.25rem;
  height: 2.25rem;
  background-color: var(--clr-gray-300);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  overflow: visible;

  .stepperContent &::before {
    content: "";
    position: absolute;
    left: -51px;
    top: 50%;
    transform: translateY(-50%);
    width: 51px;
    height: 2px;
    background-color: var(--clr-gray-400);
  }

  & span {
    color: var(--crl-gray-900);
  }
}

.part-item {
  &__container {
    padding-left: 9px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    margin-bottom: 1rem;

    @include mq("tablet") {
      flex-wrap: nowrap;
    }

    & .container {
      &__items {
        margin-top: 1.0625rem;
        display: flex;
        flex-wrap: wrap;
        gap: 9px;

        @include mq("mobile") {
          max-width: 70%;
          flex-direction: row;
          display: flex;
        }

        & .form-item {
          margin-bottom: 6px;

          @include mq("tablet") {
            margin-bottom: 0;
          }

          &.select {
            border-radius: 8px;
            border: 1px solid var(--clr-primary-100);
            &__type {
              min-width: 9.125rem;
            }

            &__system {
              min-width: 7.875rem;
            }

            &__chars {
              min-width: 7.4375rem;
            }
          }
        }
      }

      &__actions {
        margin-left: 9px;
        display: flex;
        align-items: center;
      }
    }

    & .field--wrapper {
      margin-bottom: 0;
    }

    & .draggable-icon {
      margin-right: 0.275rem;
      &:hover {
        cursor: grab;
      }
    }

    & .clickable:hover {
      cursor: pointer;
    }
  }
}

.invalid {
  border-color: var(--clr-error-500);
}

.vs__dropdown-menu.type-dropdown {
  min-width: 8rem;
}
</style>
