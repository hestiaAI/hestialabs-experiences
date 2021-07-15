import { Writer as N3Writer } from 'n3'
import YarrrmlParser from '@rmlio/yarrrml-parser/lib/rml-generator.js'

/**
 * Parses YARRRML to RML using yarrrml-parser
 * @param {String} yaml
 * @returns promise that when resolved returns the RML string
 */
export default yaml =>
  new Promise((resolve) => {
    const y2r = new YarrrmlParser()
    const yamlQuads = y2r.convert(yaml)
    let prefixes = {
      rr: 'http://www.w3.org/ns/r2rml#',
      rml: 'http://semweb.mmlab.be/ns/rml#',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      schema: 'http://schema.org/',
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      fnml: 'http://semweb.mmlab.be/ns/fnml#',
      fno: 'http://w3id.org/function/ontology#',
      mex: 'http://mapping.example.com/'
    }
    prefixes = { ...prefixes, ...y2r.getPrefixes() }

    const writer = new N3Writer({ prefixes })
    writer.addQuads(yamlQuads)
    writer.end((_, result) => {
      resolve(result)
    })
  })
