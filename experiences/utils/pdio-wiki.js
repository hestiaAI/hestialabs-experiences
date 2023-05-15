
export const URL_PERSONALDATA_IO = 'query.personaldata.io/proxy/wdqs/bigdata/namespace/wdq/'

export const ITEM_ONLINE_DATING_APPLICATION = 'pdio:Q5066'
export const vocabulary = {
  items: {
    onlineDatingApplication: ITEM_ONLINE_DATING_APPLICATION,
    swisscom: 'pdio:Q988',
    instagram: 'pdio:Q165',
    dataController: 'pdio:Q96',
    swissDataController: 'pdio:Q991'
  },
  // https://wiki.personaldata.io/wiki/Special:ListProperties
  properties: {
    instanceOf: 'pdiot:P3',
    country: 'pdiot:P55',
    email: 'pdiot:P17',
    collects: 'pdiot:P10',
    requires: 'pdiot:P122',
    target: 'pdiot:P99'
  }
}

export const TEMPLATE_MAILTO_ACCESS = 'MailtoAccess'
export const TEMPLATE_MAILTO_SWISS_ACCESS = 'MailtoSwissAccess'

const { properties: p, items: i } = vocabulary

const sparqlEmailAndItemsOfInstance = item =>
`SELECT ?item ?itemLabel ?mail WHERE {
  ?item ${p.instanceOf} ${item}.
  ?item ${p.email} ?mail.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} `

export const sparqlEmailAndItemsTargetedBy = project =>
`SELECT ?item ?itemLabel ?mail WHERE {
  ${project} ${p.target} ?targeted.
  ?item ${p.instanceOf} ?targeted.
  ?item ${p.email} ?mail.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  # OPTIONAL { ?item pdiot:P17 ?mail. }
} `

export const sparqlDataControllerEmails = namePart =>
`SELECT DISTINCT ?name ?lang (SUBSTR(STR(?mailto), 8) AS ?email)
WHERE
{
  {?item ${p.instanceOf} ${i.dataController}; rdfs:label ?name.}
  UNION
  {?item ${p.instanceOf} ${i.swissDataController}; rdfs:label ?name.}
  FILTER (CONTAINS(LCASE(?name), "${namePart}")).
  {?item ${p.email} ?mailto .}
  BIND (LANG(?name) AS ?lang)
} `

// https://stackoverflow.com/questions/38349975/sparql-how-to-obtain-label-in-available-languages-if-first-option-is-not-availa
export const sparqlItemPropertiesLabel = (item, property, labelName = 'itemLabel', lang = 'en') => {
  const query = `SELECT ?${labelName} WHERE {
    ${item} ${property} ?personalData.
    ?personalData rdfs:label ?${labelName}
    filter langMatches(lang(?${labelName}), "en")
  }`
  return query
}

export async function query(sparqlQuery, apiUrl) {
  const response = await fetch(
      `https://${apiUrl}?origin=*&query=${encodeURIComponent(sparqlQuery)}`,
      { headers: { Accept: 'application/sparql-results+json' } }
  )
  const data = await response.json()
  return data
}

export function bindingsAsKeyVals(result) {
  const { head: { vars }, results: { bindings } } = result
  return bindings.map((binding) => {
    return vars.reduce((keyVals, v) => {
      if (binding[v]) {
        keyVals[v] = binding[v].value
      }
      return keyVals
    }, {})
  })
};

export function singleVarBindingsAsVals(result) {
  const { head: { vars }, results: { bindings } } = result
  const singlevar = vars[0]
  return bindings.map(binding => binding[singlevar]?.value)
};

export async function fetchOrgsOfInstance(item) {
  const sparql =
          sparqlEmailAndItemsOfInstance(item)
  const data = await query(sparql, URL_PERSONALDATA_IO)
  return bindingsAsKeyVals(data)
}

export async function fetchOrgsTargetedBy(item) {
  const sparql =
          sparqlEmailAndItemsTargetedBy(item)
  const data = await query(sparql, URL_PERSONALDATA_IO)
  return bindingsAsKeyVals(data)
}

export async function fetchDataControllerEmails(namePart = '') {
  const sparql = sparqlDataControllerEmails(namePart)
  const data = await query(sparql, URL_PERSONALDATA_IO)
  return bindingsAsKeyVals(data)
}
