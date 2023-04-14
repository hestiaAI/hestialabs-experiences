import mm from 'micromatch'
import JSZip from 'jszip'
import Papa from 'papaparse'
import FetchItemsWorker from '@/utils/jsonpath.worker.js'
import { runWorker } from '@/utils/worker'
/**
 * Validates a zip file to ensure it contains all the files needed
 * Usage:
 * const zipLoader = new JSZip()
 * const zipObject = await zipLoader.loadAsync(this.file)
 * const filesNeeded = ['/*.json', '/*.csv']
 * const isValid = validateZip(zipObject, filesNeeded)
 * @param {JSZip} zip: JSZip instance containing the zip file
 * @param {Array<String>} filesNeeded:  Array of glob patterns to check for in zip
 * @returns True if all files are present, false otherwise
 */
export function validateZip(zip, filesNeeded) {
  const fileMissing = filesNeeded.filter((file) => {
    const regex = mm.makeRe(file)
    return !zip.file(regex).length
  })
  return fileMissing.length === 0
}

/**
  * Gets files from a zip file
  * Usage:
  * const zipLoader = new JSZip()
  * const zipObject = await zipLoader.loadAsync(this.file)
  * const filesNeeded = ['/*.json', '/*.csv']
  * const files = getFilesFromZip(zipObject, filesNeeded)
  * @param {JSZip} zip: JSZip instance containing the zip file
  * @param {Array<String>} filesNeeded:  Array of glob patterns to check for in zip
  * @returns Array containing the files
  */
export function getFilesFromZip(zip, filesNeeded) {
  const files = {}
  filesNeeded.forEach((file) => {
    const regex = mm.makeRe(file)
    const fileObject = zip.file(regex)
    files[file] = fileObject
  })
  return files
}

/**
  * Replaces one or multiple occurence of a string or RegExp in a file
  * A string pattern will only be replaced once. To perform a global search and replace, use a regular expression with the g flag.
  * Usage:
  * const file = new File(['foo foo foo'], 'foo.txt', { type: 'text/plain' })
  * const newFile = searchAndReplace(file, /foo/g, 'bar')
  * @param {File} file: File object to search and replace in
  * @param {String} search: String to search for
  * @param {String} replace: String to replace with
  * @returns String containing the new file
  */
export function searchAndReplace(file, search, replace) {
  const fileString = file.asText()
  const newFileString = fileString.replace(search, replace)
  return newFileString
}

/**
 * Retrieve and read all files that match a regex
 * @param {List of Uppy files} files: the list of uppy files to inspect
 * @param {Regex pattern to search for files} regex: the regex use to find files
 * @returns a list of files Object of the form:
 * {
 *    text: content of the file as string
 *    name: file name
 *    extension: file extension
 * }
 */
export async function getFiles(files, regex) {
  const filesFound = []
  for (const file of files) {
    if (file.extension === 'zip') {
      const zipLoader = new JSZip()
      const zip = await zipLoader.loadAsync(file.data)
      const zipFiles = zip.file(regex).filter(zipFile => !zipFile.dir)
      const contents = await Promise.all(zipFiles.map((zipFile) => {
        const name = zipFile.name.split('/').pop()
        const extension = zipFile.name.split('.').pop()
        return zipFile.async('string').then((text) => { return { text, name, extension } })
      }))
      filesFound.push(...contents)
    } else if (regex.test(file.name)) {
      filesFound.push({
        text: await file.data.text(),
        name: file.name,
        extension: file.name.split('.').pop()
      })
    }
  }
  return filesFound
}

export async function readCsv(csvString, params = {}) {
  const { headers, items } = await new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        results.errors.forEach(e => console.error(e))
        resolve({ headers: results.meta.fields, items: results.data })
      },
      ...params
    })
  })
  return { headers, items }
}

export async function getJsonObject(text, extension) {
  switch (extension) {
    case 'json':
      return JSON.parse(text)
    case 'csv':
      return (await readCsv(text)).items
    default:
      throw new Error(`Invalid file type, ${extension} is not supported.`)
  }
}

export async function generateTable(files, config) {
  const regex = mm.makeRe(config.file)
  const filesFound = await getFiles(files, regex)
  if (!filesFound.length) {
    throw new Error('No files where found with the current regex: ' + regex)
  }

  const results = (await Promise.all(filesFound.map(async(fileObject) => {
    const json = await getJsonObject(fileObject.text, fileObject.extension)
    console.log(json)
    const rows = await runWorker(new FetchItemsWorker(), {
      json,
      arrayPath: config.array,
      columns: config.columns
    })
    return rows
  }))).flat(1)

  return {
    headers: config.columns.map((c) => { return { text: c.name, value: c.name } }),
    items: results
  }
}
