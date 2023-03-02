<template>
  <div
    v-if="loading"
    v-t="'Loading'"
  />
  <div v-else-if="error">
    <p v-t="k('errorText')" />
  </div>
  <div v-else>
    <BaseButton
      v-for="(_, name, i) in sheets"
      :key="i"
      :text="name"
      @click="v => setSheet(name)"
    />
    <UnitFilterableTable v-bind="{ headers, items }" />
  </div>
</template>

<script>
import readXlsxFile from 'read-excel-file'
import mixin from './mixin'
import mixinLoading from './mixin-loading'
import BaseButton from '@/components/base/button/BaseButton.vue'
import UnitFilterableTable from '../../filterable-table/UnitFilterableTable.vue'

export default {
  name: 'UnitFileExplorerViewerXlsx',
  components: { BaseButton, UnitFilterableTable },
  mixins: [mixin, mixinLoading],
  data() {
    return {
      loading: true,
      error: false,
      file: null,
      sheets: {},
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
    k(key) {
      return `file-explorer.viewer.xlsx.${key}`
    },
    async getContentFromFilename(filename) {
      this.setLoading(true)
      this.file = this.fileManager.fileDict[filename]
      try {
        // Get the names of the sheets
        const sheets = (await readXlsxFile(this.file, { getSheets: true })).map(s => s.name)
        // Read the content of all sheets
        const sheetsContent = await Promise.all(sheets.map(s => readXlsxFile(this.file, { sheet: s })))
        this.sheets = Object.fromEntries(sheetsContent.map((rows, i) => {
          const headers = Array.from({ length: Math.max(...rows.map(r => r.length)) }, (_, j) => 'Column ' + (j + 1))
          const items = rows.map((row) => {
            return Object.fromEntries(headers.map((h, j) => [h, row[j]]))
          })
          return [sheets[i], { headers, items }]
        }))
        // Set the first sheet as visible
        this.setSheet(sheets[0])
        this.error = false
      } catch (error) {
        this.error = true
      }
      this.setLoading(false)
    },
    setSheet(name) {
      this.headers = this.sheets[name].headers
      this.items = this.sheets[name].items
    }
  }
}
</script>
