import { SYSTEMS } from "~/types/stores/GeneratorStore"

export const localeWrapper = (value: string): string =>
  value !== "" ? Number(value).toLocaleString("de-DE") : ""

export const localeReplacing = (value: string): string =>
  value.replaceAll(".", "")

export const generateRandomSymbols = (
  length: number,
  system: SYSTEMS,
): string => {
  let radix: number
  if (system === SYSTEMS.AL_LOW || system === SYSTEMS.AL_UP) radix = 32
  if (system === SYSTEMS.HX_U || system === SYSTEMS.HX_L) radix = 16
  if (system === SYSTEMS.DEC) radix = 10

  const chars = Math.random()
    .toString(radix!)
    .slice(2, 2 + length)

  if (system === SYSTEMS.HX_L) return chars.toLowerCase()
  if (system === SYSTEMS.HX_U) return chars.toUpperCase()
  if (system === SYSTEMS.AL_LOW) return chars.toLowerCase()
  if (system === SYSTEMS.AL_UP) return chars.toUpperCase()

  return chars
}

export const appendUTMCodesToUrl = (url: string, utmCodes: string[] = []) => {
  const utmParameters = utmCodes.map((code) => `utm_source=${code}`).join("&")
  return `${url}?${utmParameters}`
}

export const isValidUrl = (url: string) => {
  const websiteRegex =
    /^(http[s]?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/
  return websiteRegex.test(url)
}

export const isValidAscii = (str: string) => {
  if (!/^\d+$/.test(str)) return false
  const num = parseInt(str, 10)
  if (isNaN(num)) return false
  if (num < 0 || num > 127) return false
  return true
}
