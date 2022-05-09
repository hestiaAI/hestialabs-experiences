import type { ViewBlock } from './view-block'
import type { DatabaseConfig } from './database-config'

export type Collaborator = {
  icon: string
  title: string
  url: string
}
export type Files = { [key: string]: string }
export type PreprocessorFunction = (input: string) => string

export type ExperienceOptions = {
  collaborator?: Collaborator
  databaseConfig?: DatabaseConfig
  dataPortal?: string
  dataPortalMessage?: string
  dataSamples?: string[]
  disabled?: boolean
  files?: Files
  hideFileExplorer?: boolean
  hideSummary?: boolean
  icon: string
  keepOnlyFiles?: boolean
  preprocessors?: { [key: string]: PreprocessorFunction }
  slug: string
  subtitle?: string
  title: string
  tutorialVideos?: string[]
  url?: string
  viewBlocks: ViewBlock[]
}
