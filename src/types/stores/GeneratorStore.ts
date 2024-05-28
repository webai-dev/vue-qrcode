import type {
  IPagination,
  PAGINATION_ORDER,
  PAGINATION_ORDER_BY,
} from "~/types/stores/common"

import type { ProjectStatistic } from "~/stores/customer-messages"

/// ------ INTERFACE ------ ///
export enum SYSTEMS {
  FIX = "FIX",
  DEC = "DEC",
  HX_L = "HX_L",
  HX_U = "HX_U",
  AL_LOW = "AL_LOW",
  AL_UP = "AL_UP",
  URL_CH = "URL_CH",
}

export enum INCREMENT {
  FIXED = "FIXED",
  RANDOM = "RANDOM",
  INCREMENT = "INCREMENT",
}

export enum SERIAL_NUMBER_TYPE {
  FIXED = "FIXED",
  RANDOM = "RANDOM",
  INCREMENT = "INCREMENT",
}

export enum SET_EXPORT_STATUS {
  PROCESSING = "PROCESSING",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export type ISystemsOptions = {
  label: string
  value: SYSTEMS
  name: string
}

export type ITypesOptions = {
  label: string
  value: SERIAL_NUMBER_TYPE
  name: string
}

export type IIncrementOptions = {
  label: string
  value: INCREMENT | number | ""
}

export type ICharsOptions = {
  label: string
  value: number
}

export type IGeneratorValidationObject = {
  alpha: boolean
  alpha_num: boolean
  an_ex: boolean
  num: boolean
  hex: boolean
  length: boolean | number
}

/// ------ STORE / API ------ ///

// SINGLE QR TAGS
export interface IGenerateSingleQrTagData {
  customerId: string
  longURL: string
  callback?: Function
}

export interface IGeneratorSingleQrDto {
  id: string
  createdAt: Date
  updatedAt?: Date
  longURL: string
  shortURL: string
  svg: IGeneratorFileDto
  png: IGeneratorFileDto
}

export interface IGeneratorSingleQrsListData {
  customerId: string
  page: number
  order?: PAGINATION_ORDER
  orderBy?: PAGINATION_ORDER_BY
}

export interface IGeneratorSingleQrsListDto
  extends IPagination<IGeneratorSingleQrDto[]> {}

export interface IGeneratorProjectsAndSingleQrTagsListtDto
  extends IPagination<(IGeneratorProjectDto | IGeneratorSingleQrDto[])[]> {}

export interface IGetSingleQrTagData {
  customerId: string
  singleQrId: string
  callback?: Function
}

export interface IUpdateSingleQrTagData {
  customerId: string
  singleQrId: string
  payload: {
    longURL: string
  }
  callback?: Function
}

export interface IAddSingleQrTagsToProjectsListData {
  customerId: string
  projectsListPage?: number
}

// PROJECT ID SETTINGS PART
export enum DELIMITER {
  "." = ".",
  "_" = "_",
  "-" = "-",
  "/" = "/",
  " " = " ",
}

export interface IIdPartSettingsUpdateDto {
  system: SYSTEMS
  startValue?: string
  length?: number
  increment?: INCREMENT | number | ""
  type: SERIAL_NUMBER_TYPE
  index?: number
}

interface IIdPartBase {
  customerId: string
  projectId: string
}

export interface ICreateIdPartData extends IIdPartBase {
  payload: IIdPartSettingsUpdateDto
  callback?: Function
}

export interface IUpdateIdPartData extends ICreateIdPartData {
  partId: string
}

export interface IReorderIdPartDto {
  itemId: string
  from: number
  to: number
}

export interface IReorderIdPartData extends IIdPartBase {
  payload: IReorderIdPartDto
}

export interface IDeleteIdPartData extends IIdPartBase {
  partId: string
  callback?: Function
}

// PROJECT ID SETTINGS
export interface IIdPartSettingsDto extends IIdPartSettingsUpdateDto {
  id?: string
}

export interface IIdSettingsDto {
  parts: IIdPartSettingsDto[]
  delimiter: DELIMITER
}

export interface IGeneratorSettingsDto {
  id: IIdSettingsDto
  longURLBase: string
  shortURLDomain: string
}

export interface IGeneratorSettingsUpdateDto {
  id?: IIdSettingsDto
  longURLBase?: string
  shortURLDomain?: string
}

export interface IProjectIdPartsDto {
  data: IIdPartSettingsDto[]
}

// SETS
export enum STRING_FORMATS {
  TXT = "TXT",
  CSV = "CSV",
  JSON = "JSON",
}

export enum IMAGE_FORMATS {
  SVG = "SVG",
  PNG = "PNG",
}

export enum EXPORT_STATUS {
  PROCESSING = "PROCESSING",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export interface ICreateSetData {
  customerId: string
  projectId: string
  options?: {
    urls?: boolean
    qrs?: boolean
  }
  amount: number
  exports: {
    ids?: IGeneratorBaseExportDataSettingsUpdateDto<Array<STRING_FORMATS>>
    urls?: IGeneratorBaseExportDataSettingsUpdateDto<Array<STRING_FORMATS>>
    qrs?: IGeneratorBaseExportDataSettingsUpdateDto<Array<IMAGE_FORMATS>>
  }
  callback?: Function
}

export interface IGeneratorBaseExportDataSettingsUpdateDto<formats> {
  maxSize?: number
  maxCount?: number
  formats: formats
}

export interface IGeneratorProjectSetCreateDto {
  amount: number
  overrides?: {
    longURLBase: string
  }
  options?: {
    urls?: boolean
    qrs?: boolean
  }
  exports: {
    ids?: IGeneratorBaseExportDataSettingsUpdateDto<Array<STRING_FORMATS>>
    urls?: IGeneratorBaseExportDataSettingsUpdateDto<Array<STRING_FORMATS>>
    qrs?: IGeneratorBaseExportDataSettingsUpdateDto<Array<IMAGE_FORMATS>>
  }
}

export interface IGeneratorFileDto {
  createdAt: string
  size: number
  name: string
  downloadUrl: string
}

export interface IGeneratorExportSettingsDto<formats>
  extends IGeneratorBaseExportDataSettingsUpdateDto<formats> {
  fields: any[]
}

export interface IGeneratorBaseProjectSetDataExportDto<formats> {
  status: EXPORT_STATUS
  errors?: string[]
  files: IGeneratorFileDto[]
  settings: IGeneratorExportSettingsDto<formats>
}

export interface IGeneratorProjectSetDto {
  id: string
  projectId: string
  amount: number
  createdAt: string
  updatedAt?: string
  overrides?: { longURLBase: string }
  preview?: {
    firstId: string
    lastId: string
  }
  status: SET_EXPORT_STATUS
  errors?: string[]
  options?: {
    urls: boolean
    qrs: boolean
  }
  exports: {
    ids: IGeneratorBaseProjectSetDataExportDto<Array<STRING_FORMATS>>
    urls: IGeneratorBaseProjectSetDataExportDto<Array<STRING_FORMATS>>
    qrs: IGeneratorBaseProjectSetDataExportDto<Array<IMAGE_FORMATS>>
  }
}

export interface ISetsPreview
  extends IPagination<Array<IGeneratorProjectSetDto>> {}

export interface IPollSetStatusData {
  customerId: string
  projectId: string
  setId: string
  callback?: Function
}

export interface IGeneratorProjectSetStatusDto {
  id: string
  projectId: string
  status: EXPORT_STATUS
}

export interface IGeneratorProjectSetsStatusDto {
  data: Array<IGeneratorProjectSetStatusDto>
}

export interface IGetSetData {
  customerId: string
  projectId: string
  setId: string
  callback?: Function
}

export interface ISetsPerProject {
  [projectId: string]: IPagination<IGeneratorProjectSetDto[]>
}

export interface IGetSetsPerProjectData {
  customerId: string
  projectId: string
  page: number
}

export interface IGeneratorProjectSetUpdateDto {
  overrides?: {
    longURLBase: string | null
  }
  options?: {
    urls: boolean
    qrs: boolean
  }
  exports?: {
    ids?: IGeneratorBaseExportDataSettingsUpdateDto<Array<STRING_FORMATS>>
    urls?: IGeneratorBaseExportDataSettingsUpdateDto<Array<STRING_FORMATS>>
    qrs?: IGeneratorBaseExportDataSettingsUpdateDto<Array<IMAGE_FORMATS>>
  }
}

export interface IUpdateSetData {
  customerId: string
  projectId: string
  setId: string
  payload: IGeneratorProjectSetUpdateDto
  callback?: Function
}

export interface IDeleteSetData {
  customerId: string
  projectId: string
  setId: string
  callback?: Function
}

// PROJECT
export interface ICreateProjectData {
  customerId: string
  name?: string
}

export interface IGetProjectsData {
  customerId: string
  page?: number
  perPage?: number
  callback?: Function
  order?: PAGINATION_ORDER
  orderBy?: PAGINATION_ORDER_BY
}

export interface IGetProjectData {
  customerId: string
  projectId: string
  callback?: Function
}

export interface IUpdateProjectData {
  customerId: string
  projectId: string
  payload: IGeneratorProjectUpdateDto
  callback?: Function
  preventLoader?: boolean
}

export interface IDeleteProjectData {
  customerId: string
  projectId: string
  callback?: Function
}

export interface IGeneratorProjectDto {
  id: string
  name: string
  settings: IGeneratorSettingsDto
  createdAt: string
  updatedAt: string
  setsPreview: ISetsPreview
  statistics: ProjectStatistic
}

export interface IGeneratorProjectUpdateDto {
  name?: string
  settings?: IGeneratorSettingsUpdateDto
}

export interface IGeneratorProjectsDto
  extends IPagination<IGeneratorProjectDto[]> {}

export enum URL_TYPES {
  short = "short",
  long = "long",
}

export interface IGeneratorUrlDto {
  type: URL_TYPES
  value: string
}

export interface IGeneratorUrlsDto {
  data: Array<IGeneratorUrlDto>
}

export interface IGeneratorGlobalSettingsDto {
  shortUrlDomainName: string
}

// DOMAIN NAMES
export interface IDomainNameDto {
  nameservers: string[]
  status: string
  createdAt: Date
  domainName: string
}
