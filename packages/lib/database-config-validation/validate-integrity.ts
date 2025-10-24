import type { DatabaseConfig } from '@/types'
import type { NonEmptyArray } from '@/types/utils'
import type { Files } from '@/types/experience-options'
import type {
  DatabaseGetterColumnReference,
  DatabaseGetter,
  DatabaseTable,
  DatabaseTables
} from '@/types/database-config'

import { error, enforceArray } from '../utils'

function findAndValidateTable(
  tables: DatabaseTables,
  tableName: string
): DatabaseTable | void {
  if (tableName) {
    const table = tables.find(t => t.name === tableName)
    if (!table) {
      return error(`Unknown table '${tableName}'`)
    }
    return table
  }
}

function validateColumnReference(table: DatabaseTable, column: string): void {
  const valid = table.columns.some(c => c[0] === column)
  if (!valid) {
    error(`Unknown column reference '${column}' in table '${table.name}'`)
  }
}

function validatePrimaryKeys(tables: DatabaseTables): void {
  tables.forEach(t => {
    const { primaryKey: k } = t
    if (k) {
      const cols = enforceArray(k)
      cols.forEach(c => validateColumnReference(t, c))
    }
  })
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
      refColumns.forEach(c =>
        validateColumnReference(refTable as DatabaseTable, c)
      )
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
  files?: Files,
  currentTable?: DatabaseTable
): void {
  if (fileId) {
    if (!files) {
      error(`fileId is only permitted in top-level getters (fileId: ${fileId})`)
    } else if (!(fileId in files)) {
      error(`Unknown fileId '${fileId}'`)
    }
  }
  const table = findAndValidateTable(tables, tableName as string)
  if (column) {
    if (!currentTable) {
      error(`Missing table reference for column ${column}`)
    } else {
      validateColumnReference(currentTable, column)
    }
  }
  if (reference) {
    const referenceTable = findAndValidateTable(tables, reference.table)
    validateColumnReference(referenceTable as DatabaseTable, reference.column)
  }
  if (table && getters) {
    getters.forEach(g => validateGetter(g, tables, undefined, table))
  }
}

export default function (
  experience: string,
  { getters, tables }: DatabaseConfig,
  files: Files
) {
  console.info(`[${experience}] Validating integrity of databaseConfig...`)
  validateForeignKeys(tables)
  validatePrimaryKeys(tables)
  if (getters) {
    getters.forEach(g => validateGetter(g, tables, files))
  }
}
