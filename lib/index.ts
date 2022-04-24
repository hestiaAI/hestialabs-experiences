import type { ViewBlock } from 'types/view-block'
import type { PipelineOutput } from 'types/utils'

// https://javascript.plainenglish.io/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb
import type { ExperienceOptions } from 'types/index'
export type { ExperienceOptions } from 'types/index'

import { error } from '@/utils'
import {
  validateDatabaseConfigIntegrity,
  validateDatabaseConfigSchema
} from './database-config-validation/index'

const defaultViewBlock: Partial<ViewBlock> = {
  postprocessor: (input: PipelineOutput) => input,
  showTable: false
}

export function createViewBlock(viewBlock: ViewBlock) {
  // merge with default options
  return {
    ...defaultViewBlock,
    ...viewBlock
  }
}

const defaultOptions: Partial<ExperienceOptions> = {
  disabled: false,
  hideFileExplorer: true,
  hideSummary: true,
  subtitle: 'Data Experience'
}

export class Experience {
  options: ExperienceOptions
  constructor(options: ExperienceOptions) {
    // spread default options first, and then provided options
    this.options = { ...defaultOptions, ...options }
    const { slug, files, databaseConfig } = this.options

    if (!this.options.defaultView.length) {
      error(`[${slug}] defaultView should not be empty`)
    }
    // validate file ids
    this.options.defaultView.forEach(({ key, files }) => {
      const fileId = files.find((f: string) => !(f in this.options.files))
      if (fileId) {
        error(
          `[${slug}] ViewBlock ${key} has an unconfigured file id ${fileId}`
        )
      }
    })
    if (databaseConfig) {
      validateDatabaseConfigSchema(slug, databaseConfig)
      validateDatabaseConfigIntegrity(slug, databaseConfig, files)
    }
    // construct default view Array
    this.options.defaultView = options.defaultView.map(createViewBlock)
  }
}
