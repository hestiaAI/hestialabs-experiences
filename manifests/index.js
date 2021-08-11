/* eslint no-console: "off" */
import preprocessors from './preprocessors'
import parseYarrrml from '@/lib/parse-yarrrml'

// https://github.com/webpack/docs/wiki/context#context-module-api
// https://stackoverflow.com/a/54066904/8238129
// https://stackoverflow.com/a/57009738/8238129
// require all modules on the path and with the pattern defined
const reqJSON = require.context(
  './experiences/',
  true,
  /[a-z-]+\/[a-z-]+.json$/
)
const reqYAML = require.context(
  './experiences/',
  true,
  /[a-z-]+\/[a-z-]+.ya?ml$/
)

const extractDirectory = path => path.match(/^\.\/(.+)\//)[1]

/*
  Import manifests from JSON files and add yarrrml field:
  {
    directory1: {
      ...some manifest options
    },
    directory2: {
      ...some manifest options
    }
  }
*/
const manifests = Object.fromEntries(
  reqJSON.keys().map(path => {
    const dir = extractDirectory(path)
    const config = reqJSON(path)
    if (config.preprocessor) {
      // Replace preprocessor reference with the function itself
      config.preprocessor = preprocessors[config.preprocessor]
    }
    return [dir, config]
  })
)

/*
  Extract from YAML files. Output:
  {
    directory1: 'some-yarrrml-string',
    directory2: 'some-yarrrml-string',
    ...
  }
*/
const yarrrmlEntries = reqYAML
  .keys()
  .map(path => [extractDirectory(path), reqYAML(path).default])

// validate preconstructed YARRRML by parsing each file
console.log('Validating YARRRML')
yarrrmlEntries.forEach(async ([k, yarrrml]) => {
  try {
    console.log(`Parsing ${k}...`)
    await parseYarrrml(yarrrml)
  } catch (err) {
    console.error(`Error parsing YARRRML: ${k}`)
    console.error(err)
  }
})

const yarrrml = Object.fromEntries(yarrrmlEntries)

// Merge yarrrml to respective config object
for (const key in manifests) {
  manifests[key].yarrrml = yarrrml[key]
}

export const keys = Object.keys(manifests)
export default manifests
