<template>
  <div>
    <DataValidator
      :data="{ items, headers }"
      allow-missing-columns
    >
      <BaseAlert v-if="error" type="error">
        {{ message }}
      </BaseAlert>
      <BaseSearchBar v-model="search" />
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
          <UnitFilter
            :key="header.value"
            v-bind="{ header, values: columnValues(header) }"
            @filter-change="filterChange(header.value, $event)"
          />
        </template>
        <template #item.url="{ value }">
          <ExternalLink v-t="'Link'" :href="value" />
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
import * as Papa from 'papaparse'
import { processError } from '@/utils/utils'
import { formatObject, formatArray } from '@/utils/json'
import { TypeChecker } from '@/utils/type-check'
import kViewBlockMixin from '@/mixins/k-view-block'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseButtonDownloadData from '@/components/base/button/download/BaseButtonDownloadData.vue'
import BaseButtonShare from '@/components/base/button/BaseButtonShare.vue'
import UnitFilter from './UnitFilter.vue'
import ExternalLink from '@/components/ExternalLink.vue'
import BaseSearchBar from '@/components/base/BaseSearchBar.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import DataValidator from '@/components/DataValidator.vue'

const height5 = 290
const height10 = 530
const defaultItemsPerPage10 = window.innerHeight - 250 > 530

export default {
  name: 'UnitFilterableTable',
  mixins: [kViewBlockMixin],
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      required: true
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
      filteredItems: [],
      itemsPerPage: defaultItemsPerPage10 ? 10 : 5,
      height: defaultItemsPerPage10 ? height10 : height5
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
      const typeChecker = new TypeChecker(this)
      const { headers, items } = typeChecker.detectTypes(tempHeaders, this.items)
      // Add column style and options
      return {
        headers: headers.map(({ text, ...rest }) => {
          return {
            ...rest,
            text: this.$tev(this.kViewBlock(text, 'headers'), text),
            align: 'left',
            sortable: true
          }
        }),
        items
      }
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
    },
    data: {
      immediate: true,
      handler() {
        this.applyFilters()
      }
    }
  },
  methods: {
    filterChange(header, filter) {
      this.filters[header] = filter
      this.applyFilters()
    },
    applyFilters() {
      this.filteredItems = this.data.items.filter((d) => {
        return Object.entries(this.filters).every(([header, filter]) => {
          return filter === null || filter(d[header])
        })
      })
    },
    formatItemAsString(itemProps) {
      const { header, value } = itemProps
      // eslint-disable-next-line no-prototype-builtins
      if (header.hasOwnProperty('formatter')) {
        // call the formatter function with 'this' given as the Vue instance
        return header.formatter.call(this, value)
      }
      if (Array.isArray(value)) {
        return formatArray(value)
      }
      if (typeof value === 'object') {
        return formatObject(value)
      }
      return value
    },
    async exportCSV() {
      this.progress = true
      this.status = false
      this.error = false
      try {
        const { filteredItems } = this.$refs.tableRef.$children[0]
        // Change the items keys to match the headers
        const itemsWithHeader = filteredItems.map(i => this.data.headers.reduce((o, h) => ({ ...o, [h.text]: i[h.value] }), {}))
        // update the data
        const csv = await Papa.unparse(itemsWithHeader)
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
      return this.data.items.map(d => this.formatItemAsString({ header, value: d[header.value] }))
    },
    onItemsUpdate() {
      // wait until the DOM has completely updated
      this.$nextTick(() => {
        // workaround to get the filtered items https://github.com/vuetifyjs/vuetify/issues/8731#issuecomment-617399086
        const { filteredItems } = this.$refs.tableRef.$children[0]
        // emit the current filtered items
        this.$emit('current-items', filteredItems)
        /*
                this.$store.commit('setResult', {
                  experience: this.id,
                  result: {
                    headers: this.headers,
                    items: filteredItems
                  }
                })
                */
      })
    }
  },
  components: { BaseButton, BaseButtonDownloadData, BaseButtonShare, UnitFilter, ExternalLink, BaseSearchBar, BaseAlert, DataValidator }
}
</script>
<style>
.v-data-table-header th {
  white-space: nowrap;
}
</style>
