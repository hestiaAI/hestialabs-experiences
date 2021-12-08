<template>
  <VCard class="pa-2 my-6 explorer" :min-height="height" height="auto">
    <VNavigationDrawer
      ref="drawer"
      :mini-variant.sync="mini"
      :mini-variant-width="miniWidth"
      absolute
      permanent
      width="80%"
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
        <VListItem v-if="selectable && !mini">
          Size of selected files: {{ selectionSizeString }}
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
          v-model="selectedFiles"
          dense
          open-on-click
          activatable
          return-object
          transition
          rounded
          :selectable="selectable"
          :search="search"
          :items="treeItems"
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
    <VCardTitle class="justify-center">Explore your files</VCardTitle>
    <div :class="miniWidthPaddingLeftClass">
      <VCardText>
        Analysed <b>{{ nFiles }}</b> {{ plurify('file', nFiles) }} (<b>{{
          dataSizeString
        }}</b
        >)
        <template v-if="nDataPoints">
          and found <b>{{ nDataPoints.toLocaleString() }}</b> datapoints
        </template>
        :
        <ul v-if="sortedExtensionTexts">
          <li
            v-for="(text, i) in sortedExtensionTexts"
            :key="i"
            v-html="text"
          />
        </ul>
      </VCardText>
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
          />
          <UnitFileExplorerViewerUnknown
            v-else
            v-bind="{ fileManager, filename }"
          />
        </template>
        <template v-else>
          <p>Select a file on the left panel to see it in more details here</p>
        </template>
      </VCardText>
    </div>
  </VCard>
</template>

<script>
import _ from 'lodash'
import FileManager from '~/utils/file-manager.js'
import { humanReadableFileSize, plurify } from '~/manifests/utils'

export default {
  name: 'UnitFileExplorer',
  props: {
    fileManager: {
      type: FileManager,
      required: true
    },
    selectable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedItem: {},
      supportedTypes: new Set(['json', 'csv', 'pdf', 'img', 'html', 'txt']),
      mini: true,
      miniWidth: 48,
      search: '',
      height: 500,
      nDataPoints: null,
      sortedExtensionTexts: [],
      selectionSize: 0
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
    treeItems() {
      return this.fileManager.getTreeItems()
    },
    selectionSizeString() {
      return humanReadableFileSize(this.selectionSize)
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
    },
    nFiles() {
      return this.fileManager.fileList.length
    },
    totalSize() {
      return _.sumBy(this.fileManager.fileList, f => f.size)
    },
    dataSizeString() {
      return humanReadableFileSize(this.totalSize)
    },
    sortedExtensionCounts() {
      const extensions = this.fileManager.fileList
        .map(f => f.name.match(/^.+\.(.+?)$/)?.[1])
        .filter(m => !_.isUndefined(m))
        .map(ext =>
          this.fileManager.supportedExtensions.has(ext) ? ext : 'other'
        )

      const occurrences = _.mapValues(
        _.groupBy(extensions, _.identity),
        v => v.length
      )
      return _.sortBy(Object.entries(occurrences), ([ext, count]) =>
        ext === 'other' ? 1 : -count
      )
    },
    key() {
      return this.$route.params.key
    },
    selectedFiles: {
      get() {
        return this.$store.state.selectedFiles[this.key]
      },
      set(value) {
        this.$store.commit('setSelectedFiles', { key: this.key, value })
        this.selectionSize = _.sumBy(
          value,
          ({ filename }) => this.fileManager.fileDict[filename]?.size ?? 0
        )
      }
    }
  },
  watch: {
    mini(mini) {
      // hide scrollbar in mini variant of drawer
      const overflowY = mini ? 'hidden' : 'visible'
      this.$refs.drawer.$el.children[1].style.overflowY = overflowY
    },
    fileManager: {
      immediate: true,
      handler() {
        this.setExtensionTexts()
        this.setNumberOfDataPoints()
      }
    }
  },
  methods: {
    plurify,
    setSelectedItem([item]) {
      // item might be undefined (when unselecting)
      if (item) {
        // close drawer when file is selected
        this.mini = true
        const containers = new Set(['folder', 'zip'])
        if (!containers.has(item?.type)) {
          this.selectedItem = item
        }
      } else {
        this.selectedItem = {}
      }
    },
    async setNumberOfDataPoints() {
      this.nDataPoints = _.sum(
        await Promise.all(
          this.fileManager
            .getFilenames()
            .map(async f => await this.fileManager.getNumberOfDataPoints(f))
        )
      )
    },
    async setExtensionTexts() {
      const showAtMost = 3
      const pointsPerFile = await Promise.all(
        this.fileManager
          .getFilenames()
          .map(async f => [f, await this.fileManager.getNumberOfDataPoints(f)])
      )
      this.sortedExtensionTexts = this.sortedExtensionCounts.map(([ext, c]) => {
        const re = new RegExp(`.+\\.${ext}`)
        const files = pointsPerFile.filter(([f, _n]) => re.test(f))
        const shownFiles = _.take(
          _.sortBy(files, ([_f, n]) => -n),
          showAtMost
        )
        const nPointsExt = _.sumBy(files, ([_f, n]) => n)
        const topFilesDescription = shownFiles
          .map(
            ([f, nPoints]) =>
              `<em>${f}</em>${
                nPoints === 0
                  ? ''
                  : ` (${nPoints.toLocaleString()} ${plurify(
                      ext === 'txt' ? 'line' : 'datapoint',
                      nPoints
                    )})`
              }`
          )
          .join(', ')
        return `<b>${c} ${plurify(
          ext === 'other' ? 'other format' : ext.toUpperCase(),
          c
        )}</b>${
          nPointsExt > 0
            ? ` (${nPointsExt.toLocaleString()} ${plurify(
                ext === 'txt' ? 'line' : 'datapoint',
                nPointsExt
              )})`
            : ':'
        }${
          files.length > showAtMost ? ' including: ' : ''
        } ${topFilesDescription}`
      })
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
