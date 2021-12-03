<template>
  <VCard class="pa-2 my-6 explorer" :min-height="height" height="auto">
    <VNavigationDrawer
      ref="drawer"
      :mini-variant.sync="mini"
      :mini-variant-width="miniWidth"
      absolute
      permanent
      width="100%"
    >
      <template #prepend>
        <VListItem class="px-2">
          <VBtn icon @click.stop="mini = !mini">
            <VIcon>$vuetify.icons.mdiFileSearch</VIcon>
          </VBtn>

          <VListItemTitle class="mx-4">File Explorer</VListItemTitle>

          <VBtn icon @click.stop="mini = !mini">
            <VIcon>$vuetify.icons.mdiChevronLeft</VIcon>
          </VBtn>
        </VListItem>
      </template>

      <div :style="drawerMiniFileLabelStyle" class="drawer-mini-file-label">
        <div>{{ selectedItem.name }}</div>
      </div>

      <div :class="miniWidthPaddingLeftClass">
        <VTextField
          v-model="search"
          label="Search files"
          placeholder="Type..."
          clearable
          hide-details
          prepend-icon="$vuetify.icons.mdiMagnify"
          class="my-4 pr-3"
          style="max-width: 500px"
          outlined
          dense
        />
        <VTreeview
          dense
          open-on-click
          activatable
          return-object
          transition
          rounded
          :search="search"
          :items="fileManager.getTreeItems()"
          @update:active="setSelectedItem"
        >
          <template #prepend="{ item }">
            <VIcon>
              {{ item.icon }}
            </VIcon>
          </template>
        </VTreeview>
      </div>
    </VNavigationDrawer>
    <VCardTitle class="justify-center"> Explore your files </VCardTitle>
    <VCardText class="align-center">
      <div :class="miniWidthPaddingLeftClass">
        <template v-if="filename">
          <div class="mr-2">
            Exploring file <strong>{{ filename }}</strong>
          </div>
          <BaseButtonDownload small :href="path" :filename="filename" />
          <component
            :is="componentForType"
            v-bind="{ fileManager, filename }"
            v-if="supportedTypes.has(fileType)"
          />
          <UnitFileExplorerViewerUnknown
            v-else
            v-bind="{ fileManager, filename }"
          />
        </template>
        <template v-else>
          <p>Select a file on the left panel to see it in more details here</p>
        </template>
      </div>
    </VCardText>
  </VCard>
</template>

<script>
import FileManager from '~/utils/file-manager.js'

export default {
  name: 'UnitFileExplorer',
  props: {
    fileManager: {
      type: FileManager,
      required: true
    }
  },
  data() {
    return {
      selectedItem: {},
      supportedTypes: new Set(['json', 'csv', 'pdf', 'img', 'html', 'txt']),
      mini: true,
      miniWidth: 48,
      search: '',
      height: 500
    }
  },
  computed: {
    fileType() {
      // @fileType should match the postfix of the Vue component name
      return this.selectedItem?.type
    },
    filename() {
      return this.selectedItem?.filename || ''
    },
    path() {
      // TODO avoid code duplication with viewer/mixin-path
      // maybe by setting path as an attribute on every viewer
      return URL.createObjectURL(this.fileManager.fileDict[this.filename])
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
    setSelectedItem([item]) {
      // item might be undefined (when unselecting)
      if (item) {
        // close drawer when file is selected
        this.mini = true
        const containers = new Set(['folder', 'zip'])
        if (!containers.has(item?.type)) {
          this.selectedItem = item
        }
      }
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

.explorer__content {
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
