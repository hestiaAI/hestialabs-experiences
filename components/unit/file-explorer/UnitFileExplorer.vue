<template>
  <div v-if="fileManager">
    <VCard class="pa-2 mb-6 explorer" height="100%" flat>
      <VRow>
        <VExpandTransition>
          <VCol cols="12" :md="mini ? 4 : 6" :lg="mini ? 3 : 6">
            <VListItem class="px-2">
              <VIcon>$vuetify.icons.mdiFileSearch</VIcon>
              <VListItemTitle class="mx-4">
                File Explorer
              </VListItemTitle>
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
            <VListItem>
              <VTextField
                v-model="search"
                label="Search for files"
                placeholder="Enter part of a file name..."
                clearable
                hide-details
                prepend-icon="$vuetify.icons.mdiMagnify"
                class="my-4 pr-3"
                outlined
                dense
                @input="searchFile"
              />
            </VListItem>
            <VTreeview
              ref="filesTree"
              dense
              open-on-click
              activatable
              return-object
              transition
              rounded
              :open.sync="open"
              :search="search"
              :items="treeItems"
              :active.sync="active"
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
        <VCol cols="12" :md="mini ? 8 : 6" :lg="mini ? 8 : 6">
          <VCardTitle class="justify-center">
            Explore your files
          </VCardTitle>
          <VCardText>
            <template v-if="filename">
              <div class="mr-2">
                Exploring file <strong>{{ filename }}</strong>
              </div>
              <BaseButtonDownload small :href="path" :filename="filename" />
              <component
                :is="componentForType"
                v-bind="{ fileManager, filename }"
                v-if="supportedTypes.has(fileType)"
                @loading="onLoading"
                @select-accessor="onSelectAccessor"
              />
              <UnitFileExplorerViewerUnknown
                v-else
                v-bind="{ fileManager, filename }"
                @loading="onLoading"
              />
              <div v-if="customPipelineOptions">
                <UnitPipelineCustom
                  v-bind="{
                    fileManager,
                    customPipeline,
                    customPipelineOptions
                  }"
                  @update="onUnitResultsUpdate"
                />
                <UnitFilterableTable
                  v-if="tableData"
                  :data="tableData.result"
                />
              </div>
            </template>
            <template v-else>
              <p>
                Select a file on the left panel to see it in more details here
              </p>
            </template>
          </VCardText>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import { jsonToTableConverter } from '~/utils/generic-pipelines'
export default {
  name: 'UnitFileExplorer',
  data() {
    return {
      supportedTypes: new Set([
        'json',
        'csv',
        'pdf',
        'img',
        'html',
        'txt',
        'xlsx'
      ]),
      containers: new Set(['folder', 'zip']),
      mini: true,
      summaryPanelActive: [0],
      search: null,
      open: [],
      lastOpen: [],
      allOpened: false,
      isFileLoading: false,
      height: 500,
      tableData: undefined,
      customPipeline: jsonToTableConverter,
      customPipelineOptions: undefined
    }
  },
  computed: {
    ...mapState(['fileExplorerCurrentItem', 'fileManager']),
    active: {
      get() {
        return _.has(this.selectedItem, 'filename') ? [this.selectedItem] : []
      },
      set([item]) {
        // item might be undefined (when unselecting)
        if (item) {
          // close drawer when file is selected
          this.mini = true
          if (!this.containers.has(item.type)) {
            this.$store.commit('setFileExplorerCurrentItem', item)
          }
        } else {
          this.$store.commit('setFileExplorerCurrentItem', {})
        }
      }
    },
    selectedItem() {
      const item = this.fileExplorerCurrentItem
      if (_.has(item, 'filename')) {
        if (!_.has(item, 'type')) {
          return this.searchItemWithFilename(item.filename)
        } else {
          return item
        }
      } else {
        return {}
      }
    },
    fileType() {
      // @fileType should match the postfix of the Vue component name
      return this.selectedItem?.type
    },
    filename() {
      return this.selectedItem.filename
    },
    treeItems() {
      return this.fileManager.getTreeItems()
    },
    path() {
      // TODO avoid code duplication with viewer/mixin-path
      // maybe by setting path as an attribute on every viewer
      if (this.fileManager.fileDict[this.filename]) {
        return URL.createObjectURL(this.fileManager.fileDict[this.filename])
      }
      return ''
    },
    componentForType() {
      const { fileType } = this
      if (!fileType) {
        return
      }
      const postfix = fileType[0].toUpperCase() + fileType.substring(1)
      return () =>
        import(
          `~/components/unit/file-explorer/viewer/UnitFileExplorerViewer${postfix}`
        )
    },
    miniWidthPaddingLeftClass() {
      return `pl-${parseInt(this.miniWidth / 4)}`
    },
    drawerMiniFileLabelStyle() {
      const { miniWidth: w, height: h } = this
      const px = `${w}px`
      return {
        minWidth: px,
        height: px,
        bottom: `-${w - 18}px`,
        maxWidth: `${h - w - 20}px`
      }
    }
  },
  methods: {
    // Open all treeview when we are searching for something
    searchFile() {
      if (this.search) {
        if (!this.allOpened) {
          this.lastOpen = this.open
          this.allOpened = true
          this.$refs.filesTree.updateAll(true)
        }
      } else {
        this.$refs.filesTree.updateAll(false)
        this.allOpened = false
        this.open = this.lastOpen
      }
    },
    onLoading(loading) {
      this.isFileLoading = loading
    },
    onSelectAccessor(accessor) {
      // TODO make this work better
      // const options = await createTableOptions(this.fileManager, accessor)
      this.customPipelineOptions = [{ accessor }]
    },
    onUnitResultsUpdate(result) {
      this.tableData = result
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
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
