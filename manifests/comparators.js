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
  const headers = [{ text: 'Name', value: header }]
  return [headers, items]
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
  const headers = [
    { text: '# of advertisers (local)', value: header1 },
    { text: '# of advertisers (public average)', value: header2 }
  ]
  return [headers, items]
}

const impressionCountByAdvertiser = async (rdfLocal, rdfPublic, username) => {
  const sparqlPublic = `
  PREFIX :  <http://schema.org/>
  PREFIX ex: <http://www.example.com/>
  SELECT ?name ?count WHERE {
    ?advertiser a :Organization .
    ?advertiser :name ?name .
    ?person a :Person .
    ?person :name "${username}" .
    ?s a ex:AdvertiserCount .
    ?s ex:person ?person .
    ?s ex:advertiser ?advertiser .
    ?s ex:count ?count .
  }
  `
  const sparqlLocal = `
  PREFIX :   <http://schema.org/>
  PREFIX ex: <http://www.example.com/>
  SELECT ?name (COUNT(?imp) AS ?count)
  WHERE {
    ?imp a :AdvertiserContentArticle .
    ?imp :creator ?advertiser .
    ?advertiser :name ?name .
  }
  GROUP BY ?name
  `
  const b1 = await queryBindings(rdfLocal, sparqlLocal)
  const b2 = await queryBindings(rdfPublic, sparqlPublic)
  const itemMap = new Map()
  let totalLocal = 0
  let totalPublic = 0
  for (const binding of b1) {
    const name = binding.get('?name').value
    const count = parseInt(binding.get('?count').value)
    totalLocal += count
    itemMap.set(name, { name, countLocal: count, countPublic: 0 })
  }
  for (const binding of b2) {
    const name = binding.get('?name').value
    const count = parseInt(binding.get('?count').value)
    totalPublic += count
    if (itemMap.has(name)) {
      const counts = itemMap.get(name)
      counts.countPublic = count
      itemMap.set(name, counts)
    } else {
      itemMap.set(name, { name, countLocal: 0, countPublic: count })
    }
  }
  const items = Array.from(itemMap.values())
  items.forEach(item => {
    item.countLocal = ((item.countLocal / totalLocal) * 100).toPrecision(2)
    item.countPublic = ((item.countPublic / totalPublic) * 100).toPrecision(2)
  })
  const headers = [
    { text: 'Advertiser', value: 'name' },
    { text: 'Local ratio (%)', value: 'countLocal' },
    { text: 'Public ratio (%)', value: 'countPublic' }
  ]
  return [headers, items]
}

export default {
  advertisersIntersection,
  advertisersCountAvg,
  impressionCountByAdvertiser
}
