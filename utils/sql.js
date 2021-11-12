import initSqlJs from 'sql.js'
// eslint-disable-next-line import/no-webpack-loader-syntax
import sqlWasm from '!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm'

class DB {
  async init() {
    const SQL = await initSqlJs({
      locateFile: () => sqlWasm
    })
    this.db = new SQL.Database()
  }

  run(sql) {
    this.db.run(sql)
  }

  select(sql) {
    const res = this.db.exec(sql)[0]
    const headers = res.columns
    const items = res.values.map(line =>
      Object.fromEntries(line.map((v, i) => [headers[i], v]))
    )
    return { headers, items }
  }
}

export default new DB()
