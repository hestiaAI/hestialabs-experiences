<template>
  <VContainer>
    <VRow>
      <VCol>
        <VSelect
          v-model="show"
          :items="items"
          :label="$t(k('View as'))"
          hide-details
          style="max-width: 200px"
        />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <div v-if="show === 'txt'">
          <span v-t="k('Text file content:')" class="text-bold" />
          <hr class="mb-4">
          {{ text }}
        </div>
        <UnitFileExplorerViewerCsv
          v-if="show === 'csv'"
          v-bind="{ fileManager, filename }"
        />
        <UnitFileExplorerViewerJson
          v-if="show === 'json'"
          v-bind="{ fileManager, filename }"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'UnitFileExplorerViewerTxt',
  mixins: [mixin],
  data() {
    return {
      text: '',
      show: 'txt',
      items: [
        { text: this.$t(this.k('Text')), value: 'txt' },
        { text: 'CSV', value: 'csv' },
        { text: 'JSON', value: 'json' }
      ]
    }
  },
  watch: {
    fileManager: {
      async handler() {
        await this.updateText()
      },
      immediate: true
    },
    filename: {
      async handler() {
        await this.updateText()
      },
      immediate: true
    }
  },
  methods: {
    async updateText() {
      this.text = await this.fileManager.getPreprocessedText(this.filename)
    },
    k(key) {
      return `file-explorer.viewer.txt.${key}`
    }
  }
}
</script>
