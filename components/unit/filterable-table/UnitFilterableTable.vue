<template>
  <div>
    <DataValidator
      :data="{ items: items, headers: headers }"
      allow-missing-columns
    >
      <BaseAlert v-if="error" type="error">{{ message }}</BaseAlert>
      <BaseSearchBar v-model="search"></BaseSearchBar>
      <VDataTable
        v-bind="{ headers: data.headers, search }"
        ref="tableRef"
        :items="filteredItems"
        multi-sort
        :items-per-page.sync="itemsPerPage"
        fixed-header
        :height="height"
        :footer-props="{ itemsPerPageOptions: [5, 10, 15, 500, 1000] }"
        data-testid="data-table"
        @current-items="onItemsUpdate"
      >
        <template v-for="header in data.headers" #[`header.${header.value}`]>
          {{ header.text }}
          <VMenu
            :id="header.value"
            :key="header.value"
            offset-y
            :close-on-content-click="false"
          >
            <template #activator="{ on, attrs }">
              <VBtn icon v-bind="attrs" v-on="on">
                <VIcon
                  small
                  :color="
                    filters[header.value] && filters[header.value].length
                      ? 'success'
                      : ''
                  "
                >
                  $vuetify.icons.mdiFilter
                </VIcon>
              </VBtn>
            </template>
            <div style="background-color: white; width: 280px">
              <div class="d-flex justify-space-between">
                <div class="overline ma-3">{{ header.text }}</div>
                <VChip
                  :color="typeColors[String(header.type).toLowerCase()]"
                  small
                  outlined
                  class="ma-4"
                  >{{ String(header.type).toLowerCase() }}</VChip
                >
              </div>
              <VAutocomplete
                v-model="filters[header.value]"
                flat
                hide-details
                full-width
                multiple
                dense
                class="pa-4 pt-0"
                label="Search ..."
                :items="columnValues(header)"
                :menu-props="{ closeOnClick: true }"
              >
                <template #selection="{ item, index }">
                  <VChip v-if="index < 3" class="ma-1 pr-1">
                    <span
                      style="
                        overflow-x: hidden;
                        whitespace: nowrap;
                        text-overflow: ellipsis;
                      "
                    >
                      {{ item }}
                    </span>
                    <VBtn
                      icon
                      small
                      right
                      @click="filters[header.value].splice(index, 1)"
                    >
                      <VIcon small>$vuetify.icon.mdiCloseCircle</VIcon>
                    </VBtn>
                  </VChip>
                  <span v-if="index === 3" class="grey--text caption">
                    (+{{ filters[header.value].length - 3 }} others)
                  </span>
                </template>
              </VAutocomplete>
              <VBtn
                small
                text
                color="primary"
                class="ml-2 mb-2"
                @click="filters[header.value] = []"
                v-text="`Clear`"
              />
            </div>
          </VMenu>
        </template>
        <template #item.url="{ value }">
          <a target="_blank" rel="noreferrer noopener" :href="value"> Link </a>
        </template>
        <template
          v-for="header in data.headers.filter(h => h.value !== 'url')"
          #[`item.${header.value}`]="slotProps"
        >
          {{ formatItemAsString(slotProps) }}
        </template>
      </VDataTable>
      <BaseButton
        v-bind="{ error, progress, status }"
        text="Export"
        icon="mdiExport"
        @click="exportCSV"
      />
      <BaseButtonDownloadData
        v-bind="{ disabled: !csvString, extension, data: csvString }"
      />
      <BaseButtonShare v-bind="{ disabled: !files, files }" file-share />
    </DataValidator>
  </div>
</template>

<script>
import { writeToString } from '@fast-csv/format'
import { processError } from '@/utils/utils'
import { formatObject, formatArray } from '@/utils/json'
import { toDateString } from '@/utils/dates'
import { detectTypes } from '@/utils/type-check'

const height5 = 290
const height10 = 530
const defaultItemsPerPage10 = window.innerHeight - 250 > 530

export default {
  name: 'UnitFilterableTable',
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      advancedSearch: false,
      status: false,
      error: false,
      progress: false,
      csvString: '',
      message: '',
      extension: 'csv',
      search: '',
      files: null,
      filters: {},
      itemsPerPage: defaultItemsPerPage10 ? 10 : 5,
      height: defaultItemsPerPage10 ? height10 : height5,
      typeColors: {
        boolean: '#F24535',
        string: '#265918',
        float: '#25B8D9',
        int: '#8B278C',
        date: '#F28322',
        datetime: '#F28322',
        time: '#F28322',
        array: '#9FC131',
        object: '#042940'
      }
    }
  },
  computed: {
    data() {
      let tempHeaders = this.headers
      if (typeof this.headers[0] === 'string') {
        // allow headers to be an array of strings
        tempHeaders = this.headers.map(h => ({
          text: h,
          value: h
        }))
      }

      // Type detection
      const { headers, items } = detectTypes(tempHeaders, this.items)

      // Add column style and options
      return {
        headers: headers.map(h => ({
          ...h,
          align: 'left',
          sortable: true
        })),
        items
      }
    },
    filteredItems() {
      return this.items.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    }
  },
  watch: {
    itemsPerPage: {
      immediate: true,
      handler(value) {
        if (value === 5) {
          this.height = height5
        } else if (defaultItemsPerPage10) {
          this.height = height10
        }
      }
    }
  },
  methods: {
    formatItemAsString(itemProps) {
      const { header, value } = itemProps
      // eslint-disable-next-line no-prototype-builtins
      if (header.hasOwnProperty('formatter')) {
        return header.formatter(value)
      }
      if (Array.isArray(value)) {
        return formatArray(value)
      }
      if (typeof value === 'object') {
        return formatObject(value)
      }
      return toDateString(header.value, value)
    },
    async exportCSV() {
      this.progress = true
      this.status = false
      this.error = false
      try {
        const headers = this.data.headers.map(h => h.text)
        const filteredItems = this.$refs.tableRef.$children[0].filteredItems
        // Change the items keys to match the headers
        const itemsWithHeader = filteredItems.map(i =>
          this.data.headers.reduce(
            (o, h) => ({ ...o, [h.text]: i[h.value] }),
            {}
          )
        )
        // update the data
        const csv = await writeToString(itemsWithHeader, { headers })
        this.csvString = csv
        this.files = [new File([csv], 'results.csv', { type: 'text/csv' })]
      } catch (error) {
        console.error(error)
        this.error = true
        this.message = processError(error)
      } finally {
        this.progress = false
        this.status = true
      }
    },
    columnValues(header) {
      return this.items.map(d =>
        this.formatItemAsString({ header, value: d[header.value] })
      )
    },
    onItemsUpdate() {
      // wait until the DOM has completely updated
      this.$nextTick(() => {
        // emit the current filtered items
        this.$emit(
          'current-items',
          // workaround to get the filtered items https://github.com/vuetifyjs/vuetify/issues/8731#issuecomment-617399086
          this.$refs.tableRef.$children[0].filteredItems
        )
      })
    }
  }
}
</script>
<style>
.v-data-table-header th {
  white-space: nowrap;
}
</style>
