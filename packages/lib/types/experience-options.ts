import type {
  CustomPipeline,
  PostprocessorFunction,
  ViewBlock
} from './view-block'
import type { DatabaseConfig } from './database-config'

export type Files = { [key: string]: string }
export type PreprocessorFunction = (input: string) => string
export type Lang = 'en' | 'fr'

export type LoaderOptions = {
  viewerVersion?: number
  preprocessors?: { [key: string]: PreprocessorFunction }
  databaseConfig?: DatabaseConfig
  dataModel?: object
  disabled?: boolean
  files?: Files
  keepOnlyFiles?: boolean
}

export type ViewerOptions = {
  /**
   * The viewblocks that define the different tabs of an experience.
   * See the ViewBlock type further down to see the possible attributes.
   */
  viewBlocks: ViewBlock[]

  /** Monolingual texts.
   * They are meant to be replaced with multilingual texts
   * specified in the messages attribute.
   * However some parts of our code
   * (Probably the ViewBlocks in SectionViewer.vue,
   *  and possibly the list of experiences in _experience/index.vue)
   * don't use messages yet.
   */
  title: string
  subtitle?: string
  dataPortal?: string
  dataPortalHtml?: string
  dataPortalMessage?: string

  /**
   * The translations contain multilingual messages
   * that are specific to the experience.
   * Some of them should override the monolingual attributes above,
   * for example dataPortal would be overridden by
   * messages.en.dataPortal in english and
   * messages.fr.dataPortal in french.
   */
  messages?: Messages

  /** */
  version?: number

  /** Display options */
  hideEmptyTabs?: boolean
  hideFileExplorer?: boolean
  hideSummary?: boolean

  /** Link to an icon, typically a company logo */
  icon?: string

  /** Array of links to samples of the data to be analyzed in the experience*/
  dataSamples?: string[]
  /** Array of links to videos, on vimeo for example */
  tutorialVideos?: string[]
  /** (Apparently an alternative url for placeholder experiences without real content) */
  url?: string
  /** See the Collaborator type below*/
  collaborator?: Collaborator
}

/**
 * The multilingual messages.
 * A few replace the monolingual messages,
 * but there are also messages specific to
 * the experience, viewblocks and their charts.
 * See the default configuration to have an idea
 * of what texts you can change.
 **/
export type Messages = Record<
  Lang,
  {
    viewBlocks: {
      [key: string]: object
    }
    [key: string]: object
  }
>

/**
 * Another organization we're working with, like eyeballs or dating privacy
 */
export type Collaborator = {
  icon: string
  title: string
  url: string
}

export type ExperienceViewerOptionsMap = {
  [key: string]: ViewerOptions | string
}

export type ViewerFunctions = {
  postprocessors?: { [key: string]: PostprocessorFunction }
  customPipelines?: { [key: string]: CustomPipeline }
}
export type ExperienceOptions = LoaderOptions & ViewerOptions
