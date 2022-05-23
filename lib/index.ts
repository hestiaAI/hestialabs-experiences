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
  preprocessors: {},
  subtitle: 'Data Experience',
  tutorialVideos: [],
  url: undefined
}

export class Experience {
  options: ExperienceOptions
  constructor(options: ExperienceOptions) {
    // spread default options first, and then provided options
    this.options = { ...defaultOptions, ...options }
    // construct default view Array
    this.options.viewBlocks = options.viewBlocks.map(createViewBlock)
  }
}
