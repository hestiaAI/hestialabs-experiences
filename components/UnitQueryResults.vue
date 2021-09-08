<template>
  <div>
    <h2 class="my-3">Query Results</h2>
    <base-download-button
      v-bind="{ progress, error, disabled, extension, data, status }"
      text="Download"
      @click.native="onDownload"
    />
    <v-alert v-if="error" type="error">{{ message }}</v-alert>
    <the-query-results-data-table
      v-bind="{ headers, items }"
      :hide-default-footer="disabled"
    />
  </div>
</template>

<script>
import { writeToString } from '@fast-csv/format'
import { processError } from '@/utils/utils'

export default {
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
      extension: 'csv'
    }
  },
  computed: {
    disabled() {
      return !this.headers.length
    }
  },
  methods: {
    async onDownload() {
      this.progress = true
      this.status = false
      this.error = false
      try {
        const headers = this.headers.map(h => h.text)
        this.data = await writeToString(this.items, { headers })
      } catch (error) {
        console.error(error)
        this.error = true
        this.message = processError(error)
      } finally {
        this.progress = false
        this.status = true
      }
    }
  }
}
</script>
