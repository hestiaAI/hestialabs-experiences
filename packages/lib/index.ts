import type { ViewBlock } from '@/types'
import type { PipelineOutput } from '@/types/utils'
import type { Lang, Messages } from '@/types/experience-options'

// https://javascript.plainenglish.io/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb
import type { ExperienceOptions, LoaderOptions, ViewerOptions } from '@/types'
export type { ExperienceOptions, LoaderOptions, ViewerOptions } from '@/types'

// import { merge } from 'lodash'
import genericViewerMessages from '@/pipelines/messages'

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

const messages: Messages = {
  en: {
    viewBlocks: {}
  },
  fr: {
    viewBlocks: {}
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
  hideEmptyTabs: false,
  hideFileExplorer: true,
  hideSummary: true,
  keepOnlyFiles: true,
  messages,
  preprocessors: {},
  tutorialVideos: [],
  url: undefined
}

export class Experience {
  options: LoaderOptions
  viewerOptions: ViewerOptions
  name: string
  version: string

  constructor(
    options: LoaderOptions,
    viewerOptions: ViewerOptions,
    packageJSON: { name: string; version: string },
    importMetaURL: string
  ) {
    // spread default options first, and then provided options
    const mergedOptions = { ...defaultOptions, ...options } as ExperienceOptions

    this.options = mergedOptions
    this.viewerOptions = mergedOptions

    viewerOptions.viewBlocks
      .filter(({ id }) => id in genericViewerMessages)
      .forEach(({ id }) => {
        // merge generic viewer messages if some generic viewer is included

        // Temporary solution until we know how to use lodash
        if (this.viewerOptions.messages) {
          for (const lang in viewerOptions.messages) {
            const l = lang as Lang
            this.viewerOptions.messages[l].viewBlocks[id] =
              genericViewerMessages[id][l].viewBlocks[id]
          }
        }

        // TODO: figure out how to include external dependencies, such as lodash
        // this.options.messages = merge(
        //   this.options.messages,
        //   genericViewerMessages[id]
        // )
      })

    // construct default view Array
    this.viewerOptions.viewBlocks =
      viewerOptions.viewBlocks.map(createViewBlock)

    const packageName = packageJSON.name.replace(/@hestia\.?ai\//, '')

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

  get config() {
    return {
      name: this.name,
      slug: this.name,
      version: this.version,
      ...this.options
    }
  }
}
