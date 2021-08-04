import { newEngine } from '@comunica/actor-init-sparql-rdfjs'
import { Store, Parser } from 'n3'
// import { LoggerPretty } from '@comunica/logger-pretty'

export default async function(rdf, sparql) {
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
