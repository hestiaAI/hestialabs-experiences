<template>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">
    <p>Could not parse file. Showing content instead</p>
    <div>{{ csvText }}</div>
  </div>
  <unit-filterable-table v-else v-bind="{ ...csvContent }" />
</template>

<script>
import UnitFilterableTable from '~/components/UnitFilterableTable'
import getCsvHeadersAndItems from '~/utils/csv'
import FileManager from '~/utils/file-manager'

export default {
  name: 'UnitCsvViewer',
  components: { UnitFilterableTable },
  props: {
    filename: {
      type: String,
      required: true
    },
    fileManager: {
      type: FileManager,
      required: true
    }
  },
  data() {
    return {
      csvText: '',
      csvContent: {},
      loading: true,
      error: false
    }
  },
  watch: {
    filename: {
      async handler(filename) {
        await this.getContentFromFilename(filename)
      },
      immediate: true
    }
  },
  methods: {
    async getContentFromFilename(filename) {
      this.loading = true
      this.csvText = await this.fileManager.getPreprocessedText(filename)
      try {
        this.csvContent = await getCsvHeadersAndItems(this.csvText)
        this.error = false
      } catch (error) {
        this.error = true
      }
      this.loading = false
    }
  }
}
</script>
