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
  dataSamples?: string[]
  defaultView: ViewBlock[]
  disabled?: boolean
  files: Files
  hideFileExplorer?: boolean
  hideSummary?: boolean
  icon: string
  preprocessors?: { [key: string]: PreprocessorFunction }
  slug: string
  subtitle?: string
  title: string
  url?: string
}
