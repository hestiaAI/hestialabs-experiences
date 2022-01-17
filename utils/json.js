import _ from 'lodash'

function filterCondition(item, filter) {
  filter = filter.toLowerCase()
  return (
    (item.name && `${item.name}`.toLowerCase().includes(filter)) ||
    (item.value && `${item.value}`.toLowerCase().includes(filter))
  )
}

export const nodeTypes = { tree: 'tree', list: 'list', leaf: 'leaf' }

/**
 * itemifyJSON transforms some JSON into a tree, suitable for a Vuetify VTreeview component.
 * @param {String} jsonText
 * @param {Function} filterCondition (optional) a function taking a leaf node as argument
 * and returning true if the node satifisfies the desired filter condition
 * @returns {Array} the tree
 */
export default function itemifyJSON(jsonText, filter) {
  const groupsPerLevel = 10
  let id = 0
  function minifyList(list, path, base = 0) {
    if (list.length <= groupsPerLevel) return list
    const groupSize = Math.pow(
      groupsPerLevel,
      Math.floor(Math.log(list.length - 1) / Math.log(groupsPerLevel))
    )
    return _.chunk(list, groupSize).map((group, i) => ({
      id: ++id,
      name: `[elements ${base + groupSize * i + 1} - ${
        base + groupSize * i + group.length
      }]`,
      path,
      children: minifyList(group, path, base + i * groupSize),
      type: nodeTypes.list
    }))
  }
  function itemifyRec(tree, path) {
    id++
    if (typeof tree !== 'object') {
      // Leaf node (first part)
      return {
        id,
        value: tree,
        type: nodeTypes.leaf,
        path
      }
    } else if (Array.isArray(tree)) {
      // Array node
      const children = tree.flatMap((el, ci) => {
        const inner = itemifyRec(el, [...path, ci])
        if (typeof inner.name === 'undefined') {
          // Leaf node (second part)
          if (filter && !filterCondition(inner, filter)) {
            return []
          }
        }
        return inner
      })
      if (!children.length && filter) {
        // hide empty arrays when filtering
        return []
      }
      const arrayItem = {
        id,
        path,
        name: formatArray(children),
        type: nodeTypes.list
      }
      if (children.length) {
        arrayItem.children = minifyList(children, path)
      }
      return arrayItem
    } else if (tree !== null) {
      // Object node
      const children = Object.entries(tree).flatMap(([key, v]) => {
        const inner = itemifyRec(v, [...path, key])
        const name = _.startCase(key)
        if (typeof inner.name === 'undefined') {
          // Leaf node (second part)
          const leaf = { ...inner, name }
          if (filter && !filterCondition(leaf, filter)) {
            return []
          }
          return leaf
        } else {
          return { ...inner, name: `${name} / ${inner.name}` }
        }
      })
      if (!children.length && filter) {
        // hide empty objects when filtering
        return []
      }
      const objectItem = {
        id,
        name: formatObject(tree),
        path,
        type: nodeTypes.tree
      }
      if (children.length) {
        objectItem.children = children
      }
      return objectItem
    } else {
      return { id, value: 'null', type: nodeTypes.leaf, path }
    }
  }
  return [itemifyRec(JSON.parse(jsonText), [])]
}

export function formatObject(object) {
  if (!object) {
    // null is of type object
    return object
  }
  const keys = Object.keys(object)
  if (keys.length === 0) {
    return '{no attributes}'
  }
  return `{attributes ${keys.map(k => _.startCase(k)).join(', ')}}`
}

export function formatArray(array) {
  if (array.length === 0) {
    return '[empty list]'
  }
  const plural = array.length > 1
  return `[list with ${array.length} item${plural ? 's' : ''}]`
}

export function pathArrayToJsonPath(pathArray) {
  return (
    '$' +
    pathArray.reduce((path, el) => {
      path += isNaN(el) ? `['${el}']` : `[${el}]`
      return path
    }, '')
  )
}

export function nJsonPoints(json) {
  if (json === null) return 0
  else if (Array.isArray(json)) return json.length + _.sumBy(json, nJsonPoints)
  else if (_.isObject(json)) return nJsonPoints(Object.values(json))
  else return 1
}
