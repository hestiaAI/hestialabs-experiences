import { newEngine } from '@comunica/actor-init-sparql-rdfjs'
import { Store, Parser, Writer } from 'n3'
// import { LoggerPretty } from '@comunica/logger-pretty'

/**
 * Execute a SPARQL SELECT query
 * @param {String} rdf the input RDF data
 * @param {String} sparql the SELECT query
 * @returns the output data as bindings
 */
export async function query(rdf, sparql) {
  const result = await _query(rdf, sparql)
  const bindings = await result.bindings()
  return bindings
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
