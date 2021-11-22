// Note: this is a copy of the function in twitter/postprocessors.js
// We are facing a trade-off between having independent experiences and sharing some components.
const sunburstTargetingAdvertiser = result => {
  const items = result?.items || []
  const results = []
  const tree = new Map()
  // Construct tree: Root -> TargetingType -> [TargetingValue, count]
  for (const item of items) {
    const targetingType = item.targetingType
    const targetingValue = item.targetingValue
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
  return { headers: Object.keys(root), items: results }
}

export default {
  sunburstTargetingAdvertiser
}
