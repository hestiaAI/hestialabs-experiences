<template>
  <div v-if="fileManager" :class="isLoading ? 'loading' : ''">
    <VCard class="pa-2 explorer" width="100%" flat>
      <VRow>
        <VExpandTransition>
          <VCol cols="12" :md="mini ? 4 : 6" :lg="mini ? 3 : 6" class="explorer__content">
            <VListItem class="px-2">
              <VIcon>$vuetify.icons.mdiFileSearch</VIcon>
              <span class="mx-4">{{ $t('file-explorer.title') }}</span>
              <VSpacer />
              <VBtn icon @click="mini = !mini">
                <VIcon v-if="mini">
                  $vuetify.icons.mdiChevronRight
                </VIcon>
                <VIcon v-else>
                  $vuetify.icons.mdiChevronLeft
                </VIcon>
              </VBtn>
            </VListItem>
            <VDivider />
            <VTextField
              v-model="search"
              :label="$t('file-explorer.file-search-name')"
              :placeholder="$t('file-explorer.file-search-placeholder')"
              clearable
              hide-details
              prepend-icon="$vuetify.icons.mdiMagnify"
              class="ma-2 pa-3"
              outlined
              dense
              @input="searchEntry"
            />
            <VTreeview
              ref="tree"
              dense
              open-on-click
              activatable
              return-object
              transition
              rounded
              v-model:open="open"
              :search="search"
              :items="treeItems"
              v-model:active="active"
            >
              <template #prepend="{ item }">
                <VIcon>
                  {{ item.icon }}
                </VIcon>
              </template>
            </VTreeview>
          </VCol>
        </VExpandTransition>
        <VDivider vertical />
        <VCol cols="12" :md="mini ? 8 : 6" :lg="mini ? 9 : 6" class="explorer__content">
          <UnitFileViewer
            v-bind="{ selectedItem }"
            @loading="onLoading"
          />
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>

<script>
import { has } from 'lodash-es'
import { mapState } from 'vuex'
export default {
  name: 'UnitFileExplorer',
  data() {
    return {
      containers: new Set(['folder', 'zip']),
      mini: true,
      search: null,
      open: [],
      lastOpen: [],
      allOpened: false,
      isLoading: false
    }
  },
  computed: {
    ...mapState('dataexp', ['fileExplorerCurrentItem', 'fileManager']),
    active: {
      get() {
        return has(this.selectedItem, 'filename') ? [this.selectedItem] : []
      },
      set([item]) {
        // item might be undefined (when unselecting)
        if (item) {
          if (!this.containers.has(item.type)) {
            this.$store.commit('dataexp/setFileExplorerCurrentItem', item)
          }
        } else {
          this.$store.commit('dataexp/setFileExplorerCurrentItem', {})
        }
      }
    },
    selectedItem() {
      const item = this.fileExplorerCurrentItem
      if (has(item, 'filename')) {
        if (!has(item, 'type')) {
          return this.searchItemWithFilename(item.filename)
        } else {
          return item
        }
      } else {
        return {}
      }
    },
    treeItems() {
      return this.fileManager.getTreeItems()
    }
  },
  mounted() {
    console.log('UnitFileExplorer', this.fileManager)
  },
  methods: {
    // Open all treeview when we are searching for something
    searchEntry() {
      if (this.search) {
        if (!this.allOpened) {
          this.lastOpen = this.open
          this.allOpened = true
          this.$refs.tree.updateAll(true)
        }
      } else {
        this.$refs.tree.updateAll(false)
        this.allOpened = false
        this.open = this.lastOpen
      }
    },
    onLoading(loading) {
      this.isLoading = loading
    },
    searchItemWithFilename(filename) {
      function findItem(item) {
        if (item.filename === filename) {
          return item
        } else if (Array.isArray(item)) {
          for (const elem of item) {
            const result = findItem(elem)
            if (result) {
              return result
            }
          }
        } else if (item.children) {
          return findItem(item.children)
        } else {
          return null
        }
      }
      return findItem(this.treeItems)
    }
  }
}
</script>
<style>
.explorer,
.explorer .v-icon,
.explorer .v-treeview-node__root,
.explorer .v-treeview-node__root > .v-treeview-node__content > * {
  cursor: var(--cursor-style);
}
.explorer__content {
  min-height: calc(100vh - 60px - 48px);
  /*overflow-y: scroll;
  overflow-x: hidden;*/
}
.explorer__select {
  width: 11.5rem;
}

.loading {
  --cursor-style: wait !important;
}
</style>
