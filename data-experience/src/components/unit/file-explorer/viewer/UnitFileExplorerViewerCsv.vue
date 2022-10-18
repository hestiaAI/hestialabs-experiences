<template>
  <div v-if="loading" v-t="'Loading'" />
  <div v-else-if="error">
    <p v-t="k('errorText')" />
  </div>
  <UnitFilterableTable v-else v-bind="{ id: filename, ...csvContent }" />
</template>

<script>
import mixin from './mixin'
import mixinLoading from './mixin-loading'
import UnitFilterableTable from '../../filterable-table/UnitFilterableTable.vue'

export default {
  name: 'UnitFileExplorerViewerCsv',
  components: { UnitFilterableTable },
  mixins: [mixin, mixinLoading],
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
    k(key) {
      return `file-explorer.viewer.csv.${key}`
    },
    async getContentFromFilename(filename) {
      this.setLoading(true)
      this.csvText = await this.fileManager.getPreprocessedText(filename)
      try {
        const { headers, items } = await this.fileManager.getCsvItems(filename)
        this.csvContent = {
          items,
          headers: headers.map(h => ({
            text: h,
            value: h
          }))
        }
        this.error = false
      } catch (error) {
        this.error = true
      }
      this.setLoading(false)
    }
  }
}
</script>
