import type { ExperienceOptions, ViewBlock } from './lib/types'
import { error } from './lib/utils'
import {
  validateDatabaseConfigIntegrity,
  validateDatabaseConfigSchema
} from './lib/database-config-validation/'

import * as packages from './packages'

function test({
  options: { slug, files, viewBlocks, disabled, url, databaseConfig }
}: {
  options: ExperienceOptions
}): void {
  if (!disabled && !url && !viewBlocks.length) {
    error(`[${slug}] viewBlocks should not be empty`)
  }
  if (files) {
    // validate file ids
    viewBlocks.forEach(({ id, files: viewFiles }: Partial<ViewBlock>) => {
      if (viewFiles) {
        const fileId = viewFiles.find((f: string) => !(f in files))
        if (fileId) {
          error(
            `[${slug}] ViewBlock ${id} has an unconfigured file id ${fileId}`
          )
        }
      }
    })
    if (databaseConfig) {
      validateDatabaseConfigSchema(slug, databaseConfig)
      validateDatabaseConfigIntegrity(slug, databaseConfig, files)
    }
  }
}

Object.values(packages).forEach(test)
