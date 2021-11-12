import { identity } from 'lodash'

import allPreprocessors from './preprocessors'
import allParsers from './parsers'

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
  /^\.\/[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+.ya?ml$/
)
const reqSPARQL = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+.rq$/
)
const reqVEGA = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+.vega.json$/
)
const reqParamSPARQL = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+.rqx$/
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
      collaborator,
      isGenericViewer,
      url,
      showDataExplorer,
      preprocessors = {},
      timedObservationsViewer = {},
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
    if (!isGenericViewer && !url) {
      Object.entries(requiredParams).forEach(([name, param]) => {
        if (!param) {
          throw new Error(`[${dir}] ${name} is required`)
        }
      })
      if (ext.split(',').some(v => !validExtensions.includes(v))) {
        throw new Error(`[${dir}] parameter ext is invalid`)
      }
    }
    Object.values(preprocessors).forEach(preprocessor => {
      if (!(preprocessor in allPreprocessors)) {
        throw new Error(`[${dir}] Preprocessor ${preprocessor} does not exist`)
      }
    })
    const preprocessorFuncs = Object.fromEntries(
      Object.entries(preprocessors).map(([filename, preprocessorName]) => [
        filename,
        allPreprocessors[preprocessorName]
      ])
    )

    if (isGenericViewer && !showDataExplorer) {
      throw new Error('the explorer experience must show the data explorer')
    }

    if (Object.hasOwn(timedObservationsViewer, 'fileMatchers')) {
      timedObservationsViewer.fileMatchers.forEach(m => {
        try {
          m.regex = new RegExp(m.regex)
        } catch (error) {
          throw new Error(`The regex '${m.regex}' is not valid`)
        }
      })
    }
    if (Object.hasOwn(timedObservationsViewer, 'parser')) {
      const parser = timedObservationsViewer.parser
      if (parser in allParsers) {
        timedObservationsViewer.parser = allParsers[parser]
      } else {
        throw new Error(`The parser ${parser} doesn't exist`)
      }
    } else {
      timedObservationsViewer.parser = identity
    }
    const module = require(`./experiences/${dir}/`)

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
        preprocessors: preprocessorFuncs,
        collaborator,
        isGenericViewer,
        url,
        showDataExplorer,
        timedObservationsViewer,
        ...rest,
        ...module.default,
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
    // empty Object for all VEGA samples of the example
    vega: [],
    // empty Object for all SPARQL samples of the example
    d3: []
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
    parametrized: false,
    sparql: reqSPARQL(path).default
  })
})

reqParamSPARQL.keys().forEach(path => {
  const dir = extractFirstDirectory(path)
  const match = path.match(
    /\/examples\/(?<example>.+)\/(?<paramSparql>.+)\.rqx/
  )
  const { example, paramSparql } = match.groups
  const exampleObj = manifests[dir].examples.find(e => e.name === example)
  exampleObj.sparql.push({
    name: paramSparql,
    parametrized: true,
    sparql: reqParamSPARQL(path).default
  })
})

reqVEGA.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Extract example name and VEGA query sample name
  const match = path.match(/\/examples\/(?<example>.+)\/(?<vega>.+)\.vega.json/)
  const { example, vega } = match.groups
  // Add VEGA sample
  const exampleObj = manifests[dir].examples.find(e => e.name === example)
  exampleObj.vega.push({
    name: vega,
    type: 'vega',
    vega: reqVEGA(path)
  })
})

Object.entries(manifests).forEach(([key, val]) => {
  val.key = key
  if (key !== 'playground') {
    // Add examples from other experiences to playground Array.
    manifests.playground.examples.push(
      ...val.examples.map(ex => ({ ...ex, name: `${key}-${ex.name}` }))
    )
  }
})

export default manifests
