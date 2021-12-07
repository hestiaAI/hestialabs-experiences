import {
  mdiCodeJson,
  mdiFormatListBulletedSquare,
  mdiInformationOutline
} from '@mdi/js'
import _ from 'lodash'

export default function itemifyJSON(jsonText) {
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
      return { id, value: tree, icon: mdiInformationOutline }
    } else if (Array.isArray(tree)) {
      const children = tree.flatMap(el => itemifyRec(el))
      const plural = children.length !== 1
      const name = `[list with ${children.length} item${plural ? 's' : ''}]`
      if (!plural && children[0].name) {
        return {
          id,
          name: `${name} / ${children[0].name}`,
          children: children[0].children,
          icon: children[0].icon
        }
      } else {
        return {
          id,
          name,
          children: minifyList(children),
          icon: mdiFormatListBulletedSquare
        }
      }
    } else if (tree !== null) {
      const children = Object.entries(tree).flatMap(([key, v]) => {
        const inner = itemifyRec(v)
        const name = _.startCase(key)
        if (typeof inner.name === 'undefined') {
          return { ...inner, name }
        } else {
          return { ...inner, name: `${name} / ${inner.name}` }
        }
      })
      if (children.length === 1) {
        return children[0]
      } else {
        return {
          id,
          name: `{object with ${children.length} keys}`,
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
