// list of valid extensions for data samples
// JS files allowed for experimenting with individual twitter files
export const validExtensions = ['csv', 'js', 'json', 'xml', 'zip']

// helper function to extract the top directory in a path
export const extractFirstDirectory = path =>
  path.match(/^(?:\.\/)?([a-z0-9-]+)\//)[1]

export function humanReadableFileSize(sizeInBytes) {
  const i = Math.floor(Math.log(sizeInBytes || 1) / Math.log(1024))
  const units = ['B', 'kB', 'MB', 'GB', 'TB']
  return `${(sizeInBytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

export function plurify(word, n) {
  return n === 1 ? word : `${word}s`
}
