<template>
  <div>
    <DataValidator :data="data" :allow-missing-columns="true">
      <VAlert v-if="error" type="error">{{ message }}</VAlert>
      <VRow align="center">
        <BaseSearchBar v-model="search"></BaseSearchBar>
        <VBtn class="ml-2" icon @click="advancedSearch = !advancedSearch">
          <VIcon :color="advancedSearch ? 'primary' : ''">
            $vuetify.icons.mdiFilter
          </VIcon>
        </VBtn>
      </VRow>
      <VDataTable
        v-bind="{ headers: tableHeaders, search }"
        ref="tableRef"
        :items="filteredItems"
        multi-sort
        fixed-header
        max-height="610"
        :footer-props="{ itemsPerPageOptions: [5, 10, 15, 500, 1000] }"
        data-testid="data-table"
        @current-items="onItemsUpdate"
      >
        <template v-if="advancedSearch" #header>
          <tr class="grey lighten-3">
            <td v-for="header in headers" :key="header.value">
              <VAutocomplete
                v-model="filters[header.value]"
                flat
                hide-details
                multiple
                attach
                chips
                dense
                clearable
                class="pa-4"
                label="Search ..."
                :items="columnValues(header.value)"
              >
                <template #selection="{ item, index }">
                  <VChip v-if="index < 5">
                    <span>
                      {{ item }}
                    </span>
                  </VChip>
                  <span v-if="index === 5" class="grey--text caption">
                    (+{{ filters[header.value].length - 5 }} others)
                  </span>
                </template>
              </VAutocomplete>
            </td>
          </tr>
        </template>
        <template #item.url="{ value }">
          <a target="_blank" rel="noreferrer noopener" :href="value"> Link </a>
        </template>
        <template
          v-for="header in headers.filter(h => h.value !== 'url')"
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
export default {
  name: 'UnitFilterableTable',
  props: {
    data: {
      type: Object,
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
      tableHeaders: [],
      files: null,
      filters: {}
    }
  },
  computed: {
    headers() {
      let headers = this.data?.headers || []
      if (typeof headers[0] === 'string') {
        // allow headers to be an array of strings
        headers = headers.map(h => ({
          text: h,
          value: h
        }))
      }
      // add column attributes
      return headers.map(h => ({
        ...h,
        align: 'left',
        sortable: true
      }))
    },
    items() {
      return this.data?.items || []
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
    data: {
      immediate: true,
      handler(data) {
        this.tableHeaders = this.headers
      }
    }
  },
  methods: {
    formatItemAsString(itemProps) {
      const { header, value } = itemProps
      const assumeDate = ['date', 'time'].find(d =>
        header.value.toLowerCase().includes(d)
      )
      if (assumeDate) {
        return new Date(value).getFullYear() > 1980
          ? new Date(value).toLocaleString()
          : new Date(value * 1000).toLocaleString()
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
        const headers = this.headers.map(h => h.text)
        const filteredItems = this.$refs.tableRef.$children[0].filteredItems
        // Change the items keys to match the headers
        const itemsWithHeader = filteredItems.map(i =>
          this.headers.reduce((o, h) => ({ ...o, [h.text]: i[h.value] }), {})
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
    columnValues(val) {
      return this.items.map(d => d[val])
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
