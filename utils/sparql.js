import { newEngine } from '@comunica/actor-init-sparql-rdfjs'
import { Store, Parser } from 'n3'
// import { LoggerPretty } from '@comunica/logger-pretty'
import { translate } from 'sparqlalgebrajs'

/**
 * Execute a SPARQL SELECT query
 * @param {String} rdf the input RDF data
 * @param {String} sparql the SELECT query
 * @returns the output data as bindings
 */
async function selectBindings(rdf, sparql) {
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
export async function select(rdf, sparql) {
  const bindings = await selectBindings(rdf, sparql)
  // get all the variables
  const { variables } = translate(sparql)
  // headers are selected variable names name without the '?'
  const headers = variables.map(v => v.value)

  // Transform bindings to a list of objects having the headers as keys
  const items = bindings.map(map =>
    Object.fromEntries(
      headers.map(header => {
        // map.get(k) returns an N3 Term
        // https://github.com/rdfjs/N3.js/blob/main/src/N3DataFactory.js
        // if value is undefined, fallback to null
        const { value = null } = map.get(`?${header}`)
        return [header, value]
      })
    )
  )
  return { headers, items }
}

export default {
  select
}
