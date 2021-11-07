import { ExperienceOptions } from './types'
export { ExperienceOptions } from './types'

const defaultOptions: Partial<ExperienceOptions> = {
  allowMissingFiles: false,
  multiple: false,
  preprocessor: (input: string) => input,
  subtitle: 'Data Experience'
}

export class Experience {
  options: ExperienceOptions
  constructor(options: ExperienceOptions) {
    const { fileExtensions, zipFilePaths, slug } = options
    // runtime validation of zipFilePaths
    if (
      fileExtensions.includes('zip') &&
      (!zipFilePaths || !zipFilePaths.length)
    ) {
      throw new Error(
        `[${slug}] zip extension was specified but zipFilePaths[] is empty`
      )
    }
    // spread default options first, and then provided options
    this.options = { ...defaultOptions, ...options }
  }
}
