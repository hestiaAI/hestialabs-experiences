import type { ViewBlock } from './view-block'

export type NonEmptyArray<T> = T[] & { 0: T }

export type Collaborator = {
  icon: string
  title: string
  url: string
}

export enum SQLType {
  INTEGER = 'INTEGER',
  TEXT = 'TEXT',
  FLOAT = 'FLOAT',
  DATE = 'DATE'
}

export enum JSONPathResultType {
  value = 'value',
  path = 'path',
  pointer = 'pointer',
  parent = 'parent',
  parentProperty = 'parentProperty',
  all = 'all'
}

type DatabaseColumns = string | NonEmptyArray<string>

type DatabaseForeignKey = {
  columns: DatabaseColumns
  reference: {
    table: string
    columns: DatabaseColumns
  }
}

export type DatabaseGetterColumnReference = {
  autoincrementedId?: boolean
  table: string
  column: string
}

export type DatabaseGetter = {
  column?: string
  getters?: NonEmptyArray<DatabaseGetter>
  options?: {
    resultType?: JSONPathResultType
    callback?: (
      preferredOutput: string | object,
      type?: string,
      fullRetObj?: object
    ) => void
  }
  path?: string
  pathKey?: string
  queryRoot?: boolean
  table?: string
  reference?: DatabaseGetterColumnReference
}

type DatabaseGetters = NonEmptyArray<
  DatabaseGetter & {
    fileId: string
  }
>

export type DatabaseTable = {
  name: string
  columns: NonEmptyArray<[string, SQLType, string?]>
  foreignKeys?: DatabaseForeignKey[]
  primaryKey: string[]
}

export type DatabaseTables = NonEmptyArray<DatabaseTable>

type DatabaseConfig = {
  tables: DatabaseTables
  getters: DatabaseGetters
}

export type Files = { [key: string]: string }

export type PreprocessorFunction = (input: string) => string

export interface ExperienceOptions {
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
