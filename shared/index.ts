import { createViewBlock } from './view-block'
// https://javascript.plainenglish.io/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb
import type { ExperienceOptions } from './types'
export type { ExperienceOptions } from './types'

const defaultOptions: Partial<ExperienceOptions> = {
  allowMissingFiles: false,
  fileExtensions: ['zip'],
  isGenericViewer: false,
  multiple: false,
  preprocessor: (input: string) => input,
  subtitle: 'Data Experience'
}

export class Experience {
  options: ExperienceOptions
  constructor(options: ExperienceOptions) {
    // spread default options first, and then provided options
    this.options = { ...defaultOptions, ...options }

    // construct default view Array
    this.options.defaultView = options.defaultView.map(createViewBlock)

    // runtime validation of zipFilePaths
    const { fileExtensions, zipFilePaths, slug } = this.options
    if (
      fileExtensions.includes('zip') &&
      (!zipFilePaths || !zipFilePaths.length)
    ) {
      throw new Error(
        `[${slug}] zip extension was specified but zipFilePaths[] is empty`
      )
    }
  }
}
