import { unzip, setOptions } from 'unzipit'

setOptions({
  workerURL: 'https://unpkg.com/unzipit@1.3.5/dist/unzipit-worker.module.js',
  numWorkers: 2
})

export async function readFiles(blob, whitelist = []) {
  const { entries } = await unzip(blob)

  if (!Array.isArray(whitelist)) {
    throw new TypeError('whitelist should be Array')
  }

  if (!whitelist.length) {
    throw new Error('whitelist should not be empty')
  }

  return await Promise.all(whitelist.map(name => entries[name].text()))
}

export default {
  readFiles
}
