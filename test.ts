import type { ViewBlock } from './lib/types'
import { error } from './lib/utils'
import {
  validateDatabaseConfigIntegrity,
  validateDatabaseConfigSchema
} from './lib/database-config-validation/'
import { Experience } from './lib'
import * as packages from './packages'

function test([
  name,
  {
    options: { files, viewBlocks, disabled, url, databaseConfig }
  }
]: [name: string, experience: Experience]): void {
  if (!disabled && !url && !viewBlocks.length) {
    error(`[${name}] viewBlocks should not be empty`)
  }
  if (files && !('$DYNAMIC_FILES' in files)) {
    // validate file ids
    viewBlocks.forEach(({ id, files: viewFiles }: Partial<ViewBlock>) => {
      if (viewFiles) {
        const fileId = viewFiles.find((f: string) => !(f in files))
        if (fileId) {
          error(
            `[${name}] ViewBlock ${id} has an unconfigured file id ${fileId}`
          )
        }
      }
    })
    if (databaseConfig) {
      validateDatabaseConfigSchema(name, databaseConfig)
      validateDatabaseConfigIntegrity(name, databaseConfig, files)
    }
  }
}
if (process.argv.length > 2) {
  // test a single package
  const name: string = process.argv[2]
  // we expect the name to be camelCased
  const module = (packages as { [key: string]: Experience })[name]
  if (module) {
    test([name, module])
  } else {
    throw new Error(`
The given package name "${name}" does not match a package.
Make sure the name is camelCased`)
  }
} else {
  // test all packages
  Object.entries(packages).forEach(test)
}
