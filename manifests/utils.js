export function humanReadableFileSize(sizeInBytes) {
  const i = Math.floor(Math.log(sizeInBytes || 1) / Math.log(1024))
  const units = ['B', 'kB', 'MB', 'GB', 'TB']
  return `${(sizeInBytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

export function plurify(word, n) {
  return n === 1 ? word : `${word}s`
}
