import preprocessors from './preprocessors'
import parseYarrrml from '@/lib/parse-yarrrml'

// https://github.com/webpack/docs/wiki/context#context-module-api
// https://stackoverflow.com/a/54066904/8238129
// https://stackoverflow.com/a/57009738/8238129
// require all modules on the path and with the pattern defined
const reqJSON = require.context('./', true, /.json$/)
const reqYAML = require.context('./', true, /.ya?ml$/)

const extractDirectory = path => path.match(/^\.\/(.+)\//)[1]

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
yarrrmlEntries.forEach(async ([k, yarrrml]) => {
  try {
    await parseYarrrml(yarrrml)
  } catch (err) {
    console.error(`Error parsing YARRRML: ${k}`)
    console.error(err)
  }
})

const yarrrml = Object.fromEntries(yarrrmlEntries)

/*
  Import manifests from JSON files and add yarrrml field:
  {
    directory1: {
      ...some manifest options,
      yarrrml: 'some-yarrrml-string'
    },
    directory2: {
      ...some manifest options,
      yarrrml: 'some-yarrrml-string'
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
    return [
      dir,
      {
        ...config,
        yarrrml: yarrrml[dir]
      }
    ]
  })
)

export const keys = Object.keys(manifests)
export default manifests
