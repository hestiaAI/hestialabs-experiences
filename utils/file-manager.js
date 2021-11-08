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
 * A class that allows to manage the pipeline of files.
 * It includes zip extraction, preprocessing of text, and building of trees and items for v-treeview.
 */
export default class FileManager {
  constructor(preprocessors) {
    this.preprocessors = preprocessors
  }

  async init(uppyFiles) {
    this.fileList = await FileManager.extractZips(uppyFiles)
    this.fileDict = Object.fromEntries(this.fileList.map(f => [f.name, f]))
    this.fileTexts = {}
    this.preprocessedTexts = {}
    this.fileTree = undefined
    this.treeItems = undefined
    return this
  }

  hasFile(filePath) {
    return this.fileDict.hasOwn(filePath)
  }

  async preprocessFiles() {
    await Promise.all(
      this.fileList.map(async file => {
        if (this.preprocessors.hasOwn(file.name)) {
          return [file.name, await this.getPreprocessedText(file.name)]
        }
      })
    )
  }

  async getText(filePath) {
    if (!this.hasFile(filePath)) {
      throw new Error(`${filePath} doesn't exist in the file manager`)
    }
    if (!this.fileTexts.hasOwn(filePath)) {
      this.fileTexts[filePath] = await this.fileDict[filePath].text()
    }
    return this.fileTexts[filePath]
  }

  async getPreprocessedText(filePath) {
    if (!this.preprocessedTexts.hasOwn(filePath)) {
      const text = await this.getText(filePath)
      if (this.preprocessors.hasOwn(filePath)) {
        this.preprocessedTexts[filePath] = this.preprocessors[filePath](text)
      }
    }
    return this.preprocessedTexts[filePath]
  }

  freeFileText(filePath) {
    if (this.fileTexts.hasOwn(filePath)) {
      delete this.fileTexts[filePath]
    }
  }

  getFileTree() {
    if (typeof this.fileTree === 'undefined') {
      this.fileTree = FileManager.makeTree(this.fileList)
    }
    return this.fileTree
  }

  getTreeItems() {
    if (typeof this.treeItems === 'undefined') {
      this.treeItems = FileManager.makeItems(this.getFileTree())
    }
    return this.treeItems
  }

  /**
   * From a list of File objects that can potentially be zips, builds a flat list with the contents of the zips extracted and flattened.
   * @param {File[]} files
   * @returns {Promise<File[]>}
   */
  static async extractZips(files) {
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
  static makeTree(fileList) {
    const tree = {}
    fileList.forEach(file => {
      const nodes = file.name.split('/')
      nodes.reduce((acc, node, i) => {
        if (i === nodes.length - 1) {
          return (acc[node] = file.name)
        } else {
          return acc[node] || (acc[node] = {})
        }
      }, tree)
    })
    return tree
  }

  /**
   * From a file tree whose leaves are File objects, builds an Array of items that can be given to v-treeview.
   * If the sortFiles is true, they are sorted at each level first by type (folder > zip > rest) and then alphabetically.
   * @param {Object} tree
   * @param {Boolean} sortFiles
   * @returns {Object[]}
   */
  static makeItems(tree, sortFiles = true) {
    let id = 0
    function makeItemsRec(tree) {
      const items = Object.entries(tree).flatMap(([file, node]) => {
        const res = {}
        const extension = file.match(/\.([\S]+)/)?.[1]
        let type, icon
        if (typeof node === 'string') {
          type = extension2filetype[extension] ?? 'file'
          icon = filetype2icon[type] || mdiFile
          Object.assign(res, { file: node })
        } else {
          const children = makeItemsRec(node)
          type = extension2filetype[extension] ?? 'folder'
          icon = filetype2icon[type] || mdiFolder
          Object.assign(res, { children })
        }
        Object.assign(res, { id: id++, name: file, type, icon })
        return res
      })
      if (sortFiles) {
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
    return makeItemsRec(tree)
  }
}
