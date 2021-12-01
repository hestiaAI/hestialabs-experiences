<template>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">
    <p>Could not parse file. Showing content instead</p>
    <div>{{ jsonText }}</div>
  </div>
  <VTreeview v-else dense transition :items="items">
    <template #prepend="{ item }">
      <VIcon v-if="!isUndef(item.icon)">
        {{ item.icon }}
      </VIcon>
    </template>
    <template #label="{ item, leaf }">
      <div v-if="leaf" :title="item.value">
        <span v-if="!isUndef(item.name)">
          {{ `${item.name}:` }}
        </span>
        <span class="font-italic">{{ item.value }}</span>
      </div>
      <div v-else>{{ item.name }}</div>
    </template>
  </VTreeview>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'UnitFileExplorerViewerJson',
  mixins: [mixin],
  data() {
    return {
      jsonText: '',
      items: [],
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
    isUndef(val) {
      return typeof val === 'undefined'
    },
    async getContentFromFilename(filename) {
      this.loading = true
      this.jsonText = await this.fileManager.getPreprocessedText(filename)
      try {
        this.items = await this.fileManager.getJsonItems(filename)
        this.error = false
      } catch (error) {
        this.error = true
      }
      this.loading = false
    }
  }
}
</script>
