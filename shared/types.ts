import { ViewBlock } from './view-block'

type NonEmptyArray<T> = T[] & { 0: T }
type FileExtension = 'csv' | 'js' | 'json' | 'xml' | 'zip'

type PreprocessorFunction = (input: string) => string
export type Preprocessor =
  | PreprocessorFunction
  | { [key: string]: PreprocessorFunction }

export type Collaborator = {
  icon: string
  title: string
  url: string
}

export interface ExperienceOptions {
  allowMissingFiles?: boolean
  collaborator?: Collaborator
  dataPortal?: string
  dataSamples?: string[]
  defaultView: ViewBlock[]
  fileExtensions?: NonEmptyArray<FileExtension>
  icon: string
  isGenericViewer?: boolean
  multiple?: boolean
  preprocessor?: Preprocessor
  slug: string
  subtitle?: string
  title: string
  url?: string
  yarrrml?: string
  zipFilePaths?: string[]
}
