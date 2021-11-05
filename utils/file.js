import { unzip, setOptions } from 'unzipit'
import workerURL from 'unzipit/dist/unzipit-worker.module.js'
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

const filetype2icon = {
  folder: mdiFolder,
  zip: mdiFolderZip,
  json: mdiCodeJson,
  csv: mdiTable,
  pdf: mdiFilePdfBox,
  img: mdiFileImage,
  file: mdiFile,
  txt: mdiTextBoxOutline,
  html: mdiXml
}
const extension2filetype = {
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
}

setOptions({
  workerURL,
  numWorkers: 2
})

export default class FileTree {
  constructor(uppyFiles, options) {
    this.sortFiles = options?.sortFiles ?? true
    return this.init(uppyFiles)
  }

  async init(uppyFiles) {
    this.nNodes = 0
    this.fileList = await this.extractZips(uppyFiles)
    this.tree = this.makeTree(this.fileList)
    return this
  }

  hasFile(filePath) {
    return this.fileList.filter(file => file.name === filePath)
  }

  /**
   * From a list of File objects that can potentially be zips, builds a flat
   * list with the contents of the zips extracted and flattened.
   * @param {File[]} files
   * @returns {Promise<File[]>}
   */
  async extractZips(files) {
    return (
      await Promise.all(
        files.map(async file => {
          if (file.name.endsWith('.zip')) {
            const { entries } = await unzip(file)
            const innerFiles = await Promise.all(
              Object.values(entries)
                .filter(node => !node.isDirectory)
                .map(
                  async innerFile =>
                    new File(
                      [await innerFile.blob()],
                      `${file.name}/${innerFile.name}`
                    )
                )
            )
            return await this.extractZips(innerFiles)
          } else {
            return file
          }
        })
      )
    ).flat()
  }

  makeTree(fileList) {
    const tree = {}
    fileList.forEach(file => {
      const nodes = file.name.split('/')
      nodes.reduce((acc, node, i) => {
        if (i === nodes.length - 1) {
          return (acc[node] = file)
        } else {
          return acc[node] || (acc[node] = {})
        }
      }, tree)
    })
    return tree
  }

  makeItems(tree) {
    if (tree instanceof File) {
      return tree
    } else {
      const items = Object.entries(tree).flatMap(([file, node]) => {
        if (node instanceof File) {
          const extension = file.match(/\.([\S]+)/)?.[1]
          const type = extension2filetype[extension] ?? 'file'
          return {
            id: this.nNodes++,
            name: file,
            file: node,
            type,
            icon: filetype2icon[type] || mdiFile
          }
        } else {
          const inner = this.makeItems(node)
          const extension = file.match(/\.([\S]+)/)?.[1]
          const type = extension2filetype[extension] ?? 'folder'
          return {
            id: this.nNodes++,
            name: file,
            children: inner,
            type,
            icon: filetype2icon[type] || mdiFolder
          }
        }
      })
      if (this.sortFiles) {
        return items.sort((a, b) => {
          for (const t of ['folder', 'zip']) {
            if (a.type === t && b.type !== t) return -1
            else if (a.type !== t && b.type === t) return 1
          }
          return a.name.localeCompare(b.name)
        })
      } else {
        return items
      }
    }
  }
}
