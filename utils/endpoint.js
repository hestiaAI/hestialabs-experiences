import { newEngine } from '@comunica/actor-init-sparql'

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

export async function queryEndpoint(sparql) {
  const result = await engine.query(sparql, {
    sources: [endpoint]
  })
  const bindings = await result.bindings()

  return bindings
}
