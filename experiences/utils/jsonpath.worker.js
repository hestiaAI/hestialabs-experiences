import { JSONPath } from 'jsonpath-plus'
import { timeFormat, timeParse } from 'd3-time-format'
self.onmessage = (message) => {
  const { json, arrayPath, columns } = message.data

  columns.forEach((c) => {
    if ('timeParse' in c) {
      c.timeParse = timeParse(c.timeParse)
    }
    if ('timeFormat' in c) {
      c.timeFormat = timeFormat(c.timeFormat)
    }
  })

  const rows = JSONPath({ json, path: arrayPath, resultType: 'all' })
  const results = []
  rows.forEach((r) => {
    const row = {}
    columns.forEach((c) => {
      const result = JSONPath({ json, path: r.path + c.selector, resultType: 'value' }).pop()
      switch (typeof result) {
        case 'string':
          row[c.name] = decodeURIComponent(unescape(result))
          if (row[c.name] && 'timeParse' in c) {
            row[c.name] = c.timeParse(row[c.name])

            if ('timeFormat' in c) {
              row[c.name] = c.timeFormat(row[c.name])
            }
          }
          break
        case 'boolean':
          row[c.name] = result ? 'True' : 'False'
          break
        default:
          row[c.name] = result || null
      }
    })
    if (!Object.values(row).every(v => v === null)) { results.push(row) }
  })
  self.postMessage(results)
}
