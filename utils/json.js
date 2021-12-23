import {
  mdiCodeJson,
  mdiFormatListBulletedSquare,
  mdiInformationOutline
} from '@mdi/js'
import _ from 'lodash'

/**
 * itemifyJSON transforms some JSON into a tree, suitable for a Vuetify VTreeview component.
 * @param {String} jsonText
 * @param {Function} filterCondition (optional) a function taking a leaf node as argument
 * and returning true if the node satifisfies the desired filter condition
 * @returns {Array} the tree
 */
export default function itemifyJSON(jsonText, filterCondition) {
  const groupsPerLevel = 10
  let id = 0
  function minifyList(list, base = 0) {
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
      children: minifyList(group, base + i * groupSize),
      icon: mdiFormatListBulletedSquare
    }))
  }
  function itemifyRec(tree) {
    id++
    if (typeof tree !== 'object') {
      // Leaf node (first part)
      return { id, value: tree, icon: mdiInformationOutline }
    } else if (Array.isArray(tree)) {
      // Array node
      const children = tree.flatMap(el => {
        const inner = itemifyRec(el)
        if (typeof inner.name === 'undefined') {
          // Leaf node (second part)
          if (filterCondition && !filterCondition(inner)) {
            return []
          }
        }
        return inner
      })
      if (!children.length) {
        return []
      }
      const plural = children.length > 1
      const name = `[list with ${children.length} item${plural ? 's' : ''}]`
      return {
        id,
        name,
        children: minifyList(children),
        icon: mdiFormatListBulletedSquare
      }
    } else if (tree !== null) {
      // Object node
      const children = Object.entries(tree).flatMap(([key, v]) => {
        const inner = itemifyRec(v)
        const name = _.startCase(key)
        if (typeof inner.name === 'undefined') {
          // Leaf node (second part)
          const leaf = { ...inner, name }
          if (filterCondition && !filterCondition(leaf)) {
            return []
          }
          return leaf
        } else {
          return { ...inner, name: `${name} / ${inner.name}` }
        }
      })
      if (!children.length) {
        return []
      } else {
        return {
          id,
          name: `{attributes ${Object.keys(tree)
            .map(k => _.startCase(k))
            .join(', ')}}`,
          children,
          icon: mdiCodeJson
        }
      }
    } else {
      return { id, value: 'null', icon: mdiInformationOutline }
    }
  }
  return [itemifyRec(JSON.parse(jsonText))]
}

export function nJsonPoints(json) {
  if (json === null) return 0
  else if (Array.isArray(json)) return json.length + _.sumBy(json, nJsonPoints)
  else if (_.isObject(json)) return nJsonPoints(Object.values(json))
  else return 1
}
