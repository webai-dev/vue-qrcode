<script lang="ts" setup>
import { generateRandomSymbols } from "~/helpers/formatters"
import type { IIdPartSettingsDto } from "~/types/stores/GeneratorStore"
import { SERIAL_NUMBER_TYPE } from "~/types/stores/GeneratorStore"

type LcGeneratorSettingOverviewProps = {
  shortUrl?: string | boolean
  idParts: IIdPartSettingsDto[]
}

type LcGeneratorSettingOverviewEmits = {
  (event: "idPartMouseEnter", id: string): void
  (event: "idPartMouseLeave"): void
}
const props = defineProps<LcGeneratorSettingOverviewProps>()

const emits = defineEmits<LcGeneratorSettingOverviewEmits>()

const handleGenerateValue = (idPart: IIdPartSettingsDto): string =>
  idPart.type === SERIAL_NUMBER_TYPE.RANDOM
    ? generateRandomSymbols(idPart?.length as number, idPart.system)
    : idPart.startValue!
</script>
<template>
  <div class="lc-generator-setting-overview">
    <span v-if="props.shortUrl" class="lc-generator-setting-overview-url">
      <span>{{ props.shortUrl }}</span>
      <div class="lc-generator-setting-overview-bracket" />
      <span class="lc-generator-setting-overview-label">
        {{ $t("common.url") }}
      </span>
    </span>
    <div
      v-for="(idPart, idx) in props.idParts"
      :key="idPart.id || `index-${idx}`"
      class="lc-generator-setting-overview-id-part"
      data-cy="id-part-preview-item"
      @mouseenter="emits('idPartMouseEnter', idPart.id!)"
      @mouseleave="emits('idPartMouseLeave')"
    >
      <span class="lc-generator-setting-overview-input">{{
        handleGenerateValue(idPart)
      }}</span>
      <div class="lc-generator-setting-overview-bracket" />
      <span class="lc-generator-setting-overview-label">
        {{ `ID Part #${idx + 1}` }}
      </span>
    </div>
  </div>
</template>
<style lang="scss">
.lc-generator-setting-overview {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;

  &-input {
    width: 100%;
    text-align: left;
    color: var(--clr-gray-300);
    font-size: var(--text-xs-font-size);
  }

  &-bracket {
    height: 0.2rem;
    width: 100%;
    border: 1px solid var(--clr-gray-300);
    border-top: none;
  }

  &-label {
    width: 100%;
    text-align: left;
    color: var(--clr-gray-300);
    font-size: var(--text-xs-font-size);
    padding-bottom: 0.5rem;
  }

  &-url {
    margin-right: var(--space-2);
    margin-bottom: var(--space-4);
  }

  &-id-part {
    min-width: 115px;
    min-height: 58px;
    background-color: var(--clr-gray-50);
    border-radius: 12px;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-right: var(--space-2);
    margin-bottom: var(--space-4);

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
}
</style>
