import preprocessors from './preprocessors'
import { validExtensions, extractFirstDirectory } from './utils'

// require all modules on the path and with the pattern defined
// Warning! The arguments passed to require.context must be literals!
// https://github.com/webpack/docs/wiki/context#context-module-api
// https://stackoverflow.com/a/54066904/8238129
// https://stackoverflow.com/a/57009738/8238129
const reqJSON = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/[a-z-]+\.json$/
)
const reqYARRRML = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+\.ya?ml$/
)
const reqSPARQL = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+\.rq$/
)

const reqSharingJSON = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\.json$/
)
const reqSharingSPARQL = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\.rq$/
)
const reqVEGA = require.context(
  './experiences/',
  true,
  /[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+.vega$/
)

// files in assets/data/ are loaded only with file-loader
const reqData = require.context('../assets/data/', true, /.*/)
const dataSamples = reqData
  .keys()
  // filter out invalid keys, and only keep valid extensions
  // JSON files appear twice
  // -> for example ./people.json and ./people
  .filter(k =>
    k.match(new RegExp(`^\\.\\/[a-z0-9-]+\\.(${validExtensions.join('|')})$`))
  )
  .map(key => ({
    key,
    filename: key.replace('./', ''),
    path: reqData(key)
  }))

// Import configs from JSON files
const manifests = Object.fromEntries(
  reqJSON.keys().map(path => {
    // Extract directory name of the experience
    const dir = extractFirstDirectory(path)

    // Extract JSON config
    const {
      title,
      subtitle = 'Data Experience',
      icon,
      ext: extensions,
      files = [],
      multiple = false,
      data: dataFiles = [],
      preprocessor,
      collaborator,
      ...rest
    } = reqJSON(path)

    if (typeof collaborator === 'object' && collaborator.icon) {
      collaborator.icon = require(`@/manifests/icons/${collaborator.icon}`)
    }

    let data = dataSamples.filter(({ filename }) =>
      dataFiles.includes(filename)
    )
    let ext = extensions

    if (dir === 'playground') {
      // Add all data samples to playground
      data = dataSamples
      // All extensions are allowed in the playground
      ext = validExtensions.join(',')
    }

    // Validate config
    const requiredParams = { title, icon, ext }
    Object.entries(requiredParams).forEach(([name, param]) => {
      if (!param) {
        throw new Error(`[${dir}] ${name} is required`)
      }
    })

    if (ext.split(',').some(v => !validExtensions.includes(v))) {
      throw new Error(`[${dir}] parameter ext is invalid`)
    }

    if (dir !== 'playground' && ext.includes('zip') && !files.length) {
      throw new Error(
        `[${dir}] extension zip specified but list of files to extract is empty`
      )
    }

    if (preprocessor && !(preprocessor in preprocessors)) {
      throw new Error(`[${dir}] Preprocessor ${preprocessor} does not exist`)
    }

    return [
      dir,
      {
        title,
        subtitle,
        icon: require(`@/manifests/icons/${icon}`),
        ext,
        files,
        multiple,
        data,
        preprocessor,
        collaborator,
        ...rest,
        examples: []
      }
    ]
  })
)

reqYARRRML.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Extract example name
  const name = path.match(/\/examples\/(.+)\//)[1]
  // Add example
  const example = {
    name,
    // assume single YARRRML file per example
    yarrrml: reqYARRRML(path).default,
    // empty Object for all SPARQL samples of the example
    sparql: [],
    // empty Object for all sharing use-cases
    sharing: [],
    // empty Object for all VEGA samples of the example
    vega: []
  }
  const { examples } = manifests[dir]
  if (name === 'main') {
    // Add main example to the beginning of the Array
    examples.unshift(example)
  } else {
    examples.push(example)
  }
})

reqSPARQL.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Extract example name and SPARQL query sample name
  const match = path.match(/\/examples\/(?<example>.+)\/(?<sparql>.+)\.rq/)
  const { example, sparql } = match.groups
  // Add SPARQL sample
  const exampleObj = manifests[dir].examples.find(e => e.name === example)
  exampleObj.sparql.push({
    name: sparql,
    sparql: reqSPARQL(path).default
  })
})

reqSharingJSON.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Extract comparator name
  const match = path.match(
    /\/examples\/(?<example>.+)\/(?<key>.+)\/[a-z0-9-]+\.json/
  )
  const { example, key } = match.groups

  const { name, comparator, oneToOne } = reqSharingJSON(path)

  const exampleObj = manifests[dir].examples.find(e => e.name === example)
  exampleObj.sharing.push({
    key,
    name,
    comparator,
    oneToOne,
    sparql: ''
  })
})

reqSharingSPARQL.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Extract comparator name
  const match = path.match(
    /\/examples\/(?<example>.+)\/(?<key>.+)\/[a-z0-9-]+\.rq/
  )
  const { example, key } = match.groups

  const sparql = reqSharingSPARQL(path).default

  const exampleObj = manifests[dir].examples.find(e => e.name === example)
  const sharingObj = exampleObj.sharing.find(e => e.key === key)
  sharingObj.sparql = sparql
})

reqVEGA.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Extract example name and VEGA query sample name
  const match = path.match(/\/examples\/(?<example>.+)\/(?<vega>.+)\.vega/)
  const { example, vega } = match.groups
  // Add VEGA sample
  const exampleObj = manifests[dir].examples.find(e => e.name === example)
  exampleObj.vega.push({
    name: vega,
    // vega: 'hellllooooo'
    vega: reqVEGA(path).default
  })
})

Object.entries(manifests).forEach(([key, val]) => {
  if (key !== 'playground') {
    // Add examples from other experiences to playground Array.
    manifests.playground.examples.push(
      ...val.examples.map(ex => ({ ...ex, name: `${key}-${ex.name}` }))
    )
  }
})

// Object -> Array
const manifestsArray = Object.entries(manifests).map(([key, val]) => ({
  key,
  ...val
}))

// Move playground to the end of the Array
manifestsArray.splice(
  manifestsArray.length - 1,
  0,
  ...manifestsArray.splice(
    manifestsArray.findIndex(m => m.key === 'playground'),
    1
  )
)

export default manifestsArray
