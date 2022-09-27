/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-prototype-builtins */
import type { PostprocessorFunction } from '@/types'

const createGraph = require('ngraph.graph')
const centrality = require('ngraph.centrality')

export const toGraph: PostprocessorFunction = result => {
  // TODO generalize this...
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const categoriesToKeep = [
    'FingerprintingGeneral',
    'FingerprintingInvasive',
    'Advertising'
  ]

  const nodesToRemove = ['Chrome', 'Firefox', 'Samsung Internet']
  const results = items.filter(
    row =>
      categoriesToKeep.includes(row.category) &&
      row.app &&
      row.app !== 'Unknown' &&
      !nodesToRemove.includes(row.app)
  )

  // compute links
  let links = results.map(({ app: source, tracker: target }) => ({
    source,
    target,
    weight: 1 // all links have the same weight
  }))

  // reduce the size of the graph, by choosing
  // nodes with the highest degree in-centrality
  // https://github.com/anvaka/ngraph.centrality#degree-centrality
  const graph = createGraph()
  // add links to the graph
  links.forEach(({ source, target }) => graph.addLink(source, target))
  // compute degree in-centrality (because we weigh nodes by the number of inbound links)
  const measures: [string, number][] = Object.entries(
    centrality.degree(graph, 'in')
  )
  const measuresFiltered = measures.filter(node => node[1] > 1)
  // sort nodes by in-centrality
  measuresFiltered.sort((a, b) => b[1] - a[1])
  // store the minimum number of nodes to keep,
  // and delete them from the original array with splice()
  const MIN_NUMBER_OF_NODES = 20
  const topMeasures = measuresFiltered.splice(0, MIN_NUMBER_OF_NODES)
  // include left-over nodes with the same centrality
  // as the last node in the cut-off array
  const lastNode = topMeasures[topMeasures.length - 1]
  for (const node of measuresFiltered) {
    if (node[1] !== lastNode[1]) {
      break
    }
    topMeasures.push(node)
  }

  // get the names of the top nodes
  const topNodes = topMeasures.map(node => node[0])

  // compute nodes and their weights
  const temp = links.reduce(
    (acc: { [key: string]: number }, { source, target }) => {
      // set default node weights
      if (!(source in acc)) {
        acc[source] = 1
      }
      if (!(target in acc)) {
        acc[target] = 1
      }
      // only inbound links contribute to node weight
      acc[target]++
      return acc
    },
    {}
  )
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
    // only include top nodes
    if (topNodes.includes(k)) {
      nodes.push({
        id: k,
        weight: temp[k],
        size: 10 + temp[k] - 1 * 2,
        color: colors[Math.min(colors.length - 1, temp[k])]
      })
    }
  }

  // filter the links by the top nodes
  // note! this needs to be done after computing the nodes above
  links = links.filter(({ source, target }) =>
    [source, target].every(n => topNodes.includes(n))
  )

  console.log(nodes, links, topMeasures)

  return {
    headers: ['jsonData'],
    items: [{ jsonData: { nodes, links } }]
  }
}
