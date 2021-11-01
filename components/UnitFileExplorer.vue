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
                  <v-icon>
                    {{ filetype2icon[item.type] || filetype2icon.file }}
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
import {
  mdiCodeJson,
  mdiFile,
  mdiFileImage,
  mdiFilePdfBox,
  mdiFolder,
  mdiFolderZip,
  mdiTable,
  mdiTextBoxOutline,
  mdiXml
} from '@mdi/js'
import { unzip, setOptions } from 'unzipit'
import workerURL from 'unzipit/dist/unzipit-worker.module.js'
import { cloneDeep } from 'lodash'
import UnitJsonViewer from '~/components/UnitJsonViewer'
import UnitCsvViewer from '~/components/UnitCsvViewer'
import UnitPdfViewer from '~/components/UnitPdfViewer'
import preprocessors from '~/manifests/preprocessors'
import UnitImageViewer from '~/components/UnitImageViewer'
import UnitHtmlViewer from '~/components/UnitHtmlViewer'
import UnitTextViewer from '~/components/UnitTextViewer'

setOptions({
  workerURL,
  numWorkers: 2
})

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
      filetype2icon: {
        folder: mdiFolder,
        zip: mdiFolderZip,
        json: mdiCodeJson,
        csv: mdiTable,
        pdf: mdiFilePdfBox,
        img: mdiFileImage,
        file: mdiFile,
        txt: mdiTextBoxOutline,
        html: mdiXml
      },
      extension2filetype: {
        tar: 'zip',
        js: 'json',
        png: 'img',
        jpeg: 'img',
        jpg: 'img',
        gif: 'img',
        bmp: 'img',
        webp: 'img',
        pdf: 'pdf',
        zip: 'zip',
        json: 'json',
        txt: 'txt',
        html: 'html',
        csv: 'csv',
        tsv: 'csv'
      },
      idSpace: 0,
      fileTree: []
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
    const result = await this.fileListToTree(this.allFiles)
    this.fileTree = this.itemifyFiles(result)
  },
  methods: {
    setSelectedItem(array) {
      const item = array[0]
      const containers = new Set(['folder', 'zip'])
      if (!containers.has(item?.type)) {
        this.selectedItem = item
      }
    },
    async zipEntriesToTree(entryList) {
      const folders = entryList.filter(node => node.isDirectory)
      const folderContents = Object.fromEntries(
        folders.map(folder => [
          folder.name,
          entryList.filter(f => new RegExp(`^${folder.name}.`).test(f.name))
        ])
      )
      const innerNodes = new Set(
        Object.values(folderContents)
          .flat()
          .map(f => f.name)
      )
      const foldersResult = await Promise.all(
        Object.entries(folderContents)
          .filter(([folderName, _]) => !innerNodes.has(folderName))
          .map(async ([folderName, contents]) => [
            folderName,
            await this.zipEntriesToTree(
              contents.map(node => {
                const copy = cloneDeep(node)
                copy.name = node.name.replace(new RegExp(`${folderName}`), '')
                return copy
              })
            )
          ])
      )
      const topLevelFiles = await Promise.all(
        entryList
          .filter(file => !file.isDirectory && !innerNodes.has(file.name))
          .map(async node => new File([await node.blob()], node.name))
      )
      const filesResult = topLevelFiles
        .filter(file => !/\.zip$/.test(file.name))
        .map(file => [file.name, [file]])
      const topLevelZips = topLevelFiles.filter(file =>
        /\.zip$/.test(file.name)
      )
      const zipResult = topLevelZips.map(async node => {
        const { entries } = await unzip(node)
        const entryList = Object.values(entries)
        return [node.name, await this.zipEntriesToTree(entryList)]
      })
      return Object.fromEntries([
        ...filesResult,
        ...zipResult,
        ...foldersResult
      ])
    },
    async fileListToTree(files) {
      return Object.fromEntries(
        await Promise.all(
          files.map(async node => {
            if (/\.zip$/.test(node.name)) {
              const { entries } = await unzip(node)
              const entryList = Object.values(entries)
              console.log(entries)
              return [node.name, await this.zipEntriesToTree(entryList)]
            } else {
              return [node.name, [node]]
            }
          })
        )
      )
    },
    itemifyFiles(tree) {
      if (Array.isArray(tree)) {
        return tree
      } else {
        return Object.entries(tree).flatMap(([file, node]) => {
          if (Array.isArray(node)) {
            const extension = file.match(/\.([\S]+)/)?.[1]
            return {
              id: this.idSpace++,
              name: file,
              file: node[0],
              type: this.extension2filetype[extension] ?? 'file'
            }
          } else {
            const inner = this.itemifyFiles(node)
            const extension = file.match(/\.([\S]+)/)?.[1]
            return {
              id: this.idSpace++,
              name: file,
              children: inner,
              type: this.extension2filetype[extension] ?? 'folder'
            }
          }
        })
      }
    }
  }
}
</script>
