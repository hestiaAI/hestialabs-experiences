import preprocessors from './preprocessors'

// require all modules on the path and with the pattern defined
// Warning! The arguments passed to require.context must be literals!
// https://github.com/webpack/docs/wiki/context#context-module-api
// https://stackoverflow.com/a/54066904/8238129
// https://stackoverflow.com/a/57009738/8238129
const reqJSON = require.context(
  './experiences/',
  true,
  /[a-z-]+\/[a-z-]+\.json$/
)
const reqYARRRML = require.context(
  './experiences/',
  true,
  /[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+.ya?ml$/
)
const reqSPARQL = require.context(
  './experiences/',
  true,
  /[a-z-]+\/examples\/[a-z0-9-]+\/[a-z0-9-]+.rq$/
)

const extractFirstDirectory = path => path.match(/^(?:\.\/)?([a-z0-9-]+)\//)[1]

// Import configs from JSON files
const manifests = Object.fromEntries(
  reqJSON.keys().map(path => {
    // Extract directory name of the experience
    const dir = extractFirstDirectory(path)

    // Extract JSON config
    const config = reqJSON(path)

    // Add preprocessor if specified
    const { preprocessor } = config
    if (preprocessor) {
      if (preprocessor in preprocessors) {
        // Replace preprocessor reference with the function itself
        config.preprocessor = preprocessors[preprocessor]
      } else {
        throw new Error(`Preprocessor ${preprocessor} does not exist`)
      }
    }

    return [
      dir,
      {
        ...config,
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
    sparql: []
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

export const keys = Object.keys(manifests)
export default manifests
