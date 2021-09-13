import { query, construct } from '@/utils/sparql'

const advertisersIntersection = async (rdfLocal, rdfPublic, username) => {
  const filterUser = `
  PREFIX :  <http://schema.org/>
  CONSTRUCT {
    ?advertiser a :Organization .
    ?advertiser :name ?name .
  }
  WHERE {
    ?advertiser a :Organization .
    ?advertiser :name ?name .
    ?advertiser :advertised ?person .
    ?person :name "${username}" .
  }
  `
  rdfPublic = await construct(rdfPublic, filterUser)

  const sparql = `
  PREFIX :  <http://schema.org/>
  SELECT ?name
  WHERE {
    ?advertiser a :Organization .
    ?advertiser :name ?name
  }
  ORDER BY ?name
  `
  const b1 = await query(rdfLocal, sparql)
  const b2 = await query(rdfPublic, sparql)
  const key = '?name'
  const header = key.substring(1)
  const advertisers1 = b1.map(binding => binding.get(key).value)
  const advertisers2 = b2.map(binding => binding.get(key).value)
  // TODO Optimize: O(n^2)
  const intersection = advertisers1.filter(item => advertisers2.includes(item))
  const items = intersection.map(b => ({ [header]: b }))
  return [[header], items]
}

export default {
  advertisersIntersection
}
