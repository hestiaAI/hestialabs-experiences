import type { ViewBlock } from './view-block'
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
  preprocessors?: { [key: string]: PreprocessorFunction }
  databaseConfig?: DatabaseConfig
  dataModel?: object
  disabled?: boolean
  files?: Files
  keepOnlyFiles?: boolean
}

export type ViewerOptions = {
  title: string
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

export type ExperienceOptions = LoaderOptions & ViewerOptions
