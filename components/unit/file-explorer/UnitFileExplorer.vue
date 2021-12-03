<template>
  <VCard class="pa-2 my-6">
    <VCardTitle class="justify-center">Explore your files</VCardTitle>
    <VCardText>
      <VRow class="justify-center">
        We found {{ nFiles }} {{ nFiles === 1 ? 'file' : 'files' }} (including
        {{ fileExtensionsString }}) having a total size of {{ dataSizeString }}.
      </VRow>
      <VRow>
        <VCol cols="3">
          <VCard class="pa-2 my-6">
            <VCardTitle class="justify-center">File hierarchy</VCardTitle>
            <VCardText>
              <VTreeview
                v-model="selectedFiles"
                dense
                open-on-click
                activatable
                rounded
                return-object
                transition
                :selectable="selectable"
                :items="fileManager.getTreeItems()"
                @update:active="setSelectedItem"
              >
                <template #prepend="{ item }">
                  <VIcon>
                    {{ item.icon }}
                  </VIcon>
                </template>
              </VTreeview>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="9">
          <VCard class="pa-2 my-6">
            <VCardTitle class="justify-center">File details</VCardTitle>
            <VCardText>
              <template v-if="selectedItem">
                <p>
                  <span class="mr-2">
                    Exploring file <strong>{{ selectedItem.filename }}</strong>
                  </span>
                  <BaseButtonDownload
                    small
                    :href="path"
                    :filename="selectedItem.filename"
                  />
                </p>
                <component
                  :is="componentForType"
                  v-bind="{ fileManager, filename: selectedItem.filename }"
                  v-if="supportedTypes.has(fileType)"
                />
                <UnitFileExplorerViewerUnknown
                  v-else
                  v-bind="{ fileManager, filename: selectedItem.filename }"
                />
              </template>
              <template v-else>
                <p>Select a file to see it in more details here</p>
              </template>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
import _ from 'lodash'
import FileManager from '~/utils/file-manager.js'
import { humanReadableFileSize } from '~/manifests/utils'

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
      selectedItem: null,
      supportedTypes: new Set(['json', 'csv', 'pdf', 'img', 'html', 'txt'])
    }
  },
  computed: {
    path() {
      // TODO avoid code duplication with viewer/mixin-path
      // maybe by setting path as an attribute on every viewer
      return URL.createObjectURL(
        this.fileManager.fileDict[this.selectedItem.filename]
      )
    },
    fileType() {
      // @fileType should match the postfix of the Vue component name
      return this.selectedItem?.type
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
    key() {
      return this.$route.params.key
    },
    selectedFiles: {
      get() {
        return this.$store.state.selectedFiles[this.key]
      },
      set(value) {
        this.$store.commit('setSelectedFiles', { key: this.key, value })
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
    fileExtensionsString() {
      const extensions = this.fileManager.fileList
        .map(f => f.name.match(/^.+\.(.+?)$/)?.[1])
        .filter(m => !_.isUndefined(m))

      const occurrences = _.mapValues(
        _.groupBy(extensions, _.identity),
        v => v.length
      )
      const orderedCounts = _.sortBy(
        Object.entries(occurrences),
        ([_ext, count]) => -count
      )
      const showAtMost = 2
      const topExtensions = _.take(orderedCounts, showAtMost)
      const descriptions = topExtensions.map(
        ([ext, count]) => `${count} ${ext}${count === 1 ? '' : 's'}`
      )
      if (orderedCounts.length > showAtMost) {
        const nOthers = _.sumBy(
          _.drop(orderedCounts, showAtMost),
          ([_ext, count]) => count
        )
        return `${descriptions.join(', ')}, and ${nOthers} other${
          nOthers === 1 ? '' : 's'
        }`
      } else {
        return descriptions.join(' and ')
      }
    }
  },
  methods: {
    setSelectedItem(array) {
      const item = array[0]
      const containers = new Set(['folder', 'zip'])
      if (!containers.has(item?.type)) {
        this.selectedItem = item
      }
    }
  }
}
</script>
