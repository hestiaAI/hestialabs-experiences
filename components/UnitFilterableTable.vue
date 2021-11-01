<template>
  <div>
    <h2 v-if="$store.state.power" class="my-3">Query Results</h2>
    <v-alert v-if="error" type="error">{{ message }}</v-alert>
    <the-query-results-filter :headers="headers" @update="onFilterUpdate" />
    <v-data-table
      v-bind="{ headers: tableHeaders, items, search }"
      :hide-default-footer="disabled"
      multi-sort
    >
      <template #item.url="{ value }">
        <a target="_blank" rel="noreferrer noopener" :href="value"> Link </a>
      </template>
    </v-data-table>
    <base-data-download-button
      v-bind="{ progress, error, disabled, extension, data, status }"
      ref="downloadButton"
      text="Download"
      @click.native="onDownload"
    />
  </div>
</template>

<script>
import { writeToString } from '@fast-csv/format'
import { processError } from '@/utils/utils'

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
      status: false,
      error: false,
      progress: false,
      data: '',
      message: '',
      extension: 'csv',
      search: '',
      tableHeaders: this.headers
    }
  },
  computed: {
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
          this.data = await writeToString(this.items, { headers })
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
    }
  }
}
</script>
