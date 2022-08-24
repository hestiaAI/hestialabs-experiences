import type { ViewBlock } from '@/types'
import type { PipelineOutput } from '@/types/utils'

// https://javascript.plainenglish.io/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb
import type { ExperienceOptions } from '@/types'
export type { ExperienceOptions } from '@/types'

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
  collaborator: undefined,
  databaseConfig: undefined,
  dataPortal: undefined,
  dataPortalMessage: undefined,
  dataPortalHtml: undefined,
  dataSamples: [],
  disabled: false,
  files: {},
  hideFileExplorer: true,
  hideSummary: true,
  keepOnlyFiles: true,
  messages: undefined,
  preprocessors: {},
  subtitle: 'Data Experience',
  tutorialVideos: [],
  url: undefined
}

export class Experience {
  options: ExperienceOptions
  name: string
  version: string

  constructor(
    options: ExperienceOptions,
    packageJSON: { name: string; version: string },
    importMetaURL: string
  ) {
    // spread default options first, and then provided options
    this.options = { ...defaultOptions, ...options }
    // construct default view Array
    this.options.viewBlocks = options.viewBlocks.map(createViewBlock)

    const packageName = packageJSON.name.replace('@hestiaai/', '')

    const match = importMetaURL.match(/\/([^/]+)\/src\//)
    if (!match) {
      const message = `Package directory for package "${packageName}" not found`
      throw new Error(message)
    }
    const packageDirectory = match[1]
    if (packageName !== packageDirectory) {
      const message = `Package name "${packageName}" must match directory name "${packageDirectory}"`
      throw new Error(message)
    }

    this.name = packageName
    this.version = packageJSON.version
  }
}
