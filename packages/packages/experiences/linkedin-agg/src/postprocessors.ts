import type { PostprocessorFunction } from '@/types'
import { mapValues } from 'lodash'

// Convert the columns values separated by ';' to arrays
export const strToArray: PostprocessorFunction = result => {
  // TODO generalize this...
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  return {
    headers: Object.keys(items[0]),
    items: items.map(r => mapValues(r, v => v.split(';')))
  }
}
