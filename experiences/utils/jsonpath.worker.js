import { JSONPath } from 'jsonpath-plus'

self.onmessage = (message) => {
  const { json, arrayPath, columns } = message.data
  const rows = JSONPath({ json, path: arrayPath, resultType: 'all' })
  const results = []
  rows.forEach((r) => {
    const row = {}
    columns.forEach((c) => {
      row[c.name] = JSONPath({ json, path: r.path + c.selector, resultType: 'value' }).pop() || null
    })
    results.push(row)
  })
  self.postMessage(results)
}
