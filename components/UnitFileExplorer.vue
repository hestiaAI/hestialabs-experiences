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
                :items="fileTree"
                @update:active="setSelectedItem"
              >
                <template #prepend="{ item }">
                  <v-icon v-if="typeof item.type !== 'undefined'">
                    {{ filetype2icon[item.type] }}
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
                <template v-if="/js(on)?/.test(selectedItem.type)">
                  <unit-json-viewer :json="inputFiles[selectedItem.name]" />
                </template>
                <template v-else-if="/[ct]sv/.test(selectedItem.type)">
                  <unit-csv-viewer :csv="inputFiles[selectedItem.name]" />
                </template>
                <template v-else-if="/pdf/.test(selectedItem.type)">
                  <unit-pdf-viewer :pdf="selectedItem.name" />
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
import {
  mdiCodeJson,
  mdiFilePdfBox,
  mdiFolder,
  mdiFolderZip,
  mdiTable
} from '@mdi/js'
import UnitJsonViewer from '~/components/UnitJsonViewer'
import UnitCsvViewer from '~/components/UnitCsvViewer'
import UnitPdfViewer from '~/components/UnitPdfViewer'

export default {
  name: 'UnitFileExplorer',
  components: { UnitPdfViewer, UnitJsonViewer, UnitCsvViewer },
  props: {
    inputFiles: {
      type: Object,
      required: true
    },
    extractedFiles: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectedItem: null,
      openItems: [],
      filetype2icon: {
        folder: mdiFolder,
        zip: mdiFolderZip,
        json: mdiCodeJson,
        js: mdiCodeJson,
        csv: mdiTable,
        pdf: mdiFilePdfBox
      },
      idSpace: 0
    }
  },
  computed: {
    fileTree() {
      return this.itemifyFiles(this.extractedFiles)
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
    itemifyFiles(tree) {
      if (typeof tree !== 'object') {
        return {
          id: this.idSpace++,
          name: tree,
          type: tree.match(/\.([\S]+)/)[1]
        }
      } else if (typeof tree.length !== 'undefined') {
        return tree.flatMap(this.itemifyFiles)
      } else {
        return Object.entries(tree).flatMap(([key, v]) => {
          return {
            id: this.idSpace++,
            name: key,
            children: this.itemifyFiles(v),
            type: key.match(/\.([\S]+)/)[1] ?? 'folder'
          }
        })
      }
    }
  }
}
</script>
