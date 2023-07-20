import type {
  CustomPipeline,
  PostprocessorFunction,
  ViewBlock
} from './view-block'
import type { DatabaseConfig } from './database-config'

export type Collaborator = {
  icon: string
  title: string
  url: string
}
export type Files = { [key: string]: string }
export type PreprocessorFunction = (input: string) => string
export type Lang = 'en' | 'fr'
export type Messages = Record<
  Lang,
  {
    viewBlocks: {
      [key: string]: object
    }
    [key: string]: object
  }
>

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
  title: string
  version?: number
  hideEmptyTabs?: boolean
  hideFileExplorer?: boolean
  hideSummary?: boolean
  icon?: string
  messages?: Messages
  subtitle?: string
  dataPortal?: string
  dataPortalHtml?: string
  dataPortalMessage?: string
  dataSamples?: string[]
  tutorialVideos?: string[]
  url?: string
  viewBlocks: ViewBlock[]
  collaborator?: Collaborator
}

export type ExperienceViewerOptionsMap = {
  [key: string]: ViewerOptions | string
}

export type ViewerFunctions = {
  postprocessors?: { [key: string]: PostprocessorFunction }
  customPipelines?: { [key: string]: CustomPipeline }
}
export type ExperienceOptions = LoaderOptions & ViewerOptions
