<template>
  <div>
    <DataValidator :data="data" allow-missing-columns>
      <BaseAlert v-if="error" type="error">{{ message }}</BaseAlert>
      <div class="d-flex flex-row align-center">
        <BaseSearchBar v-model="search" />
        <FormDialog :headers="headers" :values="filteredItems" />
      </div>
      <VDataTable
        v-bind="{ headers: tableHeaders, search }"
        ref="tableRef"
        :items="filteredItems"
        multi-sort
        fixed-header
        height="530"
        :footer-props="{ itemsPerPageOptions: [5, 10, 15, 500, 1000] }"
        data-testid="data-table"
        @current-items="onItemsUpdate"
      >
        <template v-for="header in headers" #[`header.${header.value}`]>
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
              <VAutocomplete
                v-model="filters[header.value]"
                flat
                hide-details
                full-width
                multiple
                chips
                dense
                class="pa-4"
                label="Search ..."
                :items="columnValues(header)"
                :menu-props="{ closeOnClick: true }"
              >
                <template #selection="{ item, index }">
                  <VChip v-if="index < 3" class="ma-1">
                    <span>
                      {{ item }}
                    </span>
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
                >Clear</VBtn
              >
            </div>
          </VMenu>
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
import { toDateString } from '@/utils/dates'
import FormDialog from '~/components/chart/forms/FormDialog.vue'
export default {
  name: 'UnitFilterableTable',
  components: { FormDialog },
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
