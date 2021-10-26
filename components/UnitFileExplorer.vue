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
                return-object
                transition
                :items="fileTree"
                @update:active="setSelectedItem"
              >
                <template #prepend="{ item }">
                  <v-icon v-if="item.type !== undefined">
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
                  <v-treeview dense open-on-click :items="selectedItemTree">
                    <template #append="{ item }">
                      <p v-if="item.value !== undefined">{{ item.value }}</p>
                    </template>
                  </v-treeview>
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
import lodash from 'lodash'

export default {
  name: 'UnitFileExplorer',
  props: {
    inputFiles: {
      type: Object,
      required: true
    },
    extractedFiles: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedItem: null,
      filetype2icon: {
        folder: mdiFolder,
        zip: mdiFolderZip,
        json: mdiCodeJson,
        js: mdiCodeJson,
        csv: mdiTable,
        pdf: mdiFilePdfBox
      },
      idSpaceOne: 0,
      idSpaceTwo: 0
    }
  },
  computed: {
    fileTree() {
      return this.itemifyFiles(this.extractedFiles)
    },
    selectedItemTree() {
      const res = [
        this.itemify(JSON.parse(this.inputFiles[this.selectedItem.name]))
      ]
      console.log(res)
      return res
    }
  },
  methods: {
    setSelectedItem(array) {
      const item = array[0]
      console.log('selected item')
      console.log(item)
      const containers = new Set(['folder', 'zip'])
      if (!containers.has(item.type)) {
        this.selectedItem = item
      }
    },
    itemifyFiles(tree) {
      if (typeof tree !== 'object') {
        return {
          id: this.idSpaceOne++,
          name: tree,
          type: tree.match(/\.([\S]+)/)[1]
        }
      } else if (tree.length) {
        return tree.flatMap(this.itemifyFiles)
      } else {
        return Object.entries(tree).flatMap(([key, v]) => {
          return {
            id: this.idSpaceOne++,
            name: key,
            children: this.itemifyFiles(v),
            type: key.match(/\.([\S]+)/)[1] ?? 'folder'
          }
        })
      }
    },
    itemify(tree) {
      if (typeof tree !== 'object') return { value: tree }
      else if (tree.length) {
        const array = tree.flatMap(el => {
          return this.itemify(el)
        })
        return {
          id: this.idSpaceTwo++,
          name: `list with ${array.length} items`,
          children: array
        }
      } else {
        const obj = Object.entries(tree).flatMap(([key, v]) => {
          return { ...this.itemify(v), name: lodash.startCase(key) }
        })
        return {
          id: this.idSpaceTwo++,
          name: `object with ${obj.length} keys`,
          children: obj
        }
      }
    }
  }
}
</script>
