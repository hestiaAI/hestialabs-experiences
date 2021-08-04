import { newEngine } from '@comunica/actor-init-sparql-rdfjs'
import { Store, Parser } from 'n3'
import { LoggerPretty } from '@comunica/logger-pretty'

export default async function(rdf, sparql) {
  const parser = new Parser({ format: 'N3' })
  const quads = parser.parse(rdf)
  const store = new Store(quads)
  const myEngine = newEngine()
  const result = await myEngine.query(sparql, {
    sources: [store],
    log: new LoggerPretty({ level: 'debug' })
  })
  const bindings = await result.bindings()
  let string = ''
  bindings.forEach(map => {
    for (const k of map.keys()) {
      // map.get(k) returns an N3 Term
      // https://github.com/rdfjs/N3.js/blob/main/src/N3DataFactory.js
      string += `${map.get(k).value} `
    }
    string += '\n'
  })
  // console.log(bindings[0].get('?name').value)
  // console.log(bindings)
  return string
  // const { data } = await myEngine.resultToString(result)
  // console.log(data)
  // data.pipe(console.log)
  // return data.toString()
}
