<template>
  <div v-if="loading">
    Loading
  </div>
  <div v-else-if="error">
    <p>Could not parse file. Showing content instead</p>
    <div class="explorer__content">
      {{ csvText }}
    </div>
  </div>
  <UnitFilterableTable v-else v-bind="{ ...csvContent }" />
</template>

<script>
import mixin from './mixin'
import mixinLoading from './mixin-loading'

export default {
  name: 'UnitFileExplorerViewerCsv',
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
