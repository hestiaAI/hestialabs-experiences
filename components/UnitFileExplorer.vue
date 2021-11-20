<template>
  <v-card class="pa-2 my-6">
    <v-card-title class="justify-center">Explore your files</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="3">
          <v-card class="pa-2 my-6">
            <v-card-title class="justify-center">File hierarchy</v-card-title>
            <v-card-text>
              <v-treeview
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
                  <v-icon>
                    {{ item.icon }}
                  </v-icon>
                </template>
              </v-treeview>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="9">
          <v-card class="pa-2 my-6">
            <v-card-title class="justify-center">File details</v-card-title>
            <v-card-text>
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
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import FileManager from '~/utils/file-manager.js'

// https://github.com/nuxt/components/issues/13#issuecomment-902590143
const UnitFileExplorerViewerJson = () =>
  import('~/components/UnitFileExplorerViewerJson')
const UnitFileExplorerViewerCsv = () =>
  import('~/components/UnitFileExplorerViewerCsv')
const UnitFileExplorerViewerPdf = () =>
  import('~/components/UnitFileExplorerViewerPdf')
const UnitFileExplorerViewerImage = () =>
  import('~/components/UnitFileExplorerViewerImage')
const UnitFileExplorerViewerHtml = () =>
  import('~/components/UnitFileExplorerViewerHtml')
const UnitFileExplorerViewerText = () =>
  import('~/components/UnitFileExplorerViewerText')

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
