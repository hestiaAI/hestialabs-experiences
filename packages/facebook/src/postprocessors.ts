import type { PostprocessorFunction } from 'types/view-block'

export const sunburstTargetingAdvertiser: PostprocessorFunction = result => {
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const results = []
  const tree = new Map()
  // Construct tree: Root -> TargetingType -> [TargetingValue, count]
  for (const item of items) {
    const { targetingType, targetingValue } = item
    const count = parseInt(item.count)
    if (!tree.has(targetingType)) {
      tree.set(targetingType, [])
    }
    const leaves = tree.get(targetingType)
    leaves.push([targetingValue, count])
  }
  // Flatten tree into CSV. Give IDs and propagate aggregated counts to parents
  let id = 0
  let rootValue = 0
  const rootID = id
  for (const [targetingType, leaves] of tree.entries()) {
    id += 1
    const targetingTypeID = id
    let targetingTypeValue = 0
    for (const [targetingValue, count] of leaves) {
      id += 1
      targetingTypeValue += count
      results.push({
        id,
        name: targetingValue,
        value: count,
        group: targetingType,
        parent: targetingTypeID,
        size: count
      })
    }
    rootValue += targetingTypeValue
    results.push({
      id: targetingTypeID,
      name: targetingType,
      value: targetingTypeValue,
      group: targetingType,
      parent: rootID,
      size: null
    })
  }
  const root = {
    id: rootID,
    name: 'All',
    value: rootValue,
    group: 'All',
    parent: null,
    size: null
  }
  results.push(root)
  console.log('sunburst-targeting!', results, Object.keys(root))
  return { headers: Object.keys(root), items: results }
}
