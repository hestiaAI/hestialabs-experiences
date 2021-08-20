import { unzip, setOptions } from 'unzipit'

export async function extractFiles(blob, whitelist = [], strict = true) {
  setOptions({
    workerURL: 'https://unpkg.com/unzipit@1.3.5/dist/unzipit-worker.module.js',
    numWorkers: 2
  })

  const { entries } = await unzip(blob)

  if (!Array.isArray(whitelist)) {
    throw new TypeError('whitelist should be Array')
  }

  if (!whitelist.length) {
    throw new Error('List of files to extract should not be empty')
  }

  const archiveName = blob.name

  // [[blob.name, filepath1, text1], [blob.name, filepath2, text2]]
  return await Promise.all(
    whitelist.flatMap(async filepath => {
      if (!Object.prototype.hasOwnProperty.call(entries, filepath)) {
        const msg = `${filepath} is not present in the archive ${blob.name}`
        if (strict) {
          // the file is required to be present in the archive in strict mode
          console.error(msg)
          throw new Error(msg)
        }
        console.warn(msg)
        return []
      }
      return [[archiveName, filepath, await entries[filepath].text()]]
    })
  )
}

export default {
  extractFiles
}
