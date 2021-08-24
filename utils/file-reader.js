/**
 * Read file using FileReader API,
 * @param {File} file
 * @returns a promise that when resolved, outputs the file contents
 */
export default file => {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}
