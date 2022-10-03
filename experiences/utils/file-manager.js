import JSZip from 'jszip'
import {
  mdiCodeJson,
  mdiFile,
  mdiFileImage,
  mdiFilePdfBox,
  mdiFolder,
  mdiFolderZip,
  mdiTable,
  mdiTextBoxOutline,
  mdiXml,
  mdiMicrosoftExcel
} from '@mdi/js'
import { has, groupBy, identity } from 'lodash-es'
import { matchNormalized, findMatchesInContent } from './accessor'
import { itemifyJSON, nJsonPoints } from './json'
import { getCsvHeadersAndItems } from './csv'
import { runWorker } from './utils'
import { hashFile, hashString } from './encryption'

export const filetype2icon = {
  folder: mdiFolder,
  zip: mdiFolderZip,
  json: mdiCodeJson,
  csv: mdiTable,
  pdf: mdiFilePdfBox,
  img: mdiFileImage,
  file: mdiFile,
  txt: mdiTextBoxOutline,
  html: mdiXml,
  xlsx: mdiMicrosoftExcel
}
export const extension2filetype = {
  tar: 'zip',
  js: 'json',
  ndjson: 'json',
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
  tsv: 'csv',
  xlsx: 'xlsx'
}

/**
 * A class that allows to manage the pipeline of files.
 * It includes:
 * - zip extraction
 * - preprocessing of text
 * - csv items extraction
 * - building of trees and items for v-treeview
 */
export default class FileManager {
  // Private attributes that should only be accessed through the methods of FileManager
  #fileTexts
  #preprocessedTexts
  #csvItems
  #jsonItems
  #nDataPoints
  #fileTree
  #treeItems
  #shortFilenameDict

  setInitialValues() {
    this.#fileTexts = {}
    this.#preprocessedTexts = {}
    this.#csvItems = {}
    this.#jsonItems = {}
    this.#nDataPoints = {}
    this.#fileTree = undefined
    this.#treeItems = undefined
    this.#shortFilenameDict = {}
  }

  /**
   * Builds a FileManager object without any files, just setting the configuration.
   * @param {Object | null | undefined} preprocessors maps file name to preprocessor function
   * @param {Object | null | undefined} workers the workers that this file manager should use
   * @param {Object | null | undefined} idToGlob an object mapping IDs to globs
   * @param {Boolean | null | undefined} keepOnlyFiles filter the uploaded files to keep only the one present in idToGlob
   */
  constructor(preprocessors, workers, idToGlob, keepOnlyFiles) {
    this.supportedExtensions = new Set([
      ...Object.keys(extension2filetype),
      ...Object.values(extension2filetype)
    ])
    this.fileDict = {}
    this.preprocessors = preprocessors ?? {}
    this.workers = workers ?? {}
    this.idToGlob = idToGlob ?? {}
    this.keepOnlyFiles = keepOnlyFiles ?? true

    // Define the files filter regex, default to all
    this.filesRegex = /.*/
    if (this.keepOnlyFiles && Object.keys(this.idToGlob).length) {
      import('micromatch').then((mm) => {
        const regexs = Object.values(this.idToGlob).map(
          glob => mm.makeRe(glob).source
        )
        this.filesRegex = new RegExp(`(${regexs.join(')|(')})`)
      })
    }
    this.setInitialValues()
  }

  /**
   * Fills the FileManager with the given files and creates helper structures.
   * To be called once the files are available.
   * @param {(NodeFile | BrowserFile)[]} uppyFiles
   * @returns {Promise<FileManager>}
   */
  async init(uppyFiles) {
    this.fileList = await FileManager.extractZips(uppyFiles, this.filesRegex)
    this.fileList = FileManager.filterFiles(this.fileList)
    this.fileList = FileManager.removeZipName(this.fileList)
    this.fileDict = Object.fromEntries(
      this.fileList.map(file => [file.name, file])
    )
    this.idToGlob = await this.fetchDynamicFiles()
    this.setInitialValues()
    this.setShortFilenames()
    return this
  }

  /**
   * Fetch files Ids and globs from a file, given a preprocessor on that same file.
   * Example: directories names change with languages in google takeout archive but
   * can be retrieve from another file.
   * @returns an object mapping IDs to globs
   */
  async fetchDynamicFiles() {
    const { $DYNAMIC_FILES, ...files } = this.idToGlob
    if ($DYNAMIC_FILES) {
      const matchedFiles = this.getFilePathsFromId('$DYNAMIC_FILES')
      const idToGlob = JSON.parse(
        await this.getPreprocessedText(matchedFiles[0])
      )
      return { ...files, ...idToGlob }
    }
    return this.idToGlob
  }

  /**
   * Remove all files that should be ignored, such as MacOS-specific files.
   * @param {File[]} fileList
   * @returns filtered file list
   */
  static filterFiles(fileList) {
    const filterOut = /__MACOSX|\.DS_STORE/i
    return fileList.filter(f => !filterOut.test(f.name))
  }

  /**
   * If the root consists of a single zip, remove the zip name from all files.
   * E.g. 'my-zip.zip/folder/file.txt' becomes 'folder/file.txt'
   * But ['zip1.zip/foo.txt', 'zip2.zip/bar.txt'] stay the same.
   * @param {[String, File][]} filePairs
   * @returns {{[p: String]: File}}
   */
  static removeZipName(fileList) {
    const rootSet = new Set(fileList.map(f => f.name.split('/')[0]))
    const roots = [...rootSet]
    if (roots.length === 1 && roots[0].endsWith('.zip')) {
      return fileList.map((file) => {
        const parts = file.name.split('/')
        const name = parts.slice(1, parts.length).join('/')
        return file.copy(name)
      })
    }
    return fileList
  }

  /**
   * Returns an array with all the file names in the File Manager.
   * @returns {String[]}
   */
  getFilenames() {
    return Object.keys(this.fileDict)
  }

  /**
   * Given a list of file names, fills the FileManager entries for preprocessed text and returns an
   * object mapping file name to preprocessed text (similarly to the inputFiles object that existed before).
   * @param {String[]} filenames
   * @returns {Promise<{[p: String]: String}>}
   */
  async preprocessFiles(filenames) {
    const entries = await Promise.all(
      filenames.map(async filename => [
        filename,
        await this.getPreprocessedText(filename)
      ])
    )
    return Object.fromEntries(entries)
  }

  /**
   * Returns the preprocessor function to be used for the given file name, defaulting to the identity.
   * @param {String} filePath
   * @returns {*|(function(*): *)}
   */
  getPreprocessors(filePath) {
    if (!this.preprocessors) {
      return []
    }
    return Object.entries(this.preprocessors)
      .map(([glob, f]) => [f, matchNormalized(filePath, glob)])
      .filter(([f, matched]) => matched)
      .map(([f, _]) => f)
  }

  hasFile(filePath) {
    return has(this.fileDict, filePath)
  }

  /**
   * Return a MD5 hash
   */
  async hashAllFiles() {
    const hashPromises = Object.values(this.fileDict).map(f => f.hash())
    const fileHashes = await Promise.all(hashPromises)
    return hashString(fileHashes.join(''))
  }

  /**
   * Loads and returns the content of a text file if it has not already been loaded.
   * @param {String} filePath
   * @returns {Promise<String>}
   * @throws an error if the file does not exist
   */
  async getText(filePath) {
    if (!this.hasFile(filePath)) {
      throw new Error(`The file ${filePath} was not provided.`)
    }
    if (!has(this.#fileTexts, filePath)) {
      this.#fileTexts[filePath] = await this.fileDict[filePath].text()
    }
    return this.#fileTexts[filePath]
  }

  /**
   * Preprocessed and returns the content of a text file if it has not already been preprocessed.
   * @param {String} filePath
   * @returns {Promise<String>}
   */
  async getPreprocessedText(filePath) {
    if (!has(this.#preprocessedTexts, filePath)) {
      let text = await this.getText(filePath)
      if (text === '') {
        this.#preprocessedTexts[filePath] = text
      } else {
        for (const preprocessor of this.getPreprocessors(filePath)) {
          text = preprocessor(text)
        }
        this.#preprocessedTexts[filePath] = text
      }
    }
    return this.#preprocessedTexts[filePath]
  }

  /**
   * Parses and returns the content of a csv file if it has not already been parsed.
   * @param {String} filePath
   * @returns {Promise<String>}
   */
  async getCsvItems(filePath) {
    if (!has(this.#csvItems, filePath)) {
      const text = await this.getPreprocessedText(filePath)
      const CsvWorker = this.workers?.CsvWorker
      let items
      if (CsvWorker) {
        items = await runWorker(new CsvWorker(), text)
      } else {
        items = await getCsvHeadersAndItems(text)
      }
      this.#csvItems[filePath] = items
    }
    return this.#csvItems[filePath]
  }

  /**
   * Creates and returns an item tree of a JSON file if it has not already been created.
   * @param {String} filePath
   * @returns {Promise<String>}
   */
  async getJsonItems(filePath) {
    if (!has(this.#jsonItems, filePath)) {
      const text = await this.getPreprocessedText(filePath)
      const JsonWorker = this.workers?.JsonWorker
      let items
      if (JsonWorker) {
        items = await runWorker(new JsonWorker(), [text])
      } else {
        items = itemifyJSON(text)
      }
      this.#jsonItems[filePath] = items
    }
    return this.#jsonItems[filePath]
  }

  /**
   * Return the file paths that match the glob
   * @param {String} filePathGlob (in the same format as accessor.filePath)
   */
  findMatchingFilePaths(filePathGlob) {
    if (!filePathGlob) { return ['Dynamic files'] }
    return this.getFilenames().filter(filePath =>
      matchNormalized(filePath, filePathGlob)
    )
  }

  /**
   * Return the file path(s) that match the ID.
   * @param {String} id
   * @returns an array
   */
  getFilePathsFromId(id) {
    if (!(id in this.idToGlob)) {
      throw new Error(`ID ${id} is not defined`)
    }
    const glob = this.idToGlob[id]
    return this.findMatchingFilePaths(glob)
  }

  /**
   * Return the preprocessed text of the file(s) that match the ID.
   * @param {String} id
   * @returns an array
   */
  async getPreprocessedTextFromId(id) {
    const paths = this.getFilePathsFromId(id)
    return await Promise.all(paths.map(p => this.getPreprocessedText(p)))
  }

  /**
   * Return the CSV items of the file(s) that match the ID.
   * @param {String} id
   * @returns {Promise<PipelineOutput[]>} an array
   */
  async getCsvItemsFromId(id) {
    const paths = this.getFilePathsFromId(id)
    return await Promise.all(paths.map(p => this.getCsvItems(p)))
  }

  /**
   * Return all matching objects from json files.
   * @param {Object} accessor
   * @param {Object} options
   *
   * Options can have the following attributes:
   * - freeFiles: true means files are freed after reading
   */
  async findMatchingObjects(accessor, options = {}) {
    const objectPromises = this.findMatchingFilePaths(
      accessor.filePath
    ).flatMap(async(fileName) => {
      try {
        const text = await this.getPreprocessedText(fileName)
        const content = JSON.parse(text)
        if (options?.freeFiles) {
          this.freeFile(fileName)
        }
        const found = findMatchesInContent(content, accessor)
        return found
      } catch (error) {
        console.error('error during matching', error)
      }
    })
    const objects = await Promise.all(objectPromises)
    return objects.filter(m => m).flat()
  }

  /**
   * Read a JSON files and build a list of rows from a list of JSONPaths
   * @param {*} filename the JSON file to read
   * @param {*} jsonPaths the paths to retreive
   * @returns A list of object with one key per JSONPath
   */
  async findAllMatchingObjects(filename, jsonPaths) {
    const { JSONPath } = require('jsonpath-plus')

    // Get all arays idx from a processed jsonPath
    const getIdxs = (path, maxLength = -1) => [...path.matchAll(/\[(:?\d+)\]/g)].map(m => m[1]).slice(0, maxLength).join('')

    // Get the number of nested arrays in a jsonPath
    const getNbArrays = path => [...path.matchAll(/\[(:?\*)\]/g)].length

    // Compute a foreign key that uniquely identify values from the same tree path
    const computeForeignKey = (pathValue, pathPrimary, pathSecondary) => {
      const minLength = Math.min(getNbArrays(pathPrimary), getNbArrays(pathSecondary))
      return getIdxs(pathValue, minLength)
    }

    // Check that two paths are joinable by making sure they dot not comport diverging nested arrays
    function validPaths(path1, path2) {
      const smallerArray = getNbArrays(path1) < getNbArrays(path2) ? path1 : path2
      const equalIdx = smallerArray.lastIndexOf('[*]') || 0
      return path1.slice(0, equalIdx) === path2.slice(0, equalIdx)
    }

    // Left join the result of one JSON query with another one if the path of the latter is a subPath on the primary
    function leftJoinPaths(primary, secondary) {
      if (!validPaths(primary.path, secondary.path)) {
        console.error('Cannot join those paths, they are not overlapping')
      }
      const secondaryFKs = {}
      secondary.values.forEach((item) => {
        const foreignKey = computeForeignKey(item.path, primary.path, secondary.path)
        secondaryFKs[foreignKey] = item
      })

      return {
        path: primary.path,
        values: primary.values.map((primaryItem) => {
          if (Array.isArray(primaryItem)) {
            const foreignKey = computeForeignKey(primaryItem[0].path, primary.path, secondary.path)
            const secondaryItem = secondaryFKs[foreignKey]
            primaryItem.push(secondaryItem)
            return primaryItem
          } else {
            const foreignKey = computeForeignKey(primaryItem.path, primary.path, secondary.path)
            const secondaryItem = secondaryFKs[foreignKey]
            return [primaryItem, secondaryItem]
          }
        })
      }
    }
    if (!jsonPaths || !jsonPaths.length) { return [] }
    try {
      const text = await this.getPreprocessedText(filename)
      const json = JSON.parse(text)
      const result = jsonPaths.map((path) => {
        return {
          path,
          values: JSONPath({ path, json, resultType: 'all' })
        }
      }).sort((a, b) => getNbArrays(b.path) - getNbArrays(a.path) || b.values.length - a.values.length)

      let items = result[0]
      for (let i = 1; i < result.length; i++) {
        if (items.values.length > result[i].values.length) {
          items = leftJoinPaths(items, result[i])
        } else {
          items = leftJoinPaths(result[i], items)
        }
      }
      // For each path/column compute the left join with the column that have the most values
      return items.values.map((l) => {
        const item = {}
        const columns = Array.isArray(l) ? l : [l]
        columns.forEach((jsonPathValue) => {
          if (jsonPathValue) { item[jsonPathValue.parentProperty] = jsonPathValue.value }
        })
        return item
      })
    } catch (error) {
      console.error('Error during matching', error)
      return []
    }
  }

  /**
   * Computes and returns the number of "data points" in a file if not already computed.
   * @param {String} filePath
   * @returns {Promise<String>}
   */
  async getNumberOfDataPoints(filePath) {
    if (!has(this.#nDataPoints, filePath)) {
      const ext = filePath.match(/^.+\.(.+?)$/)?.[1] ?? 'other'
      if (ext === 'json') {
        const json = await this.getJsonItems(filePath)
        this.#nDataPoints[filePath] = nJsonPoints(json)
      } else if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
        const text = await this.getPreprocessedText(filePath)
        this.#nDataPoints[filePath] = text.split('\n').filter(identity).length
      } else {
        this.#nDataPoints[filePath] = 0
      }
    }
    return this.#nDataPoints[filePath]
  }

  /**
   * Frees memory by erasing all loaded content associated to the given file path.
   * @param {String} filePath
   */
  freeFile(filePath) {
    if (has(this.#fileTexts, filePath)) {
      delete this.#fileTexts[filePath]
    }
    if (has(this.#preprocessedTexts, filePath)) {
      delete this.#preprocessedTexts[filePath]
    }
    if (has(this.#csvItems, filePath)) {
      delete this.#csvItems[filePath]
    }
    if (has(this.#jsonItems, filePath)) {
      delete this.#jsonItems[filePath]
    }
  }

  /**
   * Creates a hierarchical object representing the tree of files in the File Manager, only if it has not already been created.
   * @returns {Object}
   */
  getFileTree() {
    if (typeof this.#fileTree === 'undefined') {
      this.#fileTree = FileManager.makeTree(this.fileDict)
    }
    return this.#fileTree
  }

  /**
   * Creates an array of items to be given to a v-treeview component, only if not already created.
   * @returns {*}
   */
  getTreeItems() {
    if (typeof this.#treeItems === 'undefined') {
      this.#treeItems = FileManager.makeItems(this.getFileTree())
    }
    return this.#treeItems
  }

  /**
   * Transforms the filenames to a shorter version without the path, or with minimal path in case of non-uniqueness.
   */
  setShortFilenames() {
    const files = Object.keys(this.fileDict).map((f) => {
      const parts = f.split('/')
      return {
        filename: f,
        parts,
        n: 1,
        short: parts[parts.length - 1]
      }
    })
    while (true) {
      // Group by short name
      const groups = groupBy(files, f => f.short)
      if (Object.keys(groups).length === files.length) {
        // All the names are unique, we can stop
        this.#shortFilenameDict = Object.fromEntries(
          files.map(f => [f.filename, f.short])
        )
        return
      }
      for (const group of Object.values(groups)) {
        if (group.length > 1) {
          // Extend the short name of each non-unique names by one parent
          for (const file of group) {
            if (file.n !== file.parts.length) {
              file.n += 1
              file.short =
                file.parts[file.parts.length - file.n] + '/' + file.short
            }
          }
        }
      }
    }
  }

  /**
   * Get the short filename associated to a given filename
   * @param {*} filename
   * @returns the short filename
   */
  getShortFilename(filename) {
    return this.#shortFilenameDict[filename]
  }

  /**
   * From a list of File objects that can potentially be zips, builds a flat list with the contents of the zips extracted and flattened.
   * @param {File[]} files
   * @returns {Promise<File[]>}
   */
  static async extractZips(files, filesRegex) {
    return (
      await Promise.all(
        files.flatMap(async(file) => {
          if (file.name.endsWith('.zip')) {
            const zip = new JSZip()
            await zip.loadAsync(file.blob)
            const folderContent = zip.file(filesRegex)
            const blobs = await Promise.all(
              folderContent.map(r => r.async(file.bufferType))
            )
            const innerFiles = folderContent.map(
              (r, i) => file.build(blobs[i], file.name + '/' + r.name)
            )
            return await this.extractZips(innerFiles, filesRegex)
          } else if (file.name.endsWith('/') || !filesRegex.test(file.name)) {
            return []
          } else {
            return [file]
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
   * @param {Object} fileDict
   * @returns {Object}
   */
  static makeTree(fileDict) {
    const tree = {}
    Object.entries(fileDict).forEach(([filename, file]) => {
      const nodes = file.name.split('/')
      nodes.reduce((acc, node, i) => {
        if (i === nodes.length - 1) {
          return (acc[node] = filename)
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
          Object.assign(res, { filename: node })
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
            if (a.type === t && b.type !== t) { return -1 } else if (a.type !== t && b.type === t) { return 1 }
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

export class BrowserFile {
  constructor(file) {
    this.file = file
  }

  get name() {
    return this.file.name
  }

  get blob() {
    return this.file
  }

  text() {
    return this.file.text()
  }

  get bufferType() {
    return 'blob'
  }

  hash() {
    hashFile(this.file)
  }

  copy(newName) {
    const clone = this.file.slice(0, this.file.size)
    const file = new File([clone], newName)
    return new BrowserFile(file)
  }

  build(content, name) {
    const file = new File([content], name)
    return new BrowserFile(file)
  }
}
