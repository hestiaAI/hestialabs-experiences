import initSqlJs from 'sql.js'
import sqlWasm from 'sql.js/dist/sql-wasm.wasm'
import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'

const enforceArray = value => (typeof value === 'string' ? [value] : value)

/**
 * An abstraction for an SQL table. Contains columns of a given datatype.
 */
class Table {
  #name
  #columnNames
  #datatypes

  /**
   * @param {String} name the name of the table
   * @param {Array<Array<String>>} columns an array of columns, each column being an array containing the the name and the type.
   */
  constructor (name, columns) {
    // Sanity check: allow only alphanumeric names and correct types
    const r = /^[a-z0-9]+$/i
    if (!r.test(name)) {
      throw new Error('Invalid table name (should be alphanumeric).')
    }
    const validTypes = ['integer', 'text', 'float', 'date']
    for (const c of columns) {
      if (![2, 3].includes(c.length)) {
        const msg = `
          Column definition should consist of a name, a type,
          and an optional keyword phrase.
        `
        throw new Error(msg)
      }
      if (!r.test(c[0])) {
        throw new Error('Invalid column name (should be alphanumeric).')
      }
      if (!validTypes.includes(c[1].toLowerCase())) {
        throw new Error(
          'Invalid type, should be one of: ' + validTypes.toString()
        )
      }
    }
    this.#name = name
    this.#columnNames = columns.map(c => c[0])
    // { [column]: [<type> <keywords?>] }
    this.#datatypes = Object.fromEntries(
      columns.map(c => [c[0], c.slice(1, 3).join(' ')])
    )
  }

  getColumnNames () {
    return this.#columnNames.slice()
  }

  datatype (column) {
    return this.#datatypes[column]
  }
}

/**
 * Class DB is a wrapper around a sql.js database.
 * It provides functions for interacting with the database and processing the results into objects.
 */
export class DB {
  #db
  #tables

  constructor () {
    this.#db = null
    this.#tables = new Map()
  }

  #checkState () {
    if (!this.#db) {
      throw new Error('The database has not been initialized.')
    }
  }

  /**
   * Asynchronously initialize the database.
   */
  async init () {
    // If a database already exists, close it.
    if (this.#db) {
      this.close()
    }
    const SQL = await initSqlJs({
      locateFile: () => sqlWasm
    })
    this.#db = new SQL.Database()
    // enable foreign keys
    this.#db.run('PRAGMA foreign_keys=ON')
  }

  /**
   * Create a new table.
   * @param {String} table the name of the table to create.
   * @param {Array<Array<String>>} columns an array of columns, each column being an array containing the the name and the type.
   */
  create ({ name, columns, foreignKeys = [], primaryKey = [] }) {
    this.#checkState()

    if (this.#tables.has(name)) {
      throw new Error('A table with this name already exists.')
    }
    const table = new Table(name, columns)
    this.#tables.set(name, table)
    const cols = table
      .getColumnNames()
      .map((c, i) => `${c} ${table.datatype(c)}`)
    let statement = `CREATE TABLE ${name} (${cols.join(', ')}`
    if (primaryKey.length) {
      const cols = enforceArray(primaryKey).join(', ')
      statement += `, PRIMARY KEY (${cols})`
    }
    foreignKeys.forEach(({ columns: c, reference: r }) => {
      const cols = enforceArray(c).join(', ')
      const refCols = enforceArray(r.columns).join(', ')
      statement += `, FOREIGN KEY (${cols}) REFERENCES ${r.table}(${refCols})`
    })
    statement += ')'
    this.#db.run(statement)
  }

  /**
   * Insert all the given items in the database.
   * IMPORTANT: the items should NOT contain any 'undefined' value. Use null instead.
   * @param {String} table the table in which we insert the values.
   * @param {Array<Object>} items an array of rows to insert. Each row should contain the same attributes.
   */
  insert (tableName, items) {
    this.#checkState()

    if (!this.#tables.has(tableName)) {
      throw new Error('This table does not exist.')
    }
    const table = this.#tables.get(tableName)
    const columns = table.getColumnNames().filter(
      // disregard auto-incremented columns in INSERT statement
      name => !table.datatype(name).toLowerCase().includes('autoincrement')
    )
    const columnsJoined = columns.join(', ')
    const placeholders = columns.map(_ => '?').join(', ')

    const sql = `INSERT INTO ${tableName}(${columnsJoined}) VALUES (${placeholders});`
    items.forEach((item) => {
      const values = columns.map(c => item[c])
      this.#db.run(sql, values)
    })
  }

  /**
   * Execute a query and process the results into an array of objects.
   * @param {String} sql the SQL SELECT query to run. There should be only **one** statement (subqueries are ok).
   * @param {Object} params When the SQL statement contains placeholders, you can pass them in here.
   * They will be bound to the statement before it is executed.
   * @returns an object containing the resulting headers (format: ['col1', 'col2'])
   * and items (format: [{col1: val1, col2: val2, ...}, ...]).
   */
  select (sql, params = null) {
    this.#checkState()

    // exec returns an array because it accepts multiple statements, but we don't.
    const res = this.#db.exec(sql, params)
    if (res.length > 1) {
      throw new Error(
        'Queries with multiple select statements are not supported'
      )
    } else if (res.length === 0) {
      // sql.js returns an empty array if no data is found,
      // but we return empty headers and items instead
      return { headers: [], items: [] }
    }
    const headers = res[0].columns
    const items = res[0].values.map(line =>
      Object.fromEntries(line.map((v, i) => [headers[i], v]))
    )
    return { headers, items }
  }

  /**
   * Close the database to free memory.
   */
  close () {
    if (this.#db) {
      this.#db.close()
      this.#db = null
      this.#tables = new Map()
    }
  }
}

/**
 * Create a database with tables
 * @param {Object} - database config
 * @returns {DB} new initialized database instance with tables
 */
export async function createDB ({ tables }) {
  const db = new DB()
  await db.init()
  tables.forEach(t => db.create(t))
  return db
}

/**
 * Generate database records, (possibly) recursively
 * @param {Object} defaultValues default values for every table
 * @param {Object} records stores the database records for each table
 * @param {} json current json
 * @param {*} root root json
 * @param {Object} - accessor config
 */
function generateRecordsRecursively (
  defaultValues,
  records,
  json,
  root,
  { table, path, getters = [], options = {} }
) {
  const jsonPathOptions = {
    ...options,
    path,
    json,
    // eslint-disable-next-line no-eval
    callback: eval(options.callback)
  }
  const result = JSONPath(jsonPathOptions) ?? []
  result.forEach((item) => {
    // initialize record with default values
    const record = { ...defaultValues[table] }
    // push the record to the end of the array of records
    // note: need to do that here because of recursion (*)
    records[table].push(record)
    getters.forEach((a) => {
      if (a.table && a.getters.length && a.path && !a.column) {
        // accessor configures records for a "sub-table"
        generateRecordsRecursively(defaultValues, records, item, root, a)
      } else if (a.column && a.reference && !a.path) {
        // column is a foreign key reference
        // (*) the reference record was pushed to the array by the caller
        const referenceRecords = records[a.reference.table]
        const refId = referenceRecords.length
        if (a.reference.autoincrementedId) {
          record[a.column] = refId
        } else {
          record[a.column] = referenceRecords[refId - 1][a.reference.column]
        }
      } else if (a.column && (a.path || a.pathKey)) {
        // column value can be found with JSONPath
        const value = JSONPath({
          ...(a.options || {}),
          json: a.queryRoot ? root : item,
          path: a.pathKey ? item[a.pathKey] : a.path,
          wrap: false
        })
        record[a.column] =
          typeof value === 'object'
            ? JSON.stringify(value)
            : String(value) || null
      } else if (a.column && a.value) {
        // hardcoded value
        record[a.column] = a.value
      } else {
        throw new Error(`Invalid getter: ${JSON.stringify(a)}`)
      }
    })
  })
}

/**
 * Generate database records
 * @param {DB} db database
 * @param {FileManager} fileManager file manager instance
 * @param {Object} - database config
 * @returns {Object} database records for each table
 */
export async function generateRecords (fileManager, { tables, getters }) {
  // default values for every table
  // { "Table1": { "col1": null, "col2", null, ... }, "Table2": ... }
  const defaultValues = Object.fromEntries(
    tables.map(({ name, columns }) => [
      name,
      Object.fromEntries(
        columns
          // disregard auto-incremented columns
          .filter(
            c => c.length === 2 || !c[2].toLowerCase().includes('autoincrement')
          )
          .map(c => (c.length > 2 ? [c[0], c[2]] : [c[0], null]))
      )
    ])
  )
  // object that stores the database records for each table
  // { "Table1": [], "Table2": [], ... }
  const records = Object.fromEntries(tables.map(({ name }) => [name, []]))

  // iterate over top level "file" getters
  for (const { fileId, ...rest } of getters) {
    if (fileId in fileManager.idToGlob) {
      const filesPaths = fileManager.getFilePathsFromId(fileId)

      let jsonTexts = []
      const isCSV = fileManager.idToGlob[fileId].endsWith('.csv')
      if (isCSV) {
        jsonTexts = await fileManager.getCsvItemsFromId(fileId)
      } else {
        // ...otherwise we assume JSON format by default
        // get all files that match the glob
        jsonTexts = await fileManager.getPreprocessedTextFromId(fileId)
      }

      const jsonFiles = jsonTexts.map((f, i) => {
        return {
          content: f,
          path: filesPaths[i]
        }
      })
      // iterate over matched files, parse, and generate records from each
      jsonFiles.forEach((file) => {
        try {
          const json = isCSV ? file.content : JSON.parse(file.content)

          // Update the current file path from defaultValues if needed
          const defaultValuesCopy = _.cloneDeep(defaultValues)
          Object.entries(defaultValuesCopy[rest.table]).forEach(([k, v]) => {
            if (v === 'FILEPATH') {
              defaultValuesCopy[rest.table][k] = file.path
            }
          })
          generateRecordsRecursively(
            defaultValuesCopy,
            records,
            json,
            json,
            rest
          )
        } catch (error) {
          console.error(error)
        }
      })
    }
  }
  return records
}

/**
 * Insert records into the database
 * @param {DB} db database instance
 * @param {Object} tableRecords contains the database records for each table
 */
export function insertRecords (db, tableRecords) {
  Object.entries(tableRecords).forEach(([table, records]) => {
    db.insert(table, records)
  })
}

export default {
  DB,
  createDB,
  generateRecords,
  insertRecords
}
