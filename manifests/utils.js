// list of valid extensions for data samples
// JS files allowed for experimenting with individual twitter files
export const validExtensions = ['csv', 'js', 'json', 'xml', 'zip']

// helper function to extract the top directory in a path
export const extractFirstDirectory = path =>
  path.match(/^(?:\.\/)?([a-z0-9-]+)\//)[1]

/*
function fileTreeToList(tree) {
  return Object.entries(tree).map(([key, value]) => {
    if (Array.isArray(value)) {
      return { filename: key, file: value[0] }
    } else {
      const child = fileTreeToList()
      return { filename: `${key}/${child.filename}`, file: child.file }
    }
  })
}
export function processFiles(fileTree, timedObservationsViewer) {
  const fileNameList = fileTreeToList(fileTree)
}
*/
