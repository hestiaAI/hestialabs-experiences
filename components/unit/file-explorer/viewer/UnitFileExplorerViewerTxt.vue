<template>
  <VContainer>
    <VRow>
      <VCol>
        <VSelect
          v-model="show"
          item-text="name"
          item-value="value"
          :items="items"
          label="View as"
          hide-details
          style="max-width: 200px"
        ></VSelect>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <div v-if="show === 'txt'">
          <b>Text file content:</b>
          <hr class="mb-4" />
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
        { name: 'Text', value: 'txt' },
        { name: 'CSV', value: 'csv' },
        { name: 'JSON', value: 'json' }
      ]
    }
  },
  watch: {
    fileManager: {
      async handler(_) {
        this.text = await this.fileManager.getPreprocessedText(this.filename)
      },
      immediate: true
    },
    filename: {
      async handler(_) {
        this.text = await this.fileManager.getPreprocessedText(this.filename)
      },
      immediate: true
    }
  }
}
</script>
