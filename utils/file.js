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

/**
 * A class that allows to extract the contents of zips, and allows building file trees and items for v-treeview.
 * Note that it doesn't actually load the content of the files, it just creates File objects that can than be read.
 */
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
   * From a list of File objects that can potentially be zips, builds a flat list with the contents of the zips extracted and flattened.
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

  /**
   * From a list of File objects whose names are absolute paths, build a file tree whose leaves are the File.
   * Example:
   *   makeTree([File('A/B/C.json'), File('A/D.txt')])
   * Returns:
   * {
   *   A: {
   *     B: {
   *       C.json: File('A/B/C.json')
   *     },
   *     D.txt: File('A/D.txt')
   *   }
   * }
   * @param {File[]} fileList
   * @returns {Object}
   */
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

  /**
   * From a file tree whose leaves are File objects, builds an Array of items that can be given to v-treeview.
   * If the FileTree is configured to sort files, they are sorted at each level first by type (folder > zip > rest) and then alphabetically.
   * @param {Object} tree
   * @returns {Object[]}
   */
  makeItems(tree) {
    const items = Object.entries(tree).flatMap(([file, node]) => {
      const res = {}
      const extension = file.match(/\.([\S]+)/)?.[1]
      let type, icon
      if (node instanceof File) {
        type = extension2filetype[extension] ?? 'file'
        icon = filetype2icon[type] || mdiFile
        Object.assign(res, { file: node })
      } else {
        const children = this.makeItems(node)
        type = extension2filetype[extension] ?? 'folder'
        icon = filetype2icon[type] || mdiFolder
        Object.assign(res, { children })
      }
      Object.assign(res, { id: this.nNodes++, name: file, type, icon })
      return res
    })
    if (this.sortFiles) {
      // Sorts first by type (folder > zip > rest) and then alphabetically
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
