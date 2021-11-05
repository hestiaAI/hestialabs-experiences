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
                open-all
                activatable
                rounded
                return-object
                transition
                :items="fileItems"
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
                <template v-if="selectedItem.type === 'json'">
                  <unit-json-viewer
                    v-bind="{ file: selectedItem.file, preprocessorFunc }"
                  />
                </template>
                <template v-else-if="selectedItem.type === 'csv'">
                  <unit-csv-viewer
                    v-bind="{ file: selectedItem.file, preprocessorFunc }"
                  />
                </template>
                <template v-else-if="selectedItem.type === 'pdf'">
                  <unit-pdf-viewer v-bind="{ file: selectedItem.file }" />
                </template>
                <template v-else-if="selectedItem.type === 'img'">
                  <unit-image-viewer v-bind="{ file: selectedItem.file }" />
                </template>
                <template v-else-if="selectedItem.type === 'html'">
                  <unit-html-viewer v-bind="{ file: selectedItem.file }" />
                </template>
                <template v-else-if="selectedItem.type === 'txt'">
                  <unit-text-viewer v-bind="{ file: selectedItem.file }" />
                </template>
                <template v-else>
                  <p>Cannot open file type</p>
                </template>
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
import FileManager from '~/utils/file.js'
import UnitJsonViewer from '~/components/UnitJsonViewer'
import UnitCsvViewer from '~/components/UnitCsvViewer'
import UnitPdfViewer from '~/components/UnitPdfViewer'
import preprocessors from '~/manifests/preprocessors'
import UnitImageViewer from '~/components/UnitImageViewer'
import UnitHtmlViewer from '~/components/UnitHtmlViewer'
import UnitTextViewer from '~/components/UnitTextViewer'

export default {
  name: 'UnitFileExplorer',
  components: {
    UnitTextViewer,
    UnitHtmlViewer,
    UnitImageViewer,
    UnitPdfViewer,
    UnitJsonViewer,
    UnitCsvViewer
  },
  props: {
    allFiles: {
      type: Array,
      required: true
    },
    preprocessor: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      selectedItem: null,
      openItems: [],
      idSpace: 0,
      fileManager: null,
      fileItems: []
    }
  },
  computed: {
    preprocessorFunc() {
      if (!this.preprocessor) {
        // identity
        return val => val
      }
      return preprocessors[this.preprocessor]
    }
  },
  async created() {
    this.fileManager = await new FileManager(this.allFiles)
    const fileTree = this.fileManager.makeTree(this.fileManager.fileList)
    this.fileItems = this.fileManager.makeItems(fileTree)
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
