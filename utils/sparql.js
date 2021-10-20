import { newEngine } from '@comunica/actor-init-sparql-rdfjs'
import { translate } from 'sparqlalgebrajs'
import { Store as N3Store } from 'n3'

class Store {
  constructor() {
    this.engine = newEngine()
    this.store = new N3Store()
  }

  async replaceQuads(quads) {
    this.store = await Promise.resolve(new N3Store(quads))
  }

  /**
   * Execute a SPARQL query
   * @param {String} query
   * @returns {Object} results
   */
  async sparql(query) {
    const result = await this.engine.query(query, {
      sources: [this.store]
    })
    return result
  }

  /**
   * Execute a SPARQL SELECT query
   * @param {String} query the SPARQL query
   * @returns {Object} headers and items
   */
  async select(query) {
    const result = await this.sparql(query)
    const bindings = await result.bindings()
    const { variables: vars } = translate(query)

    // headers are selected variable names name without the '?'
    const headers = vars.map(v => v.value)
    const variables = headers.map(v => `?${v}`)

    // Transform bindings to a list of objects having the headers as keys
    const items = bindings.map(map =>
      Object.fromEntries(
        variables.map((variable, index) => {
          // map.get(k) returns an N3 Term
          // https://github.com/rdfjs/N3.js/blob/main/src/N3DataFactory.js
          // if value is undefined, fallback to null
          const { value = null } = map.get(variable)
          return [headers[index], value]
        })
      )
    )
    return { headers, items }
  }
}

export default new Store()
