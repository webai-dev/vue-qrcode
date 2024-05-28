import type {
  ICharsOptions,
  IIdPartSettingsUpdateDto,
  IIncrementOptions,
  ISystemsOptions,
  ITypesOptions,
} from "~/types/stores/GeneratorStore"
import {
  INCREMENT,
  SYSTEMS,
  SERIAL_NUMBER_TYPE,
} from "~/types/stores/GeneratorStore"

export const SYSTEM_OPTIONS: ISystemsOptions[] = [
  { label: "Fixed", name: "FIX", value: SYSTEMS.FIX },
  { label: "Decimal", name: "DEC", value: SYSTEMS.DEC },
  { label: "Hex lowercase", name: "HX_L", value: SYSTEMS.HX_L },
  { label: "Hex uppercase", name: "HX_U", value: SYSTEMS.HX_U },
  { label: "ASCII", name: "AL_UP", value: SYSTEMS.AL_UP },
  { label: "Valid url chars", name: "URL_CH", value: SYSTEMS.URL_CH },
]

export const TYPE_OPTIONS: ITypesOptions[] = [
  { label: "Fixed", name: "FIX", value: SERIAL_NUMBER_TYPE.FIXED },
  {
    label: "Increment",
    name: "INCREMENT",
    value: SERIAL_NUMBER_TYPE.INCREMENT,
  },
  { label: "Random", name: "RANDOM", value: SERIAL_NUMBER_TYPE.RANDOM },
]

export const INCREMENT_OPTIONS: IIncrementOptions[] = [
  { label: "random", value: INCREMENT.RANDOM },
  { label: "+1", value: 1 },
  { label: "-1", value: -1 },
]
export const CHAR_LENGTH_OPTIONS: ICharsOptions[] = [
  { label: "4 digit", value: 4 },
  { label: "5 digit", value: 5 },
  { label: "6 digit", value: 6 },
  { label: "7 digit", value: 7 },
  { label: "8 digit", value: 8 },
  { label: "9 digit", value: 9 },
]

export const defaultRandomItem: IIdPartSettingsUpdateDto = {
  system: SYSTEM_OPTIONS[1].value,
  length: CHAR_LENGTH_OPTIONS[0].value,
  type: SERIAL_NUMBER_TYPE.RANDOM,
}

export const defaultIdPartsItems: {
  [key in SERIAL_NUMBER_TYPE]: IIdPartSettingsUpdateDto
} = {
  RANDOM: {
    system: SYSTEM_OPTIONS[1].value,
    length: CHAR_LENGTH_OPTIONS[0].value,
    type: TYPE_OPTIONS[2].value,
  },
  FIXED: {
    system: SYSTEM_OPTIONS[0].value,
    type: TYPE_OPTIONS[0].value,
    startValue: "0",
  },
  INCREMENT: {
    system: SYSTEM_OPTIONS[1].value,
    type: TYPE_OPTIONS[1].value,
    startValue: "0",
    length: CHAR_LENGTH_OPTIONS[0].value,
    increment: INCREMENT_OPTIONS[0].value,
  },
}
