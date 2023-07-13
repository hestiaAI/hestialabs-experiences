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
const defaultLoaderOptions: Partial<LoaderOptions> = {
  preprocessors: {},
  databaseConfig: undefined,
  disabled: false,
  files: {},
  keepOnlyFiles: true
}
const defaultViewerOptions: Partial<ViewerOptions> = {
  collaborator: undefined,
  dataPortal: undefined,
  dataPortalMessage: undefined,
  dataPortalHtml: undefined,
  dataSamples: [],
  hideEmptyTabs: false,
  hideFileExplorer: true,
  hideSummary: true,
  messages,
  tutorialVideos: [],
  url: undefined
}

const loaderOptionKeys = [
  'preprocessors',
  'databaseConfig',
  'dataModel',
  'disabled',
  'files',
  'keepOnlyFiles'
]

const viewerOptionKeys = [
  'title',
  'hideEmptyTabs',
  'hideFileExplorer',
  'hideSummary',
  'icon',
  'messages',
  'subtitle',
  'dataPortal',
  'dataPortalHtml',
  'dataPortalMessage',
  'dataSamples',
  'tutorialVideos',
  'url',
  'viewBlocks',
  'collaborator'
]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cloneKeys(obj: any, keys: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clone: any = {}
  for (const key of keys) {
    if (key in obj) {
      clone[key] = obj[key]
    }
  }
  return clone
}

export class Experience {
  loaderOptions: LoaderOptions
  viewerOptions: ViewerOptions
  name: string
  version: string

  constructor(
    loaderOptions: LoaderOptions,
    viewerOptions: ViewerOptions,
    packageJSON: { name: string; version: string },
    importMetaURL?: string
  ) {
    // spread default options first, and then provided options
    this.loaderOptions = {
      ...defaultLoaderOptions,
      ...cloneKeys(loaderOptions, loaderOptionKeys)
    } as LoaderOptions

    this.viewerOptions = {
      ...defaultViewerOptions,
      ...cloneKeys(viewerOptions, viewerOptionKeys)
    } as ViewerOptions

    this.initializeViewBlocks(this.viewerOptions)
    const packageName = packageJSON.name.replace(/@hestia\.?ai\//, '')
    this.checkPackageDirectory(packageName, importMetaURL)

    this.name = packageName
    this.version = packageJSON.version
  }

  reconfigure(viewerOptions: ViewerOptions) {
    const packageJSON = { name: this.name, version: this.version }
    return new Experience(this.loaderOptions, viewerOptions, packageJSON)
  }

  checkPackageDirectory(packageName: string, importMetaURL?: string) {
    if (!importMetaURL) {
      // For some reason import.meta.url is not available in the browser
      // (probably because we're not loading it as a module).
      // That's ok because this check only makes sense
      // when the experience is tested in node before publication.
      return
    }
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
  }

  initializeViewBlocks(viewerOptions: ViewerOptions) {
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
    viewerOptions.viewBlocks = viewerOptions.viewBlocks.map(createViewBlock)
  }

  get options() {
    return {
      ...this.loaderOptions,
      ...this.viewerOptions
    } as ExperienceOptions
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
