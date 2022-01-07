<template>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">
    <p>Could not parse file. Showing content instead</p>
    <div class="explorer__content">{{ jsonText }}</div>
  </div>
  <div v-else>
    <BaseSearchBar v-model="search"></BaseSearchBar>
    <VTreeview dense transition :items="filteredItems">
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
  </div>
</template>

<script>
import { debounce } from 'debounce'

import mixin from './mixin'
import mixinLoading from './mixin-loading'
import JsonWorker from '~/utils/json.worker.js'
import { runWorker } from '@/utils/utils'

export default {
  name: 'UnitFileExplorerViewerJson',
  mixins: [mixin, mixinLoading],
  data() {
    return {
      jsonText: '',
      items: [],
      error: false,
      search: '',
      searchCooldownTime: 1000,
      filteredItems: []
    }
  },
  computed: {
    delayedUpdateFilteredItems() {
      return debounce(this.updateFilteredItems, this.searchCooldownTime)
    }
  },
  watch: {
    filename: {
      handler(filename) {
        this.getContentFromFilename(filename)
      },
      immediate: true
    },
    search() {
      // The search starts some time after the user stops typing, not after every character typed
      this.delayedUpdateFilteredItems.clear()
      this.delayedUpdateFilteredItems()
    }
  },
  methods: {
    isUndef(val) {
      return typeof val === 'undefined'
    },
    async getContentFromFilename(filename) {
      this.setLoading(true)
      this.jsonText = await this.fileManager.getPreprocessedText(filename)
      try {
        this.items = await this.fileManager.getJsonItems(filename)
        this.filteredItems = this.items
        this.error = false
      } catch (error) {
        console.error(error)
        this.error = true
      }
      this.setLoading(false)
    },
    async updateFilteredItems() {
      if (this.search) {
        this.filteredItems = await runWorker(new JsonWorker(), [
          this.jsonText,
          this.search
        ])
      } else {
        this.filteredItems = this.items
      }
    }
  }
}
</script>
