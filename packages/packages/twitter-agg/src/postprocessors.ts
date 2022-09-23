/* eslint-disable no-prototype-builtins */
import type { PostprocessorFunction } from '@/types'
import { Dictionary } from 'lodash'

export const toGraph: PostprocessorFunction = result => {
  // TODO generalize this...
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const allInterests: Dictionary<number> = {}
  const interestSets: Array<Set<string>> = []
  items.forEach(u => {
    const interests: Set<string> = JSON.parse(u.interests).map(
      (i: { name: string }) => i.name
    )
    interestSets.push(interests)
    if (interests) {
      interests.forEach(i => {
        if (allInterests[i]) allInterests[i] += 1
        else allInterests[i] = 1
      })
    }
  })

  // Create items array
  const nodes = Object.keys(allInterests)
    .map(key => {
      return { id: key, weight: allInterests[key] }
    })
    .sort((first, second) => second.weight - first.weight)
    .slice(0, 30)
  const nodeSet: Set<string> = new Set(nodes.map(n => n.id))
  const links = []
  interestSets.forEach(i => {
    console.log(new Set([...i].filter(x => nodeSet.has(x))))
    links.push()
  })
  console.log(nodes)
  // console.log(allInterests)
  /*
  const categoriesToKeep = [
    'FingerprintingGeneral',
    'FingerprintingInvasive',
    'Advertising'
  ]

  let results = items.filter(
    row => categoriesToKeep.includes(row.category) && row.app !== 'Unknown'
  )
  results = results.map(o => {
    return { app: o['app'], tracker: o['tracker'] }
  })
  const nodesToRemove = ['Chrome', 'Firefox', 'Samsung Internet']
  results = results.filter(row => !nodesToRemove.includes(row.app))
  const links = results.map(function (item) {
    return { source: item.app, target: item.tracker, weight: 1 }
  })

  const temp = results.reduce((p, c) => {
    if (!p.hasOwnProperty(c.app)) {
      p[c.app] = 1
    }
    if (!p.hasOwnProperty(c.tracker)) {
      p[c.tracker] = 1
    }
    p[c.tracker]++
    return p
  }, {})
  const nodes = []
  const colors = [
    '#655FB5',
    '#8D88C8',
    '#ACA9D8',
    '#CCCBE6',
    '#EBEBF6',
    '#FFFFFF'
  ].reverse()
  for (const k in temp) {
    nodes.push({
      id: k,
      weight: temp[k],
      size: 10 + temp[k] - 1 * 2,
      color: colors[Math.min(colors.length - 1, temp[k])]
    })
  }
  */
  return {
    headers: ['jsonData'],
    items: [{ jsonData: { nodes: [], links: [] } }]
  }
}
