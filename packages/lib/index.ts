import type { ViewBlock } from '@/types'
import type {
  ExperienceViewerOptionsMap as ViewerOptionsMap,
  Lang,
  Messages,
  ViewerFunctions
} from '@/types/experience-options'

// https://javascript.plainenglish.io/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb
import type { ExperienceOptions, LoaderOptions, ViewerOptions } from '@/types'
export type { ExperienceOptions, LoaderOptions, ViewerOptions } from '@/types'

// import { merge } from 'lodash'
import genericViewerMessages from '@/pipelines/messages'

const defaultViewBlock: Partial<ViewBlock> = {
  showTable: false
}

export function createViewBlock(
  viewBlock: ViewBlock,
  viewerFunctions: ViewerFunctions
) {
  // merge with default options
  const mergedViewBlock = {
    ...defaultViewBlock,
    ...viewBlock
  }
  populateViewBlockFunctions(mergedViewBlock, viewerFunctions)
  return mergedViewBlock
}

export function populateViewBlockFunctions(
  viewBlock: ViewBlock,
  viewerFunctions: ViewerFunctions
) {
  const postprocessor = viewBlock.postprocessor as string
  if (typeof postprocessor === 'string') {
    viewBlock.postprocessor = viewerFunctions.postprocessors?.[postprocessor]
  }
  const customPipeline = viewBlock.customPipeline as string
  const pipelineFunc = viewerFunctions.customPipelines?.[customPipeline]
  if (typeof customPipeline === 'string' && pipelineFunc) {
    viewBlock.customPipeline = pipelineFunc
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
  'viewerVersion',
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

async function fetchViewerOptions(
  experienceName: string,
  experienceViewOptionsUrlPrefix: string
) {
  const vUrl = `${experienceViewOptionsUrlPrefix}/${experienceName}-viewer.json`
  const viewerOptsResp = await fetch(vUrl)
  if (viewerOptsResp.ok) {
    return await viewerOptsResp.json()
  }
  return undefined
}
export class Experience {
  loaderOptions: LoaderOptions
  viewerOptions: ViewerOptions
  viewerFunctions: ViewerFunctions
  name: string
  version: string

  constructor(
    loaderOptions: LoaderOptions,
    viewerOptions: ViewerOptions,
    packageJSON: { name: string; version: string },
    importMetaURL: string | undefined,
    viewerFunctions: ViewerFunctions = {}
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

    this.viewerFunctions = viewerFunctions

    this.initializeViewBlocks(this.viewerOptions, this.viewerFunctions)
    const packageName = packageJSON.name.replace(/@hestia\.?ai\//, '')
    this.checkPackageDirectory(packageName, importMetaURL)

    this.name = packageName
    this.version = packageJSON.version
  }

  /**
   * Checks if viewer options have compatibility problems with this experience.
   * Currently it only checks that:
   * viewerOptions.version >= this.loaderOptions.viewerVersion
   *
   * @param viewerOptions - The options to check.
   * @returns false or a string explaining the compatibility errors.
   */
  viewerCompatibilityErrors(
    viewerOptions: ViewerOptions | undefined
  ): string | boolean {
    if (viewerOptions === undefined) {
      return `Undefined viewer options passed to experience ${this.name}`
    }
    const { viewerVersion } = this.loaderOptions
    if (viewerVersion !== undefined) {
      const { version } = viewerOptions
      if (!version || version < viewerVersion) {
        return (
          `Experience ${this.name} ${this.version}` +
          ` requires viewerVersion ${viewerVersion},` +
          ` which is incompatible with viewerOptions version ${version}.`
        )
      }
    }
    return false
  }

  /**
   * Returns a new experience module configured with other viewer options.
   *
   * @param viewerOptions - The configuration of the new experience module.
   */
  configureViewer(viewerOptions: ViewerOptions) {
    const errorMessage = this.viewerCompatibilityErrors(viewerOptions)
    if (errorMessage) {
      throw new Error(errorMessage)
    }

    const packageJSON = { name: this.name, version: this.version }
    return new Experience(
      this.loaderOptions,
      viewerOptions,
      packageJSON,
      undefined,
      this.viewerFunctions
    )
  }

  async provideViewerOptions(
    viewerOptionRef: string | ViewerOptionsMap | undefined
  ) {
    if (viewerOptionRef === undefined) {
      return undefined
    }
    if (typeof viewerOptionRef == 'string') {
      return fetchViewerOptions(this.name, viewerOptionRef)
    }
    const experienceVRef = viewerOptionRef[this.name]
    if (typeof experienceVRef == 'string') {
      return fetchViewerOptions(this.name, experienceVRef)
    }
    return experienceVRef
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

  initializeViewBlocks(
    viewerOptions: ViewerOptions,
    viewerFunctions: ViewerFunctions
  ) {
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
    viewerOptions.viewBlocks = viewerOptions.viewBlocks.map(b =>
      createViewBlock(b, viewerFunctions)
    )
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
