import { createViewBlock } from './view-block'
import { ExperienceOptions } from './types'
export { ExperienceOptions } from './types'

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
