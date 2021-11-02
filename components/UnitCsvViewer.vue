<template>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">
    <p>Could not parse file. Showing content instead</p>
    <div>{{ csvText }}</div>
  </div>
  <v-data-table v-else v-bind="{ ...csvContent }" multi-sort />
</template>

<script>
import * as csv from '@fast-csv/parse'

export default {
  name: 'UnitCsvViewer',
  props: {
    file: {
      type: File,
      required: true
    },
    preprocessorFunc: {
      type: Function,
      default: () => a => a
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
    file: {
      async handler(newFile) {
        await this.getContentFromFile(newFile)
      },
      immediate: true
    }
  },
  methods: {
    async getContentFromFile(file) {
      this.loading = true
      this.csvText = this.preprocessorFunc(await file.text())
      try {
        this.csvContent = await this.csvToItems(this.csvText)
      } catch (error) {
        this.error = true
      }
      this.loading = false
      this.error = false
    },
    async csvToItems(csvText) {
      return await new Promise(resolve => {
        const items = []
        csv
          .parseString(csvText, { headers: true })
          .on('data', row => items.push(row))
          .on('end', () =>
            resolve({
              headers: Object.keys(items[0]).map(h => ({ text: h, value: h })),
              items
            })
          )
      })
    }
  }
}
</script>
