import type { NonEmptyArray } from './utils'

export enum SQLType {
  INTEGER = 'INTEGER',
  TEXT = 'TEXT',
  FLOAT = 'FLOAT',
  DATE = 'DATE'
}

type JSONType = null | boolean | number | string | object

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSONPathRecord = Record<any, any>
export type JSONPathValue = JSONType | JSONType[]

export type JSONPathReturnObject = {
  parent: object | JSONType[]
  parentProperty: string
  path: string
  pointer: string
  value: JSONPathValue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
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
      output: JSONPathRecord | JSONPathValue | JSONPathReturnObject,
      type?: string,
      fullRetObj?: JSONPathReturnObject
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
  primaryKey?: string | string[]
}

export type DatabaseTables = NonEmptyArray<DatabaseTable>

export type DatabaseConfig = {
  tables: DatabaseTables
  getters: DatabaseGetters
}
