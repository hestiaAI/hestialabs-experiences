import unzip from '@/lib/unzip'
import readFile from '@/lib/file-reader'

/**
 * Counts number of times each path was extracted
 * so we can take detect if files with same name were submitted or if
 * multiple zip-archives overlap or are of the same type
 * (for example, multiple twitter archives)
 * @param {Array} results - output from processFiles()
 * @returns {Object} key: {String} filepath, value: {Integer} duplicate count
 */
function countDuplicateFiles(results) {
  return results.reduce((acc, cur) => {
    const name = cur[1]
    if (name in acc) {
      acc[name]++
    } else {
      // First hit sets number of duplicates to zero
      acc[name] = 0
    }
    return acc
  }, {})
}

/**
 * Computes file prefixes based on file duplicate counts
 * @param {Array} fileDuplicateCounts - output from countDuplicateFiles()
 * @returns {Object} key: {String} filepath, value: {Array} prefixes for all occurrences
 */
function computeFilePrefixes(fileDuplicateCounts) {
  return Object.fromEntries(
    Object.entries(fileDuplicateCounts).map(([name, count]) => {
      if (count === 0) {
        return [name, ['']]
      }
      const prefixes = [...Array(count + 1).keys()].map(
        k => `${k}`.padStart(3, '0') + '-'
      )
      return [name, prefixes]
    })
  )
}

/**
 * Computes file prefixes based on file duplicate counts
 * @param {Array} results - output from processFiles()
 * @returns {Object} {
 *  extractedFiles: {Object} key: archive name, value: Array of file paths extracted
 *  inputFilesRocketRML: {Object} corresponds to inputFiles parameter of RocketRML.parseFileLive()
 * }
 */
export function getInputFiles(
  results,
  ext,
  preprocessorFunc,
  isSingleFileExperience
) {
  const fileDuplicateCounts = countDuplicateFiles(results)
  const filePrefixes = computeFilePrefixes(fileDuplicateCounts)

  let inputFilesRocketRML = null
  let extractedFiles = null

  if (isSingleFileExperience) {
    // the data experience involves a single file input so the name is irrelevant
    // -> input.<ext>
    const filename = `input.${ext}`
    inputFilesRocketRML = { [filename]: preprocessorFunc(results[0][2]) || '' }
  } else {
    // user can submit multiple files or an archive
    const inputFilesEntries = results.map(
      ([archiveName, filepath, content]) => {
        const contentProcessed = preprocessorFunc(content)
        // filename is a key in inputFilesRocketRML object

        // multiple files share this file name (which can be a path)
        const prefix = filePrefixes[filepath][fileDuplicateCounts[filepath]--]
        const filename = prefix + filepath

        return [archiveName, filename, contentProcessed]
      }
    )

    // group by archive
    extractedFiles = inputFilesEntries.reduce((acc, [archive, filename, c]) => {
      if (archive in acc) {
        acc[archive].push(filename)
      } else {
        acc[archive] = [filename]
      }
      return acc
    }, {})

    inputFilesRocketRML = Object.fromEntries(
      inputFilesEntries.map(([a, f, c]) => [f, c])
    )
  }
  return {
    extractedFiles,
    inputFilesRocketRML
  }
}

/**
 * Read provided files and archives asynchronously
 * @param {Array} files - File objects
 * @param {Array} filesToExtract - Array of Strings, specifying which paths to extract from archives
 * @param {Boolean} strictExtraction
 * @returns {Object} { results: Array of [archive, filepath, contents] triples, elapsed: Integer }
 */
export default async function processFiles(
  files,
  filesToExtract,
  strictExtraction,
  ...getInputFilesParams
) {
  const start = new Date()

  // Extract files
  const resolvedArr = await Promise.all(
    files.flatMap(async f => {
      if (f.name.endsWith('.zip')) {
        // read zip archive and only extract listed files
        const filesRes = await unzip.extractFiles(
          f,
          filesToExtract,
          strictExtraction
        )
        return filesRes.flat()
      } else {
        // single non-archive file
        return [['', f.name, await readFile(f)]]
      }
    })
  )
  const results = resolvedArr.flat()

  // Process results
  const res = getInputFiles(results, ...getInputFilesParams)

  return { ...res, filesProcessingTime: new Date() - start }
}
