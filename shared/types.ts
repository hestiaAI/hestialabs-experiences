type NonEmptyArray<T> = T[] & { 0: T }
type FileExtension = 'csv' | 'js' | 'json' | 'xml' | 'zip'

export type PreprocessorFunction = (input: string) => string
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
  fileExtensions: NonEmptyArray<FileExtension>
  icon: string
  multiple?: boolean
  preprocessor?: PreprocessorFunction
  slug: string
  subtitle?: string
  title: string
  zipFilePaths?: string[]
}
