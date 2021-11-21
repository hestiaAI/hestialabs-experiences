<template>
  <VCard class="pa-2 my-6">
    <VCardTitle class="justify-center">Explore your files</VCardTitle>
    <VCardText>
      <VRow>
        <VCol cols="3">
          <VCard class="pa-2 my-6">
            <VCardTitle class="justify-center">File hierarchy</VCardTitle>
            <VCardText>
              <VTreeview
                dense
                open-on-click
                activatable
                rounded
                return-object
                transition
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
                <component
                  :is="componentForType(selectedItem.type)"
                  v-bind="{ fileManager, filename: selectedItem.filename }"
                  v-if="supportedTypes.has(selectedItem.type)"
                />
                <p v-else>Cannot open file type</p>
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
import FileManager from '~/utils/file-manager.js'

// https://github.com/nuxt/components/issues/13#issuecomment-902590143
const UnitFileExplorerViewerJson = () =>
  import('~/components/unit/file-explorer/viewer/UnitFileExplorerViewerJson')
const UnitFileExplorerViewerCsv = () =>
  import('~/components/unit/file-explorer/viewer/UnitFileExplorerViewerCsv')
const UnitFileExplorerViewerPdf = () =>
  import('~/components/unit/file-explorer/viewer/UnitFileExplorerViewerPdf')
const UnitFileExplorerViewerImage = () =>
  import('~/components/unit/file-explorer/viewer/UnitFileExplorerViewerImage')
const UnitFileExplorerViewerHtml = () =>
  import('~/components/unit/file-explorer/viewer/UnitFileExplorerViewerHtml')
const UnitFileExplorerViewerText = () =>
  import('~/components/unit/file-explorer/viewer/UnitFileExplorerViewerText')

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
      selectedItem: null,
      supportedTypes: new Set(['json', 'csv', 'pdf', 'img', 'html', 'txt'])
    }
  },
  methods: {
    setSelectedItem(array) {
      const item = array[0]
      const containers = new Set(['folder', 'zip'])
      if (!containers.has(item?.type)) {
        this.selectedItem = item
      }
    },
    componentForType(type) {
      switch (type) {
        case 'json':
          return UnitFileExplorerViewerJson
        case 'csv':
          return UnitFileExplorerViewerCsv
        case 'pdf':
          return UnitFileExplorerViewerPdf
        case 'img':
          return UnitFileExplorerViewerImage
        case 'html':
          return UnitFileExplorerViewerHtml
        default:
          return UnitFileExplorerViewerText
      }
    }
  }
}
</script>
