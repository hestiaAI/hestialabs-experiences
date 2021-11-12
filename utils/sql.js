import initSqlJs from 'sql.js'

class DB {
  async init() {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
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
