import { queryBindings, construct } from '@/utils/sparql'

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
  const b1 = await queryBindings(rdfLocal, sparql)
  const b2 = await queryBindings(rdfPublic, sparql)
  const key = '?name'
  const header = key.substring(1)
  const advertisers1 = b1.map(binding => binding.get(key).value)
  const advertisers2 = b2.map(binding => binding.get(key).value)
  // TODO Optimize: O(n^2)
  const intersection = advertisers1.filter(item => advertisers2.includes(item))
  const items = intersection.map(b => ({ [header]: b }))
  return [[header], items]
}

const advertisersCountAvg = async (rdfLocal, rdfPublic) => {
  const sparqlPublic = `
  PREFIX :  <http://schema.org/>
  SELECT ?nAdvertisers
  WHERE {
    ?person a :Person .
    ?person :hasAdvertiserCount ?nAdvertisers .
  }
  `
  const sparqlLocal = `
  PREFIX :  <http://schema.org/>
  SELECT (COUNT(?advertiser) as ?nAdvertisers) WHERE { 
    ?advertiser a :Organization .
    ?advertiser :name ?name .
  } 
  `
  const b1 = await queryBindings(rdfLocal, sparqlLocal)
  const b2 = await queryBindings(rdfPublic, sparqlPublic)
  const key = '?nAdvertisers'
  const header1 = 'nAdvertisersLocal'
  const header2 = 'nAdvertisersAvg'
  const nLocal = b1.map(binding => binding.get(key).value)[0]
  const nAdvertisers = b2.map(binding => parseInt(binding.get(key).value))
  const avg = nAdvertisers.reduce((a, b) => a + b, 0) / nAdvertisers.length
  const items = [{ [header1]: nLocal, [header2]: avg }]
  return [[header1, header2], items]
}

// eslint-disable-next-line require-await
const impressionCountByAdvertiser = async (rdfLocal, rdfPublic, username) => {
  throw new Error('Not implemented')
}

export default {
  advertisersIntersection,
  advertisersCountAvg,
  impressionCountByAdvertiser
}
