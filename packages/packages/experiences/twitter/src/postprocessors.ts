import type { PostprocessorFunction } from '@/types'

export const sunburstTargeting: PostprocessorFunction = result => {
  // TODO generalize this...
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const results = []
  const tree = new Map()
  // Construct tree: Root -> AdvertiserName -> TargetingType -> [TargetingValue, count]
  for (const item of items) {
    const { advertiserName: advertiser, targetingType, targetingValue } = item
    const count = parseInt(item.count_)
    if (!tree.has(advertiser)) {
      tree.set(advertiser, new Map())
    }
    const subtree = tree.get(advertiser)
    if (!subtree.has(targetingType)) {
      subtree.set(targetingType, [])
    }
    const leaves = subtree.get(targetingType)
    leaves.push([targetingValue, count])
  }
  // Flatten tree into CSV. Give IDs and propagate aggregated counts to parents
  let id = 0
  let rootValue = 0
  const rootID = id
  for (const [advertiser, subtree] of tree.entries()) {
    id += 1
    const advertiserID = id
    let advertiserValue = 0
    for (const [targetingType, leaves] of subtree.entries()) {
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
          group: advertiser,
          parent: targetingTypeID,
          size: count
        })
      }
      advertiserValue += targetingTypeValue
      results.push({
        id: targetingTypeID,
        name: targetingType,
        value: targetingTypeValue,
        group: advertiser,
        parent: advertiserID,
        size: null
      })
    }
    rootValue += advertiserValue
    results.push({
      id: advertiserID,
      name: advertiser,
      value: advertiserValue,
      group: advertiser,
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
