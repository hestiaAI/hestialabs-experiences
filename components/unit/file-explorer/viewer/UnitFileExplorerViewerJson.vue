<template>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">
    <p>Could not parse file. Showing content instead</p>
    <div class="explorer__content">{{ jsonText }}</div>
  </div>
  <div v-else>
    <BaseSearchBar v-model="search" :loading="searching" />
    <VTreeview dense transition :items="filteredItems">
      <template #prepend="{ item }">
        <VIcon v-if="!isUndef(item.type)">
          {{ iconForNode(item.type) }}
        </VIcon>
      </template>
      <template #label="{ item, leaf }">
        <span>
          <span v-if="leaf" :title="item.value">
            <span v-if="!isUndef(item.name)">
              {{ `${item.name}:` }}
            </span>
            <span class="font-italic">{{ item.value }}</span>
          </span>
          <span v-else>{{ item.name }}</span>
          <VTooltip bottom open-delay="200">
            <template #activator="{ on }">
              <VIcon
                class="clickable-node"
                v-on="on"
                @click="onNodeClick(item)"
              >
                $vuetify.icons.mdiTable
              </VIcon>
            </template>
            <span>Show as table</span>
          </VTooltip>
        </span>
      </template>
    </VTreeview>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import {
  mdiCodeJson,
  mdiFormatListBulletedSquare,
  mdiInformationOutline
} from '@mdi/js'

import mixin from './mixin'
import mixinLoading from './mixin-loading'
import JsonWorker from '~/utils/json.worker.js'
import { runWorker } from '@/utils/utils'
import { filePathToGlob, createAccessor } from '@/utils/accessor'
import { pathArrayToJsonPath, nodeTypes } from '@/utils/json'

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
      filteredItems: [],
      searching: false
    }
  },
  computed: {
    delayedUpdateFilteredItems() {
      return debounce(async function () {
        this.searching = true
        await this.updateFilteredItems()
        this.searching = false
      }, this.searchCooldownTime)
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
      this.delayedUpdateFilteredItems.cancel()
      this.delayedUpdateFilteredItems()
    }
  },
  methods: {
    onNodeClick(item) {
      try {
        const filePath = filePathToGlob(this.filename)
        const jsonPath = pathArrayToJsonPath(item.path)
        const accessor = createAccessor(filePath, jsonPath)
        this.$emit('select-accessor', accessor)
      } catch (error) {
        console.error(error)
      }
    },
    iconForNode(type) {
      switch (type) {
        case nodeTypes.TREE:
          return mdiCodeJson
        case nodeTypes.LIST:
          return mdiFormatListBulletedSquare
        case nodeTypes.LEAF:
          return mdiInformationOutline
      }
    },
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
<style scoped>
.clickable-node {
  cursor: pointer;
}
</style>
