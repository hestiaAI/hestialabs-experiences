import type { ViewBlock } from './lib/types'
import { error } from './lib/utils'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import {
  validateDatabaseConfigIntegrity,
  validateDatabaseConfigSchema
} from './lib/database-config-validation/'
import { Experience } from './lib/'
import * as packages from './packages'

import camelCase from 'lodash/camelCase'
import isEqual from 'lodash/isEqual'

function test([
  name,
  {
    loaderOptions: { files, disabled, databaseConfig },
    viewerOptions,
    viewerOptions: { viewBlocks, url }
  }
]: [name: string, experience: Experience]): void {
  viewerOptions.icon = 'TODO'
  const unserializable = diffWithSerialized(viewerOptions)
  if (unserializable) {
    console.log(`[${name}] viewerOptions are not serializable`)
    console.log(JSON.stringify(unserializable, stringifyReplacer, 2))
  }
}

function getObjectDifferences(
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
        const diff = getObjectDifferences(val1, val2)
        // console.log('value different for key', key)
        differences[key] = diff
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

function isSerializable(object: any) {
  const deundefined = removeUndefinedKeys(object)
  const parstringified = JSON.parse(JSON.stringify(object))
  const equal = isEqual(deundefined, parstringified)
  if (!equal) {
    const diff = getObjectDifferences(deundefined, parstringified)
    console.log(JSON.stringify(diff, stringifyReplacer, 2))
  }
  return equal
}

function diffWithSerialized(object: any) {
  const deundefined = removeUndefinedKeys(object)
  const parstringified = JSON.parse(JSON.stringify(object))
  const equal = isEqual(deundefined, parstringified)
  if (!equal) {
    const diff = getObjectDifferences(deundefined, parstringified)
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
