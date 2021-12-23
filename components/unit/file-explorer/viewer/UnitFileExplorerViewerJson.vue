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
import mixin from './mixin'
import mixinLoading from './mixin-loading'
import itemifyJSON from '~/utils/json'

export default {
  name: 'UnitFileExplorerViewerJson',
  mixins: [mixin, mixinLoading],
  data() {
    return {
      jsonText: '',
      items: [],
      error: false,
      search: ''
    }
  },
  computed: {
    filteredItems() {
      if (this.search) {
        return itemifyJSON(this.jsonText, this.filterCondition())
      }
      return this.items
    }
  },
  watch: {
    filename: {
      handler(filename) {
        this.getContentFromFilename(filename)
      },
      immediate: true
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
        this.error = false
      } catch (error) {
        this.error = true
      }
      this.setLoading(false)
    },
    filterCondition() {
      // Returns a function with closure
      const search = this.search
      return item => {
        const searchValue = search.toLowerCase()
        return (
          (item.name && `${item.name}`.toLowerCase().includes(searchValue)) ||
          (item.value && `${item.value}`.toLowerCase().includes(searchValue))
        )
      }
    }
  }
}
</script>
