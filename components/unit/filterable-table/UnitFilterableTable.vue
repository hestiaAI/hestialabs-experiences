<template>
  <div>
    <div v-if="isValid">
      <VAlert v-if="error" type="error">{{ message }}</VAlert>
      <UnitFilterableTableFilter
        :display-filters="displayFilters"
        :headers="headers"
        @update="onFilterUpdate"
      />
      <VDataTable
        v-bind="{ headers: tableHeaders, items, search }"
        ref="tableRef"
        :hide-default-footer="disabled"
        multi-sort
        fixed-header
        height="500"
        :footer-props="{ itemsPerPageOptions: [5, 10, 15, 500, 1000] }"
        data-testid="data-table"
        @current-items="onItemsUpdate"
      >
        <template #item.url="{ value }">
          <a target="_blank" rel="noreferrer noopener" :href="value"> Link </a>
        </template>
      </VDataTable>
      <BaseButton
        v-bind="{ disabled, error, progress, status }"
        text="Export"
        icon="mdiExport"
        @click="exportCSV"
      />
      <BaseButtonDownloadData
        v-bind="{ disabled: !csvString, extension, data: csvString }"
      />
      <BaseButtonShare v-bind="{ disabled: !files, files }" file-share />
    </div>
    <i v-else data-testid="data-error"
      >data in this format cannot be displayed in a table</i
    >
  </div>
</template>

<script>
import { writeToString } from '@fast-csv/format'
import { processError } from '@/utils/utils'

function isDataValid(data) {
  return !!data.items && !!(data.headers?.length > 0)
}

export default {
  name: 'UnitFilterableTable',
  props: {
    displayFilters: {
      type: Boolean,
      default: () => false
    },
    data: {
      default: undefined,
      validator: isDataValid
    }
  },
  data() {
    return {
      status: false,
      error: false,
      progress: false,
      csvString: '',
      message: '',
      extension: 'csv',
      search: '',
      tableHeaders: [],
      files: null
    }
  },
  computed: {
    isValid() {
      return isDataValid(this.data)
    },
    headers() {
      const rawHeaders = this.data?.headers || []
      if (typeof rawHeaders[0] === 'string') {
        // allow headers to be an array of strings
        return rawHeaders.map(h => ({ text: h, value: h }))
      }
      return rawHeaders
    },
    items() {
      return this.data?.items || []
    },
    disabled() {
      return !this.headers.length
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
    onFilterUpdate(selectedHeaders, searchValue) {
      this.tableHeaders = this.headers.map(h => ({
        ...h,
        filterable: selectedHeaders.includes(h.value)
      }))
      this.search = searchValue
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
