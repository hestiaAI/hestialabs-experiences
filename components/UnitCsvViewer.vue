<template>
  <div v-if="loading">Loading</div>
  <unit-filterable-table v-else v-bind="{ ...csvContent }" />
</template>

<script>
import * as csv from '@fast-csv/parse'
import UnitFilterableTable from '~/components/UnitFilterableTable'

export default {
  name: 'UnitCsvViewer',
  components: { UnitFilterableTable },
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
      loading: true
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
      this.csvContent = await this.csvToItems(this.csvText)
      this.loading = false
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
