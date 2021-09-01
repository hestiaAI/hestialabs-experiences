// list of valid extensions for data samples
// JS files allowed for experimenting with individual twitter files
export const validExtensions = ['csv', 'js', 'json', 'xml', 'zip']

// helper function to extract the top directory in a path
export const extractFirstDirectory = path =>
  path.match(/^(?:\.\/)?([a-z0-9-]+)\//)[1]
