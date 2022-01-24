import _ from 'lodash'

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
  /^\.\/[a-z-]+\/[a-z0-9-]+.ya?ml$/
)
const reqSPARQL = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/queries\/[a-z0-9-]+.rq$/
)
const reqVEGA = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/visualizations\/[a-z0-9-]+.vega.json$/
)
const reqSQL = require.context(
  './experiences/',
  true,
  /^\.\/[a-z-]+\/queries\/[a-z0-9-]+.sql$/
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
      files = {},
      multiple = false,
      data: dataFiles = [],
      collaborator,
      isGenericViewer,
      url,
      showDataExplorer,
      preprocessors = {},
      timedObservationsViewer = {},
      defaultView = [],
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
    const requiredParams = { title, icon }
    if (!isGenericViewer && !url) {
      Object.entries(requiredParams).forEach(([name, param]) => {
        if (!param) {
          throw new Error(`[${dir}] ${name} is required`)
        }
      })
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

    if (_.has(timedObservationsViewer, 'fileMatchers')) {
      timedObservationsViewer.fileMatchers.forEach(m => {
        try {
          m.regex = new RegExp(m.regex)
        } catch (error) {
          throw new Error(`The regex '${m.regex}' is not valid`)
        }
      })
    }
    if (_.has(timedObservationsViewer, 'parser')) {
      const parser = timedObservationsViewer.parser
      if (parser in allParsers) {
        timedObservationsViewer.parser = allParsers[parser]
      } else {
        throw new Error(`The parser ${parser} doesn't exist`)
      }
    } else {
      timedObservationsViewer.parser = _.identity
    }

    const firstNoKey = _.find(defaultView, v => !_.has(v, 'key'))
    if (firstNoKey != null) {
      throw new Error(
        `${title}: Property 'key' not found for the defaultView element ${JSON.stringify(
          firstNoKey
        )}`
      )
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
        sparql: {},
        vega: {},
        sql: {},
        defaultView,
        ...rest,
        ...module.default
      }
    ]
  })
)

reqYARRRML.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Take corresponding manifest
  const manifest = manifests[dir]
  // Add YARRRML
  if (manifest.yarrrml !== undefined) {
    throw new Error(`[${dir}] Only one YARRRML file should be defined`)
  }
  manifest.yarrrml = reqYARRRML(path).default
})

reqSPARQL.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Take corresponding manifest
  const manifest = manifests[dir]
  // Extract query name
  const match = path.match(/\/queries\/(?<name>.+)\.rq/)
  const { name } = match.groups
  // Add SPARQL
  manifest.sparql[name] = reqSPARQL(path).default
})

reqVEGA.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Take corresponding manifest
  const manifest = manifests[dir]
  // Extract viz name
  const match = path.match(/\/visualizations\/(?<name>.+)\.vega.json/)
  const { name } = match.groups
  // Add Vega
  manifest.vega[name] = reqVEGA(path)
})

reqSQL.keys().forEach(path => {
  // Extract directory name of the experience
  const dir = extractFirstDirectory(path)
  // Take corresponding manifest
  const manifest = manifests[dir]
  // Extract query name
  const match = path.match(/\/queries\/(?<name>.+)\.sql/)
  const { name } = match.groups
  // Add SPARQL
  manifest.sql[name] = reqSQL(path).default
})

Object.entries(manifests).forEach(([key, val]) => {
  val.key = key
})

export const config = require(`@/config/${process.env.configName}.json`)

// keep only experiences declared in the config
const manifestsFiltered = Object.fromEntries(
  Object.entries(manifests).filter(([k, v]) => config.experiences.includes(k))
)

export default manifestsFiltered
