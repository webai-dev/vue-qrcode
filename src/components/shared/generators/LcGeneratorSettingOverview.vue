<script lang="ts" setup>
import type { IIdPartSettingsDto } from "~/types/stores/GeneratorStore"
import { SERIAL_NUMBER_TYPE } from "~/types/stores/GeneratorStore"
import LcIcon from "~/components/base/LcIcon.vue"
import { generateRandomSymbols } from "~/helpers/formatters"

type LcGeneratorSettingOverviewProps = {
  utmCode?: string | boolean
  targetLink?: string | boolean
  shortLink?: string | boolean
  idParts: IIdPartSettingsDto[]
  lastIdPartChanged: {
    index: number
    action: string
    part: IIdPartSettingsDto
  }
}

type LcGeneratorSettingOverviewEmits = {
  (event: "idPartMouseEnter", id: string): void
  (event: "idPartMouseLeave"): void
  (event: "idPartChangeExec"): void
}
const props = defineProps<LcGeneratorSettingOverviewProps>()
const targetLink = ref("")
const idPartValues = ref<string[]>([])

const emits = defineEmits<LcGeneratorSettingOverviewEmits>()

const swapIdPart = (index: number, newIndex: number) => {
  const newIdParts = [...idPartValues.value]
  const temp = newIdParts[index]
  newIdParts[index] = newIdParts[newIndex]
  newIdParts[newIndex] = temp
  idPartValues.value = newIdParts
}

defineExpose({
  swapIdPart,
})

const handleGenerateValue = (idPart: IIdPartSettingsDto): string =>
  idPart.type === SERIAL_NUMBER_TYPE.RANDOM
    ? generateRandomSymbols(idPart?.length as number, idPart.system)
    : idPart.startValue!

watchEffect(() => {
  targetLink.value = props.targetLink ? `${props.targetLink}?` : ""
})

watchEffect(
  () => {
    const initial = idPartValues.value
    const generated = props.idParts.map(handleGenerateValue)
    const difference = generated.length - initial.length

    if (difference > 0) {
      idPartValues.value = [...initial, ...generated.slice(-difference)]
    }

    const { action, index, part } = props.lastIdPartChanged
    if (action === "update" || action === "insert") {
      idPartValues.value[index] = handleGenerateValue(part)
    } else if (action === "remove") {
      idPartValues.value.splice(index, 1)
    }
  },
  { flush: "post" },
)

watchEffect(() => {
  targetLink.value = `${props.targetLink}${
    typeof props.targetLink === "string" && props.targetLink?.includes("?")
      ? "&"
      : typeof props.targetLink === "string" && props.targetLink?.length === 0
      ? ""
      : "?"
  }`
})
</script>
<template>
  <div class="lc-generator-setting-overview-container">
    <div class="lc-generator-setting-overview-header">Preview</div>
    <div class="lc-generator-setting-overview row">
      <div
        :class="[
          'lc-generator-setting-overview lc-generator-setting-overview-flex',
          !props?.utmCode ||
          (typeof props?.utmCode === 'string' && props?.utmCode.length > 1)
            ? 'mt-2'
            : '',
        ]"
      >
        <div class="lc-generator-setting-overview-item mw-lg">
          <div
            :class="[
              'lc-generator-setting-overview-url',
              typeof props.shortLink === 'string' &&
              props.shortLink?.length === 0
                ? 'mt-2'
                : '',
            ]"
          >
            <span class="lc-generator-setting-overview-value">{{
              props.shortLink
            }}</span>
            <div
              class="lc-generator-setting-overview-bracket short-link-bracket"
            />
            <span class="lc-generator-setting-overview-label">
              {{ $t("common.shortLink") }}
            </span>
          </div>
        </div>
        <LcIcon class="icon" size="small">arrow_forward</LcIcon>
        <div class="lc-generator-setting-overview-item wrap">
          <div
            :class="[
              'lc-generator-setting-overview-url',
              targetLink.length === 0 ? 'mt-2' : '',
            ]"
          >
            <span class="lc-generator-setting-overview-value">{{
              targetLink
            }}</span>

            <div class="lc-generator-setting-overview-bracket" />
            <span class="lc-generator-setting-overview-label">
              {{ $t("common.targetLink") }}
            </span>
          </div>
        </div>

        <div
          v-for="(idPartValue, idx) in idPartValues"
          :key="idPartValue"
          class="lc-generator-setting-overview-item"
        >
          <div
            class="lc-generator-setting-overview-id-part"
            @mouseenter="emits('idPartMouseEnter', idPartValue as string)"
            @mouseleave="emits('idPartMouseLeave')"
          >
            <span class="lc-generator-setting-overview-value"
              >{{ idx > 0 ? "&" : "" }}{{ `utm_id=${idPartValue}` }}</span
            >

            <div class="lc-generator-setting-overview-bracket" />
            <span class="lc-generator-setting-overview-label">
              {{ $t("common.idPart") }} #{{ idx + 1 }}
            </span>
          </div>
        </div>
        <div v-if="props.utmCode" class="lc-generator-setting-overview-item">
          <div class="lc-generator-setting-overview-url ml5">
            <span class="lc-generator-setting-overview-value">{{
              `&${props.utmCode}`
            }}</span>
            <div class="lc-generator-setting-overview-bracket" />
            <span class="lc-generator-setting-overview-label">
              {{ $t("common.utmParameter") }}
            </span>
          </div>
        </div>
        <div v-if="!props.utmCode" class="lc-generator-setting-overview-empty">
          <span>{{ $t("common.utm") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.lc-generator-setting-overview-container {
  background: var(--clr-gray-200);
  padding: var(--space-3) var(--space-4);
  border-radius: 0.75rem;
  max-width: 80%;

  .icon {
    color: var(--clr-gray-500);
  }

  .lc-generator-setting-overview-header {
    font-size: var(--display-xs-font-size);
    font-weight: 700;
    color: var(--clr-blue-gray-900);
  }

  .lc-generator-setting-overview {
    padding-top: var(--space-4);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: var(--space-2);
    gap: 2px;

    &.row {
      flex-direction: row;
    }

    > .lc-generator-setting-overview-item {
      display: flex;
      border-radius: 0.75rem;
      background: white;
      padding: 0 var(--space-3);
      justify-content: flex-start;
      align-items: center;
      height: 58px;
      gap: 5px;

      &.mw-lg {
        min-width: 137px;
      }

      .lc-generator-setting-overview-value {
        font-size: 12px;
        text-align: left;
      }

      .lc-generator-setting-overview-label {
        padding: 0;
      }

      .lc-generator-setting-overview-url,
      .lc-generator-setting-overview-id-part {
        min-width: 50px;
        margin: 0px;
        &.mt-2 {
          margin-top: 14px;
        }
        .lc-generator-setting-overview-label {
          padding: 0;
        }
      }
    }

    &-bracket {
      height: 0.2rem;
      min-width: 1rem;
      border: 1px solid var(--clr-gray-300);
      border-top: none;
      &.short-link-bracket {
        min-width: 4.125rem;
      }
    }

    &-label {
      color: var(--clr-gray-300);
      font-size: var(--text-xs-font-size);
    }

    &-url,
    &-id-part {
      background-color: white;
      padding: 0px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    &-id-part,
    &-url {
      &:hover {
        > span {
          color: var(--clr-primary-500);
          cursor: default;
        }

        .lc-generator-setting-overview-bracket {
          border-color: var(--clr-primary-500);
        }
      }
    }
    &-empty {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-end;
      height: 54px;
      min-width: 137px;
      border: 2px dashed var(--clr-gray-400);
      border-radius: 0.75rem;
      font-size: var(--text-xs-font-size);

      span {
        margin: var(--space-2);
        color: var(--clr-gray-400);
      }
    }

    &-flex {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 2px;
      margin: 0px;
      padding: 0px;

      & .wrap {
        max-width: 100%;
        .mw-200 {
          max-width: calc(100% - 200px);
        }
        flex-wrap: wrap;
        height: initial;
        min-height: 58px;
      }
    }
  }
}
</style>
