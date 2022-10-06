/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-prototype-builtins */
import type { PostprocessorFunction } from '@/types'

import { groupBy, sortBy } from 'lodash'
import createGraph from 'ngraph.graph'
import centrality from 'ngraph.centrality'

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

  const nodesToRemove = [
    'Chrome',
    'Firefox',
    'Samsung Internet',
    'Vivaldi Browser'
  ]
  const results = items.filter(
    row =>
      categoriesToKeep.includes(row.category) &&
      row.app &&
      row.app !== 'Unknown' &&
      !nodesToRemove.includes(row.app)
  )
  // compute links (note that this includes duplicate links)
  const allLinks = results.map(({ app: source, tracker: target }) => ({
    source,
    target
  }))
  // group duplicate links together
  const groupedLinks = groupBy(allLinks, v => `${v.source}>${v.target}`)
  // remove duplicates, and set the weight as the number of duplicate links
  const candidateLinks = Object.entries(groupedLinks).map(
    ([id, groupLinks]) => ({
      id,
      ...groupLinks[0],
      weight: groupLinks.length
    })
  )

  // reduce the size of the graph, by choosing
  // nodes with the highest degree in-centrality
  // https://github.com/anvaka/ngraph.centrality#degree-centrality
  // NOTE: This could also have been implemented by computing in-degree manually from the links.
  // However, the implementation with ngraph was kept here for demonstration.
  const graph = createGraph()
  // add links to the graph (duplicated links are ignored)
  candidateLinks.forEach(({ source, target }) => graph.addLink(source, target))
  // compute degree in-centrality (because we weigh nodes by the number of inbound links)
  const measures: [string, number][] = Object.entries(
    centrality.degree(graph, 'in')
  )
  const measuresFiltered = measures.filter(node => node[1] > 0)
  // sort nodes by in-centrality
  measuresFiltered.sort((a, b) => b[1] - a[1])
  // store the minimum number of nodes to keep,
  // and delete them from the original array with splice()
  const MIN_NUMBER_OF_NODES = 20
  const topMeasures = measuresFiltered.splice(0, MIN_NUMBER_OF_NODES)
  // include left-over nodes with the same centrality
  // // as the last node in the cut-off array
  // const lastNode = topMeasures[topMeasures.length - 1]
  // for (const node of measuresFiltered) {
  //   if (node[1] !== lastNode[1]) {
  //     break
  //   }
  //   topMeasures.push(node)
  // }

  // get the names of the top nodes
  const topNodes = topMeasures.map(node => node[0])
  // create a target node adjacency list
  // (i.e. list of inbound links for each selected target node)
  const candidateLinksFiltered = candidateLinks.filter(l =>
    topNodes.includes(l.target)
  )
  const candidateLinksGroupedByTarget = groupBy(
    candidateLinksFiltered,
    l => l.target
  )
  const candidateLinksGroupedAndSorted = Object.values(
    candidateLinksGroupedByTarget
  ).map(inboundLinks =>
    // sort the target node inbound links by the weight,
    // to prioritize heavy links over light
    sortBy(inboundLinks, [l => l.weight])
  )

  // add nodes from the set of candidate links
  // by picking the sources of the top-ranked links in
  // the sorted adjacency list
  const CANDIDATE_INCLUSION_RATIO = 0.5
  const selectedNodes = new Set(
    topNodes.concat(
      candidateLinksGroupedAndSorted
        .flatMap(inboundLinksSorted =>
          inboundLinksSorted.slice(
            0,
            Math.ceil(CANDIDATE_INCLUSION_RATIO * inboundLinksSorted.length)
          )
        )
        .map(link => link.source)
    )
  )

  // compute nodes and their weights
  const nodeWeights = candidateLinks.reduce(
    (acc: { [key: string]: number }, { source, target, weight }) => {
      // set default node weights
      if (!(source in acc)) {
        acc[source] = 1
      }
      if (!(target in acc)) {
        acc[target] = 1
      }
      // only inbound links contribute to node weight
      // (add overall weight)
      acc[target] += weight
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
  for (const k in nodeWeights) {
    // only include selected nodes
    if (selectedNodes.has(k)) {
      nodes.push({
        id: k,
        size: 8 + nodeWeights[k],
        color: colors[Math.min(colors.length - 1, nodeWeights[k])]
      })
    }
  }

  // filter the links by the selected nodes
  // note! this needs to be done after computing the nodes above
  const links = candidateLinks.filter(({ source, target }) =>
    [source, target].every(n => selectedNodes.has(n))
  )

  return {
    headers: ['jsonData'],
    items: [{ jsonData: { nodes, links } }]
  }
}
