<template>
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
    >
      <template #prepend>
        <VListItem class="px-2">
          <VBtn icon @click="mini = !mini">
            <VIcon>$vuetify.icons.mdiFileSearch</VIcon>
          </VBtn>

          <VListItemTitle class="mx-4">File Explorer</VListItemTitle>

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
        <ul v-if="sortedGroupTexts">
          <li v-for="(text, i) in sortedGroupTexts" :key="i">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="text"></div>
          </li>
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
            @loading="onLoading"
          />
          <UnitFileExplorerViewerUnknown
            v-else
            v-bind="{ fileManager, filename }"
            @loading="onLoading"
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
    }
  },
  data() {
    return {
      selectedItem: {},
      supportedTypes: new Set(['json', 'csv', 'pdf', 'img', 'html', 'txt']),
      mini: true,
      miniWidth: 48,
      search: '',
      isFileLoading: false,
      height: 500,
      computeNPoints: false,
      nDataPoints: null,
      sortedGroupTexts: [],
      group2ext: {
        'audio file': ['mp3', 'm4a', 'wav', 'aac', 'webp'],
        'image file': ['jpg', 'jpeg', 'png', 'gif', 'bnp'],
        'video file': ['avi', 'mov', 'mp4', 'mpg'],
        document: ['pdf', 'html', 'doc', 'docx', 'rtf', 'odt'],
        spreadsheet: ['xls', 'xlsx', 'ods'],
        'archive file': ['zip', '7z', 'rar', 'gz'],
        'data file': ['json', 'csv', 'tsv', 'xml'],
        'text file': ['txt', 'md'],
        other: []
      }
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
    fileExts() {
      return this.fileManager.fileList
        .map(f => f.name.match(/^.+\.(.+?)$/)?.[1])
        .filter(m => !_.isUndefined(m))
    },
    sortedGroupCounts() {
      const groups = this.fileExts.map(ext => this.ext2group[ext])
      const occurrences = _.mapValues(
        _.groupBy(groups, _.identity),
        v => v.length
      )
      return _.sortBy(Object.entries(occurrences), ([group, count]) =>
        group === 'other' ? 1 : -count
      )
    },
    ext2group() {
      return Object.fromEntries(
        Object.entries(this.group2ext).flatMap(entry =>
          entry[1].map(ext => [ext, entry[0]])
        )
      )
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
        this.completeGroupsTable()
        this.setExtensionTexts()
        if (this.computeNPoints) {
          this.setNumberOfDataPoints()
        }
      }
    }
  },
  methods: {
    plurify,
    onLoading(loading) {
      this.isFileLoading = loading
    },
    completeGroupsTable() {
      // Add unknown extensions to the 'other' group
      for (const ext of this.fileExts) {
        if (!(ext in this.ext2group) && !this.group2ext.other.includes(ext)) {
          this.group2ext.other.push(ext)
        }
      }
    },
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
          .map(async f => [
            f,
            this.computeNPoints
              ? await this.fileManager.getNumberOfDataPoints(f)
              : 0
          ])
      )
      this.sortedGroupTexts = this.sortedGroupCounts.map(([group, c]) => {
        const re = new RegExp(`.+\\.${this.group2ext[group].join('|')}$`)
        const filterFunc = ([f, _n]) => re.test(f)
        const files = pointsPerFile.filter(filterFunc)
        const shownFiles = _.take(
          _.sortBy(files, ([_f, n]) => -n),
          showAtMost
        )
        const nPointsGroup = _.sumBy(files, ([_f, n]) => n)
        const topFilesDescription = shownFiles
          .map(
            ([f, nPoints]) =>
              `<em>${f}</em>${
                nPoints === 0
                  ? ''
                  : ` (${nPoints.toLocaleString()} ${plurify(
                      group === 'text file' ? 'line' : 'datapoint',
                      nPoints
                    )})`
              }`
          )
          .join(', ')
        return `<b>${c} ${plurify(
          group === 'other' ? 'other file' : group,
          c
        )}</b>${
          nPointsGroup > 0
            ? ` (${nPointsGroup.toLocaleString()} ${plurify(
                group === 'text file' ? 'line' : 'datapoint',
                nPointsGroup
              )})`
            : ''
        }${
          files.length > showAtMost ? ' including: ' : ':'
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
