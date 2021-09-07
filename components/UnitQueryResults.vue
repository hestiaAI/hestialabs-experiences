<template>
  <div>
    <h2 class="my-3">Query Results</h2>
    <base-button
      v-bind="{ progress, error, disabled }"
      text="Download as CSV"
      @click="downloadCSVResults"
      icon="mdiDownload"
    />
    <the-query-results-data-table
      v-bind="{ headers, items }"
      :hide-default-footer="disabled"
      :loading="false"
    />
  </div>
</template>

<script>
import { writeToString } from '@fast-csv/format'
import { createObjectURL, revokeObjectURL, processError } from '@/utils/utils'

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
      rml: ''
    }
  },
  computed: {
    disabled() {
      return !this.headers.length
    }
  },
  methods: {
    async downloadCSVResults() {
      this.progress = true
      this.status = false
      this.error = false
      try {
        const headers = this.headers.map(h => h.text)
        const content = await writeToString(this.items, { headers })
        this.sendDownload(content, 'text/csv', 'csv')
        this.progress = false
        this.status = true
      } catch (error) {
        console.error(error)
        this.error = true
        this.message = processError(error)
        this.$emit('update', { error })
      }
      return false
    },
    sendDownload(content, mimeType, extension) {
      // https://stackoverflow.com/questions/53772331/vue-html-js-how-to-download-a-file-to-browser-using-the-download-tag
      const link = document.createElement('a')
      link.href = createObjectURL(content, mimeType)
      link.download = 'results.' + extension
      link.click()
      revokeObjectURL(link.href)
    }
  }
}
</script>
