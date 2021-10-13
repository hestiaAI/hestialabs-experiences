import { newEngine } from '@comunica/actor-init-sparql-rdfjs'
import { Store, Parser } from 'n3'
// import { LoggerPretty } from '@comunica/logger-pretty'

/**
 * Execute a SPARQL SELECT query
 * @param {String} rdf the input RDF data
 * @param {String} sparql the SELECT query
 * @returns the output data as bindings
 */
export async function queryBindings(rdf, sparql) {
  const parser = new Parser({ format: 'N3' })
  const quads = parser.parse(rdf)
  const store = new Store(quads)
  const myEngine = newEngine()
  const result = await myEngine.query(sparql, {
    sources: [store]
    // log: new LoggerPretty({ level: 'debug' })
  })
  const bindings = await result.bindings()
  return bindings
}

/**
 * Execute a SPARQL SELECT query
 * @param {String} rdf the input RDF data
 * @param {String} sparql the SELECT query
 * @returns the headers and items as an array: [headers, items]
 */
export async function queryHeadersItems(rdf, sparql) {
  const bindings = await queryBindings(rdf, sparql)
  // const keys = Array.from((bindings[0] || new Map()).keys())
  // Find all the keys
  let keys = new Set()
  for (const binding of bindings) {
    for (const key of binding) {
      keys.add(key[0])
    }
  }
  keys = Array.from(keys)
  // Headers are key name without the '?'
  const headers = keys.map(k => k.substring(1))
  // Transform bindings to a list of objects having the headers as keys
  const items = bindings.map(map =>
    Object.fromEntries(
      keys.map((key, index) => {
        // map.get(k) returns an N3 Term
        // https://github.com/rdfjs/N3.js/blob/main/src/N3DataFactory.js
        // if value is undefined, fallback to null
        const { value = null } = map.get(key)
        return [headers[index], value]
      })
    )
  )
  return [headers, items]
}
