<template>
  <div>
    <div v-if="isValid">
      <h2 v-if="$store.state.power" class="my-3">Query Results</h2>
      <v-alert v-if="error" type="error">{{ message }}</v-alert>
      <the-table-filter
        :display-filters="displayFilters"
        :headers="headers"
        @update="onFilterUpdate"
      />
      <v-data-table
        v-bind="{ headers: tableHeaders, items, search }"
        :hide-default-footer="disabled"
        multi-sort
        @current-items="onItemsUpdate"
      >
        <template #item.url="{ value }">
          <a target="_blank" rel="noreferrer noopener" :href="value"> Link </a>
        </template>
      </v-data-table>
      <base-data-download-button
        v-bind="{ progress, error, disabled, extension, data: csvData, status }"
        ref="downloadButton"
        text="Download"
        @click.native="onDownload"
      />
    </div>
    <i v-else>data in this format cannot be displayed in a table</i>
  </div>
</template>

<script>
import { writeToString } from '@fast-csv/format'
import { processError } from '@/utils/utils'
import BaseDataDownloadButton from '~/components/BaseDataDownloadButton'
import TheTableFilter from '~/components/TheTableFilter'

function isDataValid(data) {
  return !!data.items && !!(data.headers?.length > 0)
}

export default {
  name: 'UnitFilterableTable',
  components: { BaseDataDownloadButton, TheTableFilter },
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
      csvData: '',
      message: '',
      extension: 'csv',
      search: '',
      tableHeaders: this.headers
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
  methods: {
    async onDownload(event) {
      // only if the event is trusted (i.e. triggered by user interaction)
      if (event.isTrusted) {
        // prevent default anchor behavior,
        // i.e. prevent triggering the download
        // since we want to generate the file contents first
        event.preventDefault()
        this.progress = true
        this.status = false
        this.error = false
        try {
          const headers = this.headers.map(h => h.text)
          // update the data
          this.csvData = await writeToString(this.items, { headers })
          // wait until DOM is updated, i.e. the href attribute (see BaseDownloadButton.vue)
          await this.$nextTick()
          // click the anchor manually -> event.isTrusted === false
          this.$refs.downloadButton.$el.click()
        } catch (error) {
          console.error(error)
          this.error = true
          this.message = processError(error)
        } finally {
          this.progress = false
          this.status = true
        }
      }
    },
    onFilterUpdate(selectedHeaders, searchValue) {
      this.tableHeaders = this.headers.map(h => ({
        ...h,
        filterable: selectedHeaders.includes(h.value)
      }))
      this.search = searchValue
    },
    onItemsUpdate(currentItems) {
      this.$emit('current-items', currentItems)
    }
  }
}
</script>
