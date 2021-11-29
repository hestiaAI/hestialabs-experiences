import {
  mdiCodeJson,
  mdiFormatListBulletedSquare,
  mdiInformationOutline
} from '@mdi/js'
import _ from 'lodash'

const groupSize = 50

export default function itemifyJSON(jsonText) {
  let id = 0
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
      } else if (children.length > groupSize) {
        const groups = _.chunk(children, groupSize).map((group, i) => ({
          id: id++,
          name: `[group ${i + 1} with elements ${groupSize * i + 1} - ${
            groupSize * i + group.length
          }]`,
          children: group,
          icon: mdiFormatListBulletedSquare
        }))
        id++
        return {
          id,
          name,
          children: groups,
          icon: mdiFormatListBulletedSquare
        }
      } else {
        return {
          id,
          name,
          children,
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
