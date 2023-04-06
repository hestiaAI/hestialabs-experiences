import mm from 'micromatch'

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
    const fileObject = zip.file(regex)[0]
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
