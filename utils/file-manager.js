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
import _ from 'lodash'
import { matchNormalized, findMatchesInContent } from './accessor'
import { itemifyJSON, nJsonPoints } from '~/utils/json'
import getCsvHeadersAndItems from '~/utils/csv'
import { runWorker } from '@/utils/utils'

const filetype2icon = {
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
   * @param {Object} preprocessors maps file name to preprocessor function
   * @param {Boolean} allowMissingFiles
   */
  constructor(preprocessors, allowMissingFiles = false, workers) {
    this.supportedExtensions = new Set([
      ...Object.keys(extension2filetype),
      ...Object.values(extension2filetype)
    ])
    this.preprocessors = preprocessors ?? {}
    this.allowMissingFiles = allowMissingFiles
    this.setInitialValues()
    this.workers = workers
  }

  /**
   * Fills the FileManager with the given files and creates helper structures.
   * To be called once the files are available.
   * @param {File[]} uppyFiles
   * @param {boolean} multiple
   * @param {Object} idToGlob an object mapping IDs to globs
   * @returns {Promise<FileManager>}
   */
  async init(uppyFiles, multiple, idToGlob) {
    this.fileList = await FileManager.extractZips(uppyFiles)
    this.fileList = FileManager.filterFiles(this.fileList)
    const filePairs = this.fileList.map(f => [f.name, f])
    if (multiple) {
      this.fileDict = Object.fromEntries(filePairs)
    } else {
      this.fileDict = FileManager.removeTopmostFilenames(filePairs)
    }
    this.idToGlob = idToGlob
    this.setInitialValues()
    this.setShortFilenames()
    return this
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
   * This functions abstracts away the name of the topmost file.
   * For instance, if the experience supports a single file that must be a json,
   *   and the user inputs the file 'custom.json', its name is replaced by 'input.json'.
   * If the experience supports a zip as input, the name of the zip is removed from the path of all the files inside:
   *   'my-zip.zip/folder/file.txt' becomes 'folder/file.txt'
   * Note that it only changes the name by which we index the file, and not the actual name of the File object.
   * @param {[String, File][]} filePairs
   * @returns {{[p: String]: File}}
   */
  static removeTopmostFilenames(filePairs) {
    if (filePairs.length === 1) {
      const [filename, file] = filePairs[0]
      const parts = filename.split('/')
      let newFilename
      if (parts.length > 1) {
        newFilename = parts.slice(1, parts.length).join('/')
      } else {
        newFilename = filename.replace(/.+\.(.+)/, 'input.$1')
      }
      return Object.fromEntries([[newFilename, file]])
    } else {
      return Object.fromEntries(
        filePairs.map(([filename, file]) => {
          const parts = filename.split('/')
          const newFilename = parts.slice(1, parts.length).join('/')
          return [newFilename, file]
        })
      )
    }
  }

  /**
   * Returns an array with all the (potentially modified by {@link removeTopmostFilenames}) file names in the File Manager.
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
    return _.has(this.fileDict, filePath)
  }

  /**
   * Loads and returns the content of a text file if it has not already been loaded.
   * @param {String} filePath
   * @returns {Promise<String>}
   */
  async getText(filePath) {
    if (!this.hasFile(filePath)) {
      if (this.allowMissingFiles) {
        return '{}'
      }
      throw new Error(`The file ${filePath} was not provided.`)
    }
    if (!_.has(this.#fileTexts, filePath)) {
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
    if (!_.has(this.#preprocessedTexts, filePath)) {
      let text = await this.getText(filePath)
      if (text === '' && this.allowMissingFiles) {
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
    if (!_.has(this.#csvItems, filePath)) {
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
    if (!_.has(this.#jsonItems, filePath)) {
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
    return this.getFilenames().filter(filePath =>
      matchNormalized(filePath, filePathGlob)
    )
  }

  /**
   * Return the file path(s) that match the ID.
   * If multiple files are found and `unique` is set to true,
   * print a warning and return only the first one.
   * If no file is found, return null.
   * @param {String} id
   * @param {Boolean} unique return a single result
   * @returns a String (unique=true), an array (unique=false), or null
   */
  getFilePathsFromId(id, unique = true) {
    if (!(id in this.idToGlob)) {
      return null
    }
    const glob = this.idToGlob[id]
    const paths = this.findMatchingFilePaths(glob)
    if (paths.length === 0) {
      return null
    } else if (paths.length > 1) {
      if (unique) {
        console.warn(`Multiple files were found for id="${id}", glob="${glob}"`)
      } else {
        return paths
      }
    }
    return paths[0]
  }

  /**
   * Return the preprocessed text of the file(s) that match the ID.
   * If multiple files are found and `unique` is set to true,
   * print a warning and return only the first one.
   * If no file is found, return null.
   * @param {String} id
   * @param {Boolean} unique return a single result
   * @returns a String (unique=true), an array (unique=false), or null
   */
  async getPreprocessedTextFromId(id, unique = true) {
    const paths = this.getFilePathsFromId(id, unique)
    if (paths === null) {
      return null
    }
    if (unique) {
      return await this.getPreprocessedText(paths)
    } else {
      return await Promise.all(paths.map(p => this.getPreprocessedText(p)))
    }
  }

  /**
   * Return the CSV items of the file(s) that match the ID.
   * If multiple files are found and `unique` is set to true,
   * print a warning and return only the first one.
   * If no file is found, return null.
   * @param {String} id
   * @param {Boolean} unique return a single result
   * @returns a String (unique=true), an array (unique=false), or null
   */
  async getCsvItemsFromId(id, unique = true) {
    const paths = this.getFilePathsFromId(id, unique)
    if (paths === null) {
      return null
    }
    if (unique) {
      return await this.getCsvItems(paths)
    } else {
      return await Promise.all(paths.map(p => this.getCsvItems(p)))
    }
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
    ).flatMap(async fileName => {
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
   * Computes and returns the number of "data points" in a file if not already computed.
   * @param {String} filePath
   * @returns {Promise<String>}
   */
  async getNumberOfDataPoints(filePath) {
    if (!_.has(this.#nDataPoints, filePath)) {
      const ext = filePath.match(/^.+\.(.+?)$/)?.[1] ?? 'other'
      if (ext === 'json') {
        const json = await this.getJsonItems(filePath)
        this.#nDataPoints[filePath] = nJsonPoints(json)
      } else if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
        const text = await this.getPreprocessedText(filePath)
        this.#nDataPoints[filePath] = text.split('\n').filter(_.identity).length
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
    if (_.has(this.#fileTexts, filePath)) {
      delete this.#fileTexts[filePath]
    }
    if (_.has(this.#preprocessedTexts, filePath)) {
      delete this.#preprocessedTexts[filePath]
    }
    if (_.has(this.#csvItems, filePath)) {
      delete this.#csvItems[filePath]
    }
    if (_.has(this.#jsonItems, filePath)) {
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
    const files = Object.keys(this.fileDict).map(f => {
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
      const groups = _.groupBy(files, f => f.short)
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
  static async extractZips(files) {
    return (
      await Promise.all(
        files.flatMap(async file => {
          if (file.name.endsWith('.zip')) {
            const zip = new JSZip()
            await zip.loadAsync(file)
            const folderContent = zip.file(/.*/)
            const blobs = await Promise.all(
              folderContent.map(r => r.async('blob'))
            )
            const innerFiles = folderContent.map(
              (r, i) => new File([blobs[i]], file.name + '/' + r.name)
            )
            return await this.extractZips(innerFiles)
          } else if (file.name.endsWith('/')) {
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
