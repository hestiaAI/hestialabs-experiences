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
    <template #append="{ item }">
      <div
        v-if="!isUndef(item.value)"
        :title="item.value"
        class="hestia-treeview-json-value"
      >
        {{ item.value }}
      </div>
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

<style>
.v-treeview-node__append {
  max-width: calc(50%);
}
.hestia-treeview-json-value {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
