import {
  mdiCodeJson,
  mdiFormatListBulletedSquare,
  mdiInformationOutline
} from '@mdi/js'
import lodash from 'lodash'

export default function itemifyJSON(jsonText) {
  let id = 0
  function itemifyRec(tree) {
    id++
    if (typeof tree !== 'object') {
      return { value: tree, icon: mdiInformationOutline }
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
          children,
          icon: mdiFormatListBulletedSquare
        }
      }
    } else {
      const children = Object.entries(tree).flatMap(([key, v]) => {
        const inner = itemifyRec(v)
        const name = lodash.startCase(key)
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
    }
  }
  return [itemifyRec(JSON.parse(jsonText))]
}
