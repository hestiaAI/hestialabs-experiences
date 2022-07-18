<template>
  <div v-if="loading">
    Loading
  </div>
  <div v-else-if="error">
    <p>Could not parse the file. Please use the "RAW" tab to visualise it.</p>
  </div>
  <div v-else>
    <BaseSearchBar v-model="search" :loading="searching" />
    <VExpandTransition>
      <div v-show="foundItems.length > 0">
        <VDataTable
          dense
          :headers="[
            {
              text: 'Found items (click to show in tree)',
              value: 'item'
            }
          ]"
          :items="foundItems"
          :items-per-page="5"
          class="elevation-1"
          @click:row="onFoundItemRowClick"
        >
          <template #item.item="{ item }">
            <div class="clickable">
              <span v-if="!isUndef(item.name)">
                {{ `${item.name}:` }}
              </span>
              <span class="font-italic">{{ item.value }}</span>
            </div>
          </template>
        </VDataTable>
      </div>
    </VExpandTransition>
    <VTreeview dense transition :items="filteredItems" :open.sync="open">
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
              <VIcon class="clickable" v-on="on" @click="copyAccessor(item)">
                $vuetify.icons.mdiContentCopy
              </VIcon>
            </template>
            <span>Copy accessor to clipboard</span>
          </VTooltip>
          <VTooltip bottom open-delay="200">
            <template #activator="{ on }">
              <VIcon class="clickable" v-on="on" @click="onNodeClick(item)">
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
import FindItemsWorker from '~/utils/find-items.worker.js'
import { runWorker } from '@/utils/utils'
import { filePathToGlob, createAccessor } from '@/utils/accessor'
import { pathArrayToJsonPath, nodeTypes } from '@/utils/json'
// import { pathArrayToJsonPath, nodeTypes, findMatchingItems } from '@/utils/json'

export default {
  name: 'UnitFileExplorerViewerJson',
  mixins: [mixin, mixinLoading],
  data() {
    return {
      jsonText: '',
      items: [],
      open: [],
      foundItems: [],
      error: false,
      search: '',
      searchCooldownTime: 200,
      filteredItems: [],
      searching: false,
      // TODO remove this when we're happy with new search
      useOldSearch: false
    }
  },
  computed: {
    delayedUpdateFilteredItems() {
      return debounce(async function() {
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
    onFoundItemRowClick(item) {
      this.open = item.trail
    },
    createItemAcessor(item) {
      const filePath = filePathToGlob(this.filename)
      const jsonPath = pathArrayToJsonPath(item.path)
      return createAccessor(filePath, jsonPath)
    },
    copyAccessor(item) {
      try {
        const accessor = JSON.stringify(this.createItemAcessor(item))
        navigator.clipboard.writeText(accessor)
      } catch (error) {
        console.error(error)
      }
    },
    onNodeClick(item) {
      try {
        this.$emit('select-accessor', this.createItemAcessor(item))
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
        if (this.useOldSearch) {
          this.filteredItems = await runWorker(new JsonWorker(), [
            this.jsonText,
            this.search
          ])
        } else {
          // this.foundItems = findMatchingItems(this.search, this.items)
          this.foundItems = await runWorker(new FindItemsWorker(), [
            this.search,
            this.items
          ])
        }
      } else {
        this.filteredItems = this.items
      }
    }
  }
}
</script>
<style scoped>
.clickable {
  cursor: pointer;
}
</style>
