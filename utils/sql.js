import initSqlJs from 'sql.js'
import sqlWasm from 'sql.js/dist/sql-wasm.wasm'

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
  constructor(name, columns) {
    // Sanity check: allow only alphanumeric names and correct types
    const r = /^[a-z0-9]+$/i
    if (!r.test(name)) {
      throw new Error('Invalid table name (should be alphanumeric).')
    }
    const validTypes = ['integer', 'text', 'float', 'date']
    for (const c of columns) {
      if (c.length !== 2) {
        throw new Error('Columns should be defined by a name and a type.')
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
    this.#datatypes = Object.fromEntries(columns)
  }

  getColumnNames() {
    return this.#columnNames.slice()
  }

  datatype(column) {
    return this.#datatypes[column]
  }
}

/**
 * Class DB is a wrapper around a sql.js database.
 * It provides functions for interacting with the database and processing the results into objects.
 */
class DB {
  #db
  #tables

  constructor() {
    this.#db = null
    this.#tables = new Map()
  }

  #checkState() {
    if (!this.#db) {
      throw new Error('The database has not been initialized.')
    }
  }

  /**
   * Asynchronously initialize the database.
   */
  async init() {
    // If a database already exists, close it.
    if (this.#db) {
      this.close()
    }
    const SQL = await initSqlJs({
      locateFile: () => sqlWasm
    })
    this.#db = new SQL.Database()
  }

  /**
   * Create a new table.
   * @param {String} table the name of the table to create.
   * @param {Array<Array<String>>} columns an array of columns, each column being an array containing the the name and the type.
   */
  create(tableName, columns) {
    this.#checkState()

    if (this.#tables.has(tableName)) {
      throw new Error('A table with this name already exists.')
    }
    const table = new Table(tableName, columns)
    this.#tables.set(tableName, table)
    const cols = table
      .getColumnNames()
      .map((c, i) => `${c} ${table.datatype(c)}`)
    const statement = `CREATE TABLE ${tableName} (${cols.join(', ')})`
    this.#db.run(statement)
  }

  /**
   * Insert all the given items in the database.
   * @param {String} table the table in which we insert the values.
   * @param {Array<Object>} items an array of rows to insert. Each row should contain the same attributes.
   */
  insert(tableName, items) {
    this.#checkState()

    if (!this.#tables.has(tableName)) {
      throw new Error('This table does not exist.')
    }
    const table = this.#tables.get(tableName)
    const columns = table.getColumnNames()
    const placeholders = columns.map(_ => '?')
    const sql = `INSERT INTO ${tableName} VALUES (${placeholders.join(', ')});`
    items.forEach(item => {
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
  select(sql, params = null) {
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
  close() {
    if (this.#db) {
      this.#db.close()
      this.#db = null
      this.#tables = new Map()
    }
  }
}

export default new DB()
