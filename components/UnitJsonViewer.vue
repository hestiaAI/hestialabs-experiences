<template>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">
    <p>Could not parse file. Showing content instead</p>
    <div>{{ jsonText }}</div>
  </div>
  <v-treeview v-else dense open-on-click transition :items="items">
    <template #prepend="{ item }">
      <v-icon v-if="typeof item.icon !== 'undefined'">
        {{ item.icon }}
      </v-icon>
    </template>
    <template #append="{ item }">
      <div
        v-if="typeof item.value !== 'undefined'"
        :title="item.value"
        class="hestia-treeview-json-value"
      >
        {{ item.value }}
      </div>
    </template>
  </v-treeview>
</template>

<script>
import FileManager from '~/utils/file-manager'

export default {
  name: 'UnitJsonViewer',
  props: {
    filename: {
      type: String,
      required: true
    },
    fileManager: {
      type: FileManager,
      required: true
    }
  },
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
