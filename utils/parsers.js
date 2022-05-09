import _ from 'lodash'

function commonPrefixAndSuffix(s1, s2) {
  const prefix = _.takeWhile(s1, (e, i) => e === s2[i]).join('')
  const suffix = _.takeRightWhile(s1, (e, i) => e === s2[i]).join('')
  return suffix !== prefix ? { prefix, suffix } : []
}

function groupSimilarEventValues(events) {
  const values = _.uniq(events.map(e => e.eventValue))
  const pairs = values.flatMap((v1, i1) =>
    values
      .filter((v2, i2) => i1 !== i2)
      .flatMap(v2 => commonPrefixAndSuffix(v1, v2))
  )
  const groups = _.groupBy(pairs, obj => JSON.stringify(obj))

  const commonPatterns = _.sortBy(
    Object.entries(groups),
    ([_, array]) => -array.length
  )
  commonPatterns.forEach(([json, array]) => {
    const { suffix, prefix } = JSON.parse(json)
    const regex = new RegExp(
      `${_.escapeRegExp(prefix)}(.+)${_.escapeRegExp(suffix)}`
    )
    if (suffix.includes(' ') || prefix.includes(' ')) {
      events
        .filter(e => !_.has(e, 'matched'))
        .forEach(e => {
          if (regex.test(e.eventValue)) {
            e.eventValue = e.eventValue.match(regex)[1]
            e.eventType = `${prefix}...${suffix}`
            e.matched = true
          }
        })
    }
  })
  events.forEach(e => delete e.matched)
  return events
}

function identifyTypeFromManifestList(events, params, match) {
  const types = Object.values(params.eventTypes).flatMap(obj =>
    Object.entries(obj)
      .filter(([folder]) => folder === match[1])
      .flatMap(([folder, types]) => types)
  )
  events.forEach(event => {
    event.eventType =
      _.find(types, t => event.eventValue.includes(t)) ?? 'unknown'
  })
  return events
}

export default {
  groupSimilarEventValues,
  identifyTypeFromManifestList
}