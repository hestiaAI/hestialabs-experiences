<template>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">
    <p>Could not parse file.</p>
  </div>
  <UnitFilterableTable v-else :data="{ headers, items }" display-filters />
</template>

<script>
import readXlsxFile from 'read-excel-file'
import mixin from './mixin'
import mixinLoading from './mixin-loading'

export default {
  name: 'UnitFileExplorerViewerXlsx',
  mixins: [mixin, mixinLoading],
  data() {
    return {
      loading: true,
      error: false,
      file: null,
      rows: [],
      headers: [],
      items: []
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
      this.file = this.fileManager.fileDict[filename]
      try {
        // TODO implement
        this.rows = await readXlsxFile(this.file)
        this.headers = Array.from(
          { length: Math.max(...this.rows.map(r => r.length)) },
          (_, i) => 'Column ' + (i + 1)
        )
        this.items = this.rows.map(row => {
          return Object.fromEntries(this.headers.map((h, i) => [h, row[i]]))
        })
        this.error = false
      } catch (error) {
        this.error = true
      }
      this.setLoading(false)
    }
  }
}
</script>
