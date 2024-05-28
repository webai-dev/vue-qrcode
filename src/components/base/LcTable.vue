<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th
            v-for="(
              { key, title, isSortable, customHeaderClass }, index
            ) in columns"
            :key="key"
            :data-label="title"
            :class="[customHeaderClass]"
          >
            <LcCheckbox
              v-if="selectable && index === 0"
              id="all-selected"
              :model-value="allSelected"
              :indeterminate="someSelected"
              @change="selectAll"
            />

            <span v-else>{{ title }}</span>
            <button v-if="isSortable" @click="handleSort(key)">SORT</button>
          </th>
        </tr>
      </thead>
      <tbody name="scale">
        <template v-if="!isLoading && data && data.length > 0">
          <tr
            v-for="(item, rowIndex) in data"
            :key="identifier && item[identifier] ? item[identifier] : rowIndex"
            class="table__row"
            data-cy="table-row"
            @click="handleRowClick(item)"
          >
            <td
              v-for="(
                { key, customCellClass, wrapMobile }, colIndex
              ) in columns"
              :key="key"
              :data-label="columns[colIndex].title"
              :class="[
                customCellClass,
                wrapMobile ? 'wrap-mobile' : '',
                { actions: columns[colIndex].key === 'actions' },
              ]"
            >
              <LcCheckbox
                v-if="selectable && colIndex === 0"
                :id="item[identifier]"
                v-model="selected[item[identifier]]"
                @change="toggleRowSelection(item)"
              />
              <slot :name="key" v-bind="{ item }" :colkey="key">
                {{ item[key] }}
              </slot>
            </td>
          </tr>
        </template>
        <template v-else-if="isLoading">
          <tr key="loader" class="table__nodata">
            <th :colspan="columns.length"><LcLoader size="md" /></th>
          </tr>
        </template>
        <template v-else>
          <tr key="no-data" class="table__nodata">
            <th :colspan="columns.length">{{ $t("common.no_data") }}</th>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import LcCheckbox from "~/components/base/LcCheckbox.vue"
import LcLoader from "~/components/base/LcLoader.vue"

export interface TableColumn {
  key: string
  title: string
  customCellClass?: string
  customHeaderClass?: string
  isSortable?: boolean
  wrapMobile?: boolean
}

const emits = defineEmits<{
  (e: "sortChanged", data: any): void
  (e: "rowClick", data: any): void
  (e: "allSelected", selected: boolean): void
  (e: "toggleRowSelection", selected: any, row?: any): void
}>()
const props = defineProps<{
  identifier: string
  columns: TableColumn[]
  data: Array<any | undefined>
  selectable?: boolean
  isLoading?: boolean
}>()
const handleSort = (col: any) => {
  emits("sortChanged", col)
}
const handleRowClick = (row: any) => {
  emits("rowClick", row)
}

const selected = ref<{
  [key: number | string]: boolean
}>({})

const allSelected = computed(() => {
  return (
    Boolean(props.data.length) &&
    props.data.length ===
      Object.values(selected.value).filter((i) => i === true).length
  )
})

const someSelected = computed(() => {
  if (!props.data.length) {
    return false
  }
  const checkedCount = Object.values(selected.value).filter(
    (i) => i === true,
  ).length

  return checkedCount > 0 && checkedCount !== props.data.length
})

const selectAll = () => {
  if (!allSelected.value) {
    props.data.forEach((_row) => {
      selected.value[_row[props.identifier]] = true
    })
  } else {
    props.data.forEach((_row) => {
      selected.value[_row[props.identifier]] = false
    })
  }
  const selectedList = Object.keys(selected.value).filter(
    (i) => selected.value[i] === true,
  )
  emits("toggleRowSelection", selectedList)
}

const toggleRowSelection = (_row: any) => {
  selected.value[_row[props.identifier]] =
    !!selected.value[_row[props.identifier]]

  emits("toggleRowSelection", selected.value, _row)
}
</script>

<style lang="scss">
.table {
  width: 100%;
  grid-column: span 6;
  border-spacing: 0;
  table-layout: fixed;
}
.table tbody tr {
  height: 72px;
}

.table thead tr {
  height: 48px;
}
.table td {
  padding-left: 16px;
  padding-right: 16px;
  vertical-align: middle;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;

  &.lc-no-ellipsis {
    text-overflow: unset;
    overflow: visible;
  }

  .lc-table-actions__mobile {
    display: none;
  }
}
.table thead {
  width: 100%;
}
.table thead th {
  font-size: var(--text-sm-font-size);
  line-height: var(--text-sm-line-height);
  font-weight: var(--font-weight-regular);
  text-align: left;
  text-transform: capitalize;
  color: var(--clr-gray-500);
  padding: 14px 16px;
  background-color: var(--clr-gray-100);
}

.table .table__row {
  box-shadow: none;
  transition: 0.22s;
}
.table .table__row td {
  font-size: var(--text-md-font-size);
  line-height: var(--text-md-line-height);
  color: var(--clr-gray-500);
  border-top: 1px solid var(--clr-gray-200);

  &:first-child {
    color: var(--clr-gray-800);
    font-weight: var(--font-weight-medium);
  }
}
.table .table__row:hover {
  background-color: var(--clr-gray-50);
}

.table .table__nodata th {
  text-align: center;
  background: var(--clr-primary-25);
  border-bottom: 1px solid var(--clr-primary-50);
  border-top: 1px solid var(--clr-primary-50);
  padding: var(--space-3) 0;
  font-size: var(--text-sm-font-size);
  font-weight: var(--font-weight-medium);
  color: var(--clr-primary-500);
  width: 100%;
}

// mobile
@include mqDesktopFirst("tablet") {
  thead {
    display: none;
  }

  .table .table__row {
    display: flex;
    flex-wrap: wrap;

    td {
      border: unset;

      .avatar-wrapper {
        display: none;
      }

      &.lc-hide-mobile {
        .lc-table-actions {
          display: none;
        }
      }

      .lc-table-actions__mobile {
        display: inline;
      }
    }
  }

  .table td {
    padding: 0 0 var(--space-1);

    &:first-child {
      flex: 1 0 auto;
    }

    &:not(:first-child).wrap-mobile {
      order: 10;
      width: 100%;

      &.one-line {
        width: fit-content;
      }
    }

    &:not(.wrap-mobile) {
      margin-bottom: -2rem;
    }
  }

  tr {
    display: grid;
    padding: var(--space-3) var(--space-4);
    align-items: center;
    box-shadow: none;
    transition: 0.22s;
    border: 1px solid var(--clr-gray-100);
    border-radius: unset;
  }

  td {
    display: flex;
    justify-content: space-between;
    border-top: unset;

    &.actions {
      width: 20%;
      justify-content: flex-end;

      .button__text {
        display: none;
      }
    }
  }
}
</style>
