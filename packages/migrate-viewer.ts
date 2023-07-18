import { Experience } from './lib/'
import { writeFileSync, mkdirSync } from 'fs'
import * as packages from './packages'

import camelCase from 'lodash/camelCase'
import isEqual from 'lodash/isEqual'
import { ViewerOptions } from './lib/types'

const outputDir = 'viewer-opts'
function test([name, experience]: [
  name: string,
  experience: Experience
]): void {
  const {
    // loaderOptions: { files, disabled, databaseConfig },
    viewerOptions
    // viewerOptions: { viewBlocks, url }
  } = experience
  viewerOptions.icon = 'TODO'
  const unserializable = diffWithSerialized(viewerOptions)
  if (unserializable) {
    console.log(`[${name}] viewerOptions are not serializable`)
    console.log(JSON.stringify(unserializable, stringifyReplacer, 2))
  } else {
    const fileName = `${outputDir}/${experience.name}-viewer.json`
    writeFileSync(fileName, JSON.stringify(viewerOptions, null, 2))
    console.log('wrote', fileName)
  }
}

function saveUberDriverKeplerConfigs(viewerOptions: ViewerOptions) {
  const keplerFileNames = [
    'kepler_config_heatmap',
    'kepler_config_onlineOffline',
    'kepler_config_restriction',
    'kepler_config_points'
  ]
  let kfindex = 0
  viewerOptions.viewBlocks.forEach(viewBlock => {
    const vizProps: any | undefined = viewBlock.vizProps
    if (vizProps?.keplerConfig) {
      console.log(viewBlock.id, keplerFileNames[kfindex])
      const config = vizProps.keplerConfig
      mkdirSync(outputDir, { recursive: true } as any)
      const fileName = `${outputDir}/${keplerFileNames[kfindex]}.json`
      writeFileSync(fileName, JSON.stringify(vizProps.keplerConfig))
      console.log('wrote', fileName)
      kfindex++
    }
  })
}

function diffObjects(
  obj1: Record<string, any>,
  obj2: Record<string, any>
): Record<string, any> {
  const differences: Record<string, any> = {}
  // Iterate through the keys in the first object
  for (const key in obj1) {
    // Check if the key exists in the second object
    if (key in obj2) {
      // Compare the values
      const val1 = obj1[key]
      const val2 = obj2[key]
      if (!isEqual(val1, val2)) {
        const difference = diffObjects(val1, val2)
        // console.log('value different for key', key)
        differences[key] = difference
      }
    } else {
      // console.log('key missing in 1:', key)
      // Key only exists in the first object
      differences[key] = {
        oldValue: obj1[key],
        newValue: undefined
      }
    }
  }

  // Check for keys in the second object that are not in the first object
  for (const key in obj2) {
    if (!(key in obj1)) {
      // console.log('key missing in 2:', key)
      differences[key] = {
        oldValue: undefined,
        newValue: obj2[key]
      }
    }
  }

  return differences
}

const stringifyReplacer = (_: any, value: any) => {
  if (typeof value === 'function') {
    return `function ${value.name}: ${value.toString().substr(0, 80)}`
  } else if (value === undefined) {
    return 'undefined'
  }
  return value
}

function diffWithSerialized(object: any) {
  const deundefined = removeUndefinedKeys(object)
  const parstringified = JSON.parse(JSON.stringify(object))
  const equal = isEqual(deundefined, parstringified)
  if (!equal) {
    const diff = diffObjects(deundefined, parstringified)
    return diff
  }
  return undefined
}

function removeUndefinedKeys(object: any) {
  if (object) {
    Object.keys(object).forEach(key => {
      const val = object[key]
      if (val === undefined) {
        delete object[key]
      } else if (typeof val === 'object') {
        removeUndefinedKeys(val)
      }
    })
  }
  return object
}

if (process.argv.length > 2) {
  // test one or more packages
  const names: string[] = process.argv.slice(2)
  names.map(camelCase).forEach(name => {
    // we expect the name to be camelCased
    const module = (packages as { [key: string]: Experience })[name]
    if (module) {
      test([name, module])
    } else {
      throw new Error(`The name "${name}" does not match any package.`)
    }
  })
} else {
  // test all packages
  Object.entries(packages).forEach(test)
}
