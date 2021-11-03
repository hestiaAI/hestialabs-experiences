type NonEmptyArray<T> = T[] & { 0: T }
type FileExtension = 'csv' | 'js' | 'json' | 'xml' | 'zip'

export type PreprocessorFunction = (input: string) => string

export interface ExperienceOptions {
  allowMissingFiles?: boolean
  collaborator?: {
    icon: string
    title: string
    url: string
  }
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
