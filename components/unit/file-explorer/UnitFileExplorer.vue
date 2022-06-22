<template>
  <div v-if="fileManager !== null">
    <VCard
      v-click-outside="{
        handler: () => {
          mini = true
        },
        closeConditional: () => !mini
      }"
      class="pa-2 mb-6 explorer"
      :min-height="height"
      height="auto"
      flat
    >
      <style v-if="isFileLoading">
        :root {
        --cursor-style: wait !important;
        }
      </style>
      <VNavigationDrawer
        ref="drawer"
        :mini-variant.sync="mini"
        :mini-variant-width="miniWidth"
        absolute
        permanent
        width="100%"
        style="z-index: 1000"
      >
        <template #prepend>
          <VListItem class="px-2">
            <VBtn icon @click="mini = !mini">
              <VIcon>$vuetify.icons.mdiFileSearch</VIcon>
            </VBtn>

            <VListItemTitle class="mx-4">
              File Explorer
            </VListItemTitle>

            <VBtn icon @click.stop="mini = !mini">
              <VIcon>$vuetify.icons.mdiChevronLeft</VIcon>
            </VBtn>
          </VListItem>
          <VListItem v-if="!mini">
            <VTextField
              v-model="search"
              label="Search for files"
              placeholder="Enter part of a file name..."
              clearable
              hide-details
              prepend-icon="$vuetify.icons.mdiMagnify"
              class="my-4 pr-3"
              style="max-width: 500px"
              outlined
              dense
            />
          </VListItem>
        </template>

        <div :style="drawerMiniFileLabelStyle" class="drawer-mini-file-label">
          <div>{{ selectedItem.name }}</div>
        </div>

        <div :class="miniWidthPaddingLeftClass">
          <VTreeview
            dense
            open-on-click
            activatable
            return-object
            transition
            rounded
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
        </div>
      </VNavigationDrawer>
      <VCardTitle class="justify-center">
        Explore your files
      </VCardTitle>
      <div :class="miniWidthPaddingLeftClass">
        <VCardText>
          <template v-if="filename">
            <div class="mr-2">
              Exploring file <strong>{{ filename }}</strong>
            </div>
            <BaseButtonDownload small :href="path" :filename="filename" />
            <component
              :is="componentForType"
              v-if="supportedTypes.has(fileType)"
              :filename="filename"
              @loading="onLoading"
              @select-accessor="onSelectAccessor"
            />
            <UnitFileExplorerViewerUnknown
              v-else
              :filename="filename"
              @loading="onLoading"
            />
          </template>
          <template v-else>
            <p>
              Select a file on the left panel to see it in more details here
            </p>
          </template>
        </VCardText>
      </div>
    </VCard>
    <div v-if="customPipelineOptions">
      <UnitPipelineCustom
        v-bind="{
          customPipeline,
          customPipelineOptions,
          hash: 'file-explorer'
        }"
        @update="onUnitResultsUpdate"
      />
      <UnitFilterableTable v-if="tableData" v-bind="{ ...tableData.result }" />
    </div>
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
      miniWidth: 48,
      summaryPanelActive: [0],
      search: '',
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
  watch: {
    mini(mini) {
      // hide scrollbar in mini variant of drawer
      const overflowY = mini ? 'hidden' : 'visible'
      this.$refs.drawer.$el.children[1].style.overflowY = overflowY
    }
  },
  methods: {
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
.drawer-mini-file-label {
  transform: rotate(270deg);
  transform-origin: top left;

  display: flex;
  align-items: center;

  position: absolute;
}

.drawer-mini-file-label > div {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  color: rgba(0, 0, 0, 0.87);
}

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
