import _ from 'lodash'

function findK(arr) {
  let kMin = 0
  for (let j = 1; j <= Math.max.apply(Math, arr); j++) {
    const l = arr.filter(x => x <= j)
    if (l.length >= j) {
      kMin = j
      break
    }
  }
  return kMin
}

function avg(arr) {
  const sum = arr.reduce((a, b) => a + b, 0)
  return sum / arr.length || 0
}

function filterOut(arr, k) {
  return arr.filter(x => x.k <= k)
}

export function kAnonymityFilter(values, groupKey, otherKeys) {
  const table = []
  if (groupKey.length === 1) {
    const grouped = _.groupBy(values, groupKey[0])
    const keys = Object.keys(grouped)
    for (let i = 0; i < keys.length; i++) {
      const x = keys[i]
      const elem = {}
      elem[groupKey[0]] = x
      const kMin = findK(grouped[x].map(v => v.k))
      const rest = filterOut(grouped[x], kMin)
      for (let j = 0; j < otherKeys.length; j++) {
        elem[otherKeys[j]] = avg(rest.map(x => x[otherKeys[j]]))
      }
      elem.k = kMin
      table.push(elem)
    }
  } else if (groupKey.length === 2) {
    const grouped = _.groupBy(values, n => [n[groupKey[0]], n[groupKey[1]]])
    const keys = Object.keys(grouped)
    for (let i = 0; i < keys.length; i++) {
      const x = keys[i]
      const elem = {}
      elem[groupKey[0]] = x.substring(0, x.indexOf(','))
      elem[groupKey[1]] = x.substring(x.indexOf(',') + 1)
      const kMin = findK(grouped[x].map(v => v.k))
      elem.k = kMin
      const rest = filterOut(grouped[x], kMin)
      for (let j = 0; j < otherKeys.length; j++) {
        elem[otherKeys[j]] = avg(rest.map(x => x[otherKeys[j]]))
      }
      table.push(elem)
    }
  }
  const res = table.filter(x => x.k > 0)
  return res
}
