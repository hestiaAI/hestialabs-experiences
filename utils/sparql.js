import { newEngine } from '@comunica/actor-init-sparql-rdfjs'
import { Store, Parser, Writer } from 'n3'
// import { LoggerPretty } from '@comunica/logger-pretty'

async function _query(rdf, sparql) {
  const parser = new Parser({ format: 'N3' })
  const triples = parser.parse(rdf)
  const store = new Store(triples)
  const myEngine = newEngine()
  const result = await myEngine.query(sparql, {
    sources: [store]
    // log: new LoggerPretty({ level: 'debug' })
  })
  return result
}

/**
 * Execute a SPARQL SELECT query
 * @param {String} rdf the input RDF data
 * @param {String} sparql the SELECT query
 * @returns the output data as bindings
 */
export async function queryBindings(rdf, sparql) {
  const result = await _query(rdf, sparql)
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
    // This version would be better (it does not include missing values)
    // But Vega does not handle this format
    // const res = []
    // for (const i in keys) {
    //   const v = map.get(keys[i])
    //   if (typeof v !== 'undefined') {
    //     res.push([headers[i], v.value])
    //   }
    // }
    // return Object.fromEntries(res)
    Object.fromEntries(
      keys.map((key, index) => {
        // map.get(k) returns an N3 Term
        // https://github.com/rdfjs/N3.js/blob/main/src/N3DataFactory.js
        const v = map.get(key)
        if (typeof v === 'undefined') {
          // FIXME the value for missing values should not be '0'
          // But we keep this hack until 2021-09-16.
          // Then we should find a way to handle missing data in Vega
          return [headers[index], '0']
        }
        return [headers[index], v.value]
      })
    )
  )
  return [headers, items]
}

/**
 * Execute a SPARQL CONSTRUCT query
 * @param {String} rdf the input RDF data
 * @param {String} sparql the CONSTRUCT query
 * @returns the output data as a String
 */
export async function construct(rdf, sparql) {
  const result = await _query(rdf, sparql)
  const quads = await result.quads()
  const writer = new Writer()
  const data = writer.quadsToString(quads)
  return data
}
