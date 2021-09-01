// import { SparqlEndpointFetcher } from 'fetch-sparql-endpoint'
import { newEngine } from '@comunica/actor-init-sparql'
import { Store, Parser } from 'n3'

// const fetcher = new SparqlEndpointFetcher()
const engine = newEngine()

const endpoint = 'http://localhost:3001/sparql'

export async function updateEndpoint(rdf) {
  console.log('Sending data to ' + endpoint)

  const sparql = 'INSERT DATA { ' + rdf + ' }'
  const result = await engine.query(sparql, {
    destination: { type: 'sparql', value: endpoint }
  })
  await result.updateResult
  // await fetcher.fetchUpdate(endpoint, sparql)
  console.log('Data sent')
}

export async function updateEndpointWhere(sparql, sourceRdf) {
  console.log('Sending data to ' + endpoint)

  const parser = new Parser({ format: 'N3' })
  const quads = parser.parse(sourceRdf)
  const store = new Store(quads)

  const result = await engine.query(sparql, {
    sources: [store],
    destination: { type: 'sparql', value: endpoint }
  })
  await result.updateResult
  // store.forEach(console.log, null, null, null, null)
  console.log('Data sent')
}

export async function queryEndpoint(sparql) {
  console.log('Receiving data from ' + endpoint)

  const result = await engine.query(sparql, {
    sources: [endpoint]
  })
  const bindings = await result.bindings()

  console.log(bindings)
}
