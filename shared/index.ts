import { createViewBlock } from './view-block'

// https://javascript.plainenglish.io/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb
import type {
  DatabaseGetterColumnReference,
  DatabaseGetter,
  DatabaseTable,
  DatabaseTables,
  ExperienceOptions,
  NonEmptyArray,
  Files
} from './types'
export type { ExperienceOptions } from './types'

const defaultOptions: Partial<ExperienceOptions> = {
  disabled: false,
  hideFileExplorer: true,
  hideSummary: true,
  subtitle: 'Data Experience'
}

function error(message: string) {
  throw new Error(message)
}

function findAndValidateTable(
  tables: DatabaseTables,
  tableName: string
): DatabaseTable {
  if (tableName) {
    const table = tables.find(t => t.name === table)
    if (!table) {
      error(`Unknown table '${tableName}'`)
    }
    return table
  }
}

function validateColumnReference(table: DatabaseTable, column: string): void {
  const valid = table.columns.some(c => c[0] === column)
  if (!valid) {
    error(`Uknown column reference '${column}' in table '${table.name}'`)
  }
}

const enforceArray = (value: string | string[]) =>
  typeof value === 'string' ? [value] : value

function validatePrimaryKeys(tables: DatabaseTables): void {
  tables.forEach(t =>
    (t.primaryKey || []).forEach(c => validateColumnReference(t, c))
  )
}

function validateForeignKeys(tables: DatabaseTables): void {
  tables.forEach(t =>
    (t.foreignKeys || []).forEach(({ columns: c, reference: r }) => {
      const columns = enforceArray(c)
      const refColumns = enforceArray(r.columns)
      if (columns.length !== refColumns.length) {
        error(
          `Foreign key column number mismatch. Source: ${t.name}(${c}) Reference: ${r.table}(${r.columns})`
        )
      }
      const refTable = findAndValidateTable(tables, r.table)
      columns.forEach(c => validateColumnReference(t, c))
      refColumns.forEach(c => validateColumnReference(refTable, c))
    })
  )
}

function validateGetter(
  {
    fileId,
    table: tableName,
    column,
    getters,
    reference
  }: {
    fileId?: string
    table?: string
    column?: string
    getters?: NonEmptyArray<DatabaseGetter>
    reference?: DatabaseGetterColumnReference
  },
  tables: DatabaseTables,
  files: Files,
  currentTable: DatabaseTable = null
): void {
  if (fileId) {
    if (!files) {
      error(`fileId is only permitted in top-level getters (fileId: ${fileId})`)
    } else if (!(fileId in files)) {
      error(`Unknown fileId '${fileId}'`)
    }
  }
  const table = findAndValidateTable(tables, tableName)
  if (column && !currentTable) {
    error(`Unknown`)
  } else {
    validateColumnReference(currentTable, column)
  }
  if (reference) {
    const referenceTable = findAndValidateTable(tables, reference.table)
    validateColumnReference(referenceTable, reference.column)
  }
  if (table && getters) {
    getters.forEach(g => validateGetter(g, tables, null, table))
  }
}

export class Experience {
  options: ExperienceOptions
  constructor(options: ExperienceOptions) {
    // spread default options first, and then provided options
    this.options = { ...defaultOptions, ...options }
    const {
      slug,
      files,
      databaseConfig: { getters, tables } = {}
    } = this.options

    if (!this.options.defaultView.length) {
      error(`[${slug}] defaultView should not be empty`)
    }
    // validate file ids
    this.options.defaultView.forEach(({ key, files }) => {
      const fileId = files.find((f: string) => !(f in this.options.files))
      if (fileId) {
        error(
          `[${slug}] ViewBlock ${key} has an unconfigured file id ${fileId}`
        )
      }
    })
    if (getters && tables) {
      validateForeignKeys(tables)
      validatePrimaryKeys(tables)
      getters.forEach(g => validateGetter(g, tables, files))
    }
    // construct default view Array
    this.options.defaultView = options.defaultView.map(createViewBlock)
  }
}
