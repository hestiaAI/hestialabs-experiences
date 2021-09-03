import { newEngine } from '@comunica/actor-init-sparql'

const N3 = require('n3')

const engine = newEngine()

// TODO put in a separate config file
const endpoint = 'http://localhost:3001/sparql'

export async function updateEndpoint(rdf) {
  const sparql = 'INSERT DATA { ' + rdf + ' }'

  const httpResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/sparql-update'
    },
    body: sparql
  })
  if (!httpResponse.ok) {
    throw new Error(
      `Invalid SPARQL endpoint response from ${endpoint} (HTTP status ${httpResponse.status}):\n`
    )
  }
}

export async function queryEndpoint() {
  const sparql = 'CONSTRUCT WHERE { ?s ?p ?o }'
  const result = await engine.query(sparql, {
    sources: [endpoint]
  })
  const quads = await result.quads()
  const writer = new N3.Writer()
  const data = writer.quadsToString(quads)
  return data
}
